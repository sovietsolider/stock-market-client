<template>
  <div class="container w-50">
    <div class="card text-white bg-dark mt-3" v-for="broker in brokersTakePart" :key="broker.name">
      <div class="card-header">Broker</div>
      <div class="card-body">
        <h5 class="card-title">{{broker.name}}</h5>
        <p class="card-text">Money: {{Number(broker.money).toFixed(Number(2))}}</p>
        <div v-for="stock in broker.stocks" :key="stock.name">
          <div class="stock-element">
              <div class="d-flex flex-column justify-content-center">
                <div class="badge text-wrap mb-2 card-badge" v-bind:style="stock.profit > 0 ? {'background-color': 'green'} : {'background-color': 'red'}">{{stock.name}}</div>
                <div class="badge text-dark bg-light text-wrap mb-2 card-badge"> Amount {{stock.amount}}</div>
                <div class="badge bg-light text-wrap card-badge" v-bind:style="stock.profit > 0 ? {color: 'green'} : {color: 'red'}">{{Number(stock.profit).toFixed(Number(2))}}</div>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'AdminComponent',
  props: ["socket"],
  data() {
    return {count: 0, message: "", brokersTakePart: []}
  },
  methods: {
    increment() {
      this.count++;
      console.log(this.socket);
    }
  },
  created() {
    console.log("ADMIN CREATED")
    axios.get("http://localhost:5000/getbrokerstakepart").then((res)=> {
      console.log(res.data);
      this.brokersTakePart = res.data;
    })
    this.socket.on('message', (data) => {
      let tmp = [];
      for(let broker of data.allBrokers) {
        if(broker.take_part)
          tmp.push(broker)
      }
      this.brokersTakePart = tmp;
      console.log(data);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.stock-element {
  margin-bottom: 20px;
}

.card-badge {
  width: 10vh;
}

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
