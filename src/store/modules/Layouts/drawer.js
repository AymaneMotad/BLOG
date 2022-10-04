// Utilities
import axios from "axios";
import { VDatePickerYears } from "vuetify/lib";

const state = {
  drawer: true,
  admin: [
    {
      icon: "mdi-file-account",
      text: "Gestion d'utilisateur",
      to: "/Admin",
    },
    {
      icon: "mdi-file-check",
      text: "Documents affectés",
      to: "/Documents-affectes",
    },
  ],
  gestionnaire: [
    {
      icon: "mdi-file",
      text: "Nouveau dossier",
      to: "/Nouveau-dossier",
    },
  ],
  items: [
    {
      icon: "mdi-file-document",
      text: "Blog management",
      to: "/git",
    },
  ],
  toRender: true,
  test: "test",
  seller_object: {},
  chef_object: {},
  card_object: {},
  margin: null,
};

const mutations = {
  SET_SELLER_OBJECTS(state, payload) {
    state.seller_object = payload;
  },
  SET_CHEF_OBJECTS(state, payload) {
    state.chef_object = payload;
  },
  SET_CARD_OBJECTS(state, payload) {
    state.card_object = payload;
  },
  SET_MARGIN(state, payload) {
    state.margin = payload;
  },
};

const actions = {
  Seller({ commit }, seller) {
    return new Promise((resolve, reject) => {
      axios({
        url: "/api/DR4GPEQP27D12H06Z12D/sellersdata",
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((resp) => {
          commit("SET_SELLER_OBJECTS", resp.data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  Chef({ commit }, seller) {
    return new Promise((resolve, reject) => {
      axios({
        url: "/api/DR4GPEQP27D12H06Z12D/chefsdata",
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((resp) => {
          commit("SET_CHEF_OBJECTS", resp.data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  Card({ commit }, seller) {
    return new Promise((resolve, reject) => {
      axios({
        url: "/api/DR4GPEQP27D12H06Z12D/cardsdata",
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((resp) => {
          commit("SET_CARD_OBJECTS", resp.data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  Margin({ commit }, seller) {
    return new Promise((resolve, reject) => {
      axios({
        url: "/api/DR4GPEQP27D12H06Z12D/margin",
        method: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
        .then((resp) => {
          commit("SET_MARGIN", resp.data);
          resolve(resp);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
