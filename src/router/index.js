import Vue from "vue";
import VueRouter from "vue-router";
import Login from "../views/Login/Login.vue";

Vue.use(VueRouter);

const routes = [
  // {
  //   path: "/",
  //   name: "Home",
  //   component: Login,
  // },

  {
    path: "/",
    name: "blog management",
    component: () => import("../views/DashRoles/BlogView/blog.vue"),
    meta: {
      requiresAuth: false,
    },
  },

  {
    path: "*",
    redirect: "/404",
  },
];

const router = new VueRouter({
  mode: "history",
  routes,
});

export default router;
