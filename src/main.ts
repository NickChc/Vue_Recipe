import { createApp } from "vue";
import "@/assets/global.css";
import App from "@/App.vue";
import { createPinia } from "pinia";
import router from "@/router";
import i18n from "@/i18n";
import Vue3Toastify from "vue3-toastify";

const pinia = createPinia();

createApp(App)
  .use(pinia)
  .use(router)
  .use(i18n)
  .use(Vue3Toastify, { autoClose: 3000 })
  .mount("#app");
