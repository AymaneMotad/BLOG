import axios from "axios";

let user = window.localStorage.getItem("user");

const state = {
  drawer: false,
  items: [
    {
      icon: "$mdiMonitorDashboard",
      text: "Dashboard",
      to: { name: "Dashboard" },
    },
  ],
  prix: 30,
  token: localStorage.getItem("token") || "",
  user: user ? JSON.parse(user) : {},
};
const mutations = {
  auth_success(state, payload) {
    state.statusSUC = "success";
    state.token = payload.token;
    state.user = payload.user;
  },

  auth_error(state) {
    state.status =
      "L'adresse e-mail ou le mot de passe que vous avez entré n'est pas valide.";
  },
  auth_chef(state, err) {
    state.chefError = err;
  },
  logout(state) {
    state.status = "";
    state.token = "";
  },
  saveUser(state) {
    window.localStorage.setItem("user", JSON.stringify(state.user));
  },
};

const actions = {
  login({ commit }, user) {
    return new Promise((resolve, reject) => {
      commit("auth_request");
      axios({
        url: `/api/someEndPoint`,
        data: user,
        method: "POST",
      })
        .then((resp) => {
          const token = resp.data.token;
          const user = resp.data.user;
          localStorage.setItem("token", token);
          // Add the following line:
          axios.defaults.headers.common["Authorization"] = token;
          commit("auth_success", { token, user });
          commit("saveUser");
          resolve(resp);
        })
        .catch((err) => {
          commit("auth_error");
          //localStorage.removeItem('token')
          reject(err);
        });
    });
  },
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      commit("logout");
      axios({ url: `/api/endPoint/logout`, method: "GET" }).then((resp) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    });
  },
};
const getters = {
  isLoggedIn: (state) => !!state.token,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
