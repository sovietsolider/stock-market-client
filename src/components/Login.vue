<template>
  <div class="container">
    <select v-model="selected" class="form-select" aria-label="Default select example" >
      <option v-for="broker in brokersNotTakePart" v-bind:value="broker.broker_id" :key="broker.name">{{broker.name}}</option>
    </select>
    <button class="btn btn-dark" id="login-btn" @click="login">Login</button>
  </div>
</template>

<script>
import axios from "axios";
import loginService from "../services/loginService";
import router from "@/router";

export default {
  name: "LoginComponent",
  data() {
    return { selected: "" , brokersNotTakePart: []}
  },
  created() {
    axios.get("http://localhost:5000/getbrokersnottakepart").then((res) => {
      console.log(res.data);
      this.brokersNotTakePart = res.data;
    });
  },
  methods: {
    login() {
      console.log(this.selected)
      loginService.methods.login(this.selected);
      router.push("/admin")
    },
    logout() {
      loginService.methods.logout(sessionStorage["auth_id"]);
    }
  }
}
</script>

<style scoped>

</style>