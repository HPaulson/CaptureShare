import Vue from "vue";
import App from "./views/index.vue";
import "./services/registerServiceWorker";
import router from "./router";
import { store } from "./store/index";
import VueMeta from "vue-meta";

Vue.use(VueMeta);
Vue.config.productionTip = false;

new Vue({
  router,
  store,

  render: (h: any) => h(App)
}).$mount("#app");
