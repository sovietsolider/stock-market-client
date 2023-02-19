<template>
  <div class="container-fluid w-25" v-if="isLoaded">
    <div class="card text-white bg-dark mt-3 mb-3">
      <div class="card-header">Broker</div>
      <div class="card-body">
        <h5 class="card-title" id="person_name">{{getBrokerById().name}}</h5>
        <p class="card-text" id="person_money">Money: {{Number(getBrokerById().money).toFixed(Number(2))}}</p>
        <div v-for="stock in getBrokerById().stocks" :key="stock.name">
          <div class="card bg-dark border border-dark">
            <div class="badge text-wrap mb-2 mt-3 card-badge" v-bind:style="Number(Number(stock.profit)+Number(cur_prices[stock.name])).toFixed(Number(2)) > 0 ? {'background-color': 'green'} : {'background-color': 'red'}">{{stock.name}}</div>
            <div class="badge text-dark bg-light text-wrap mb-2 card-badge"> Amount {{stock.amount}}</div>
            <div class="badge bg-light text-wrap card-badge" v-bind:style="Number(Number(stock.profit)+Number(cur_prices[stock.name])).toFixed(Number(2)) > 0 ? {color: 'green'} : {color: 'red'}">{{Number(Number(stock.profit)+Number(cur_prices[stock.name])).toFixed(Number(2))}}</div>
          </div>
          <div class="w-100"></div>
        </div>
      </div>
    </div>
  </div>
  <div class="container">

    <div class="card text-white bg-dark mb-3" v-for="(price, stock) in cur_prices" :key="stock">
        <div class="card-header">Stock</div>
        <div class="card-body">
          <h5 class="card-title">{{stock}}</h5>
          <p class="card-text" v-bind:id="'price_'+stock">Price: {{price}}</p>
          <p class="card-text">Date: {{ cur_date }}</p>
          <input class="form-control mb-2" style="width: 10vh" type="number" min="1" v-model="amount_to_buy[stock]" v-bind:id="'input_'+stock">
          <button class="btn btn-light me-2" v-bind:id="'buy_'+stock" @click="buy($event)">Buy</button>
          <button class="btn btn-light me-2" v-bind:id="'sell_'+stock" @click="sell($event)">Sell</button>
          <button class="btn btn-light" v-bind:id="'info_'+stock" @click="show_info($event)">Info</button>
        </div>
    </div>
    <div class="modal modal-lg" id="stockInfoModal" v-bind:style="{display: this.infoStyle}">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-body">
            <div class="container">
              <Line :chart-data="chartData"/>
                <p>{{this.cur_date}}</p>
                <button class="btn btn-dark" @click="this.infoStyle='none'">Close</button>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement } from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
export default {
  name: "ExchangeComponent",
  props: ["socket"],
  components: {Line},
  data() {
    return {cur_prices: {}, cur_date: "", allBrokers: [], allStock: [], infoStyle: "", chartHtml: '', chartData: {}, amount_to_buy: [], isLoaded: false}
  },
  created() {
    axios.get("http://localhost:5000/getallbrokers").then((res) => {
      this.allBrokers = res.data;
      this.isLoaded = true;
    });
    this.socket.on('message', (data) => {
      this.cur_prices = data.currentPrices;
      this.cur_date = data.date;
      this.allBrokers = data.allBrokers;
      this.updateInfo(sessionStorage.getItem("stock_to_info"))
    })
    axios.get("http://localhost:5000/getallstock").then((response) => {
      let stock = [];
      for(const tag in response.data) {
        stock.push({tag, name: response.data[tag].name, history: response.data[tag].history});
      }
      this.allStock = stock;
      console.log(stock);
      for(let i of stock) {
        this.amount_to_buy[i.tag] = 1;
        console.log(this.amount_to_buy)
      }
    })

  },
  methods: {
    buy(event) {
      let broker = this.getBrokerById(sessionStorage.getItem("auth_id"));
      if(this.amount_to_buy[event.target.id.split('_')[1]] == null || this.amount_to_buy[event.target.id.split('_')[1]] < 1) {
        alert("Bad input")
        return;
      }
      console.log(broker)
      console.log(broker.money - this.cur_prices[event.target.id.split('_')[1]] * this.amount_to_buy[event.target.id.split('_')[1]])
      if((broker.money - this.cur_prices[event.target.id.split('_')[1]] * this.amount_to_buy[event.target.id.split('_')[1]]) >= 0) {
        console.log("BUYING INSIDE IF")
        axios.post("http://localhost:5000/buystock", {
          stock: event.target.id.split('_')[1],
          broker_id: sessionStorage.getItem("auth_id"),
          price: this.cur_prices[event.target.id.split('_')[1]],
          amount: this.amount_to_buy[event.target.id.split('_')[1]]
        })
      }
      else
        alert("Not enough money")
      console.log(event.target.id)
    },
    sell(event) {
      let broker = this.getBrokerById(sessionStorage.getItem("auth_id"));
      for(let stock of broker.stocks) {
        if(stock.name === event.target.id.split('_')[1] && (stock.amount - this.amount_to_buy[event.target.id.split('_')[1]]) >= 0) {
          axios.post("http://localhost:5000/sellstock", {
            stock: event.target.id.split('_')[1],
            broker_id: sessionStorage.getItem("auth_id"),
            price: this.cur_prices[event.target.id.split('_')[1]],
            amount: this.amount_to_buy[event.target.id.split('_')[1]]
          })
          return;
        }
      }
      alert("You dont have these stock")
    },
    show_info(event) {
      sessionStorage.setItem("stock_to_info", event.target.id.split('_')[1]);
      this.infoStyle = 'block';
      this.updateInfo(event.target.id.split('_')[1]);
    },
    updateInfo(stock) {
      let labels = [];
      let values = [];
      for(const paper of this.allStock) {
        if(paper.tag === stock) {
          for(let v of paper.history) {
            if(v.Date !== this.cur_date) {
              labels.push(v.Date);
              values.push(v.Open);
            }
            else
              break;
          }
        }
      }

      const data = {
        labels: labels,
        datasets: [{
          label: stock,
          data: values,
          backgroundColor: 'rgb(255,255,255)',
          borderColor: 'rgb(0,0,0)'
        }]
      }
      //this.chartHtml = '<LineChartGenerator :chart-data="data"/>'
      this.chartData = data;
      console.log(data);
    },
    getBrokerById() {
      for(let i of this.allBrokers) {
        if(i.broker_id == sessionStorage.getItem("auth_id"))
          return i;
      }
    }
  }
}
</script>

<style scoped>

</style>