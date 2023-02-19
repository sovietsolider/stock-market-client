<template>
  <h1>TEST</h1>
  <button @click="logout">LOG OUT</button>
</template>

<script>
import loginService from "../services/loginService";

export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  methods: {
    logout() {
      loginService.methods.logout(sessionStorage.getItem("auth_id"));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
