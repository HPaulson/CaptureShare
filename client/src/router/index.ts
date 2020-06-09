import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/home",
    name: "Home",
  component: () =>
      import("../views/home.vue")
  },
  {
    path: "/",
    name: "Index",
  component: () =>
      import("../views/login.vue")
  },
  {
    path: "/login",
    name: "Login",
  component: () =>
      import("../views/login.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
