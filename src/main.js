import "./assets/style/main.scss";
import "element-plus/dist/index.css";

import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

import ElementPlus from "element-plus";
app.use(ElementPlus);

import { createPinia } from "pinia";
const pinia = createPinia();
app.use(pinia);

app.mount("#app");
