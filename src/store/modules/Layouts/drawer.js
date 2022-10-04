// Utilities
import axios from "axios";
import { VDatePickerYears } from "vuetify/lib";

const state = {
  drawer: true,
  
 
  items: [
    {
      icon: "mdi-file-document",
      text: "Blog management",
      to: "/",
    },
  ],
  toRender: true,
 
};

const mutations = {
  
};

const actions = {
  
};

const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
