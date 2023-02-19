<template>
  <nav class="navbar navbar-expand navbar-dark bg-dark">
    <a class="navbar-brand ms-3">Exchange</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav">
        <li class="nav-item active">
          <router-link to="/admin" class="nav-link active">Administrator</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/exchange" class="nav-link active">Exchange</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <router-view :socket="socket"/>
</template>

<script>
import { io } from 'socket.io-client';
import axios from "axios";
export default {
  name: 'App',
  components: {
  },
  data() {
    return {socket: io("http://localhost:5000", {
        transports: ["websocket"] // use webSocket only
      })}
  },
  created() {
    window.addEventListener("beforeunload", (event) => {
      axios.post("http://localhost:5000/setbrokertakepart", {broker_id: sessionStorage.getItem("auth_id"), take_part: false})
    })
  }
}
</script>

<style>

</style>
