import Vue from "vue";
import axios from "axios";

const $http = axios.create();

Vue.prototype.$http = axios;
const token = localStorage.getItem("token");
axios.defaults.baseURL =
  process.env.VUE_APP_API_URL ||
  "https://staging.api.bureau-dordre.casaiskane.ma"; //https://staging.api.bureau-dordre.casaiskane.ma
if (token) {
  Vue.prototype.$http.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${token}`;
}

export default $http;
