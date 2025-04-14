// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import "jsuites/dist/jsuites.css";
import "jspreadsheet-ce/dist/jspreadsheet.css";

import 'handsontable/dist/handsontable.full.css';

import axios from 'axios'
import VueAxios from 'vue-axios'


const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)


app.mount('#app')
