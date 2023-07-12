import { createApp } from 'vue'
import './style.css'
import 'virtual:svg-icons-register';
import 'uno.css'
import { createPinia } from "pinia";
import App from './App.vue'

createApp(App).use(createPinia()).mount("#app");

