import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'

import VueRouter from "vue-router";

import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

import BarChart from "./components/BarChart.vue";

Vue.use(VueRouter);
Vue.use(Vuetify, {
    theme: {
        primary: "#03a9f4", //blue - other #81d4fa
        secondary: "#ffd600", // yellow - other #81d4fa
        accent: "#4caf50", // green - other #a5d6a7
        //red #e91e63 - #f48fb1 
    }
});

const router = new VueRouter({
    mode: "history",
    routes: [
        { path: "/barChart", component: BarChart }
    ]
});

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
