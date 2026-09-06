import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import { initThemeFromStorage } from "./lib/theme.js";
import "./assets/styles/index.css";

initThemeFromStorage();

createApp(App).use(createPinia()).mount("#app");
