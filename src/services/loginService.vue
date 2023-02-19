

<script>
import axios from "axios";

export default {
  name: "loginService",
  methods: {
    login(id) {
      sessionStorage.setItem("auth_id", id);
      axios.post("http://localhost:5000/setbrokertakepart", {take_part: true, broker_id: id});
    },
    logout(id) {
      sessionStorage.removeItem("auth_id");
      axios.post("http://localhost:5000/setbrokertakepart", {take_part: false, broker_id: id});
    },
    isLoggedIn() {
      return !!sessionStorage["auth_id"];
    }
  }
}
</script>

<style scoped>

</style>