import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Message from 'vue-m-message'
import VueKatex from 'vue-katex';

import 'katex/dist/katex.min.css';
import 'vue-m-message/dist/index.css'
import "bootstrap/dist/css/bootstrap.min.css";

Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(VueKatex);
Vue.$http.defaults.xsrfHeaderName = "X-CSRFToken";
Vue.$http.defaults.xsrfCookieName = "csrftoken";
Vue.config.productionTip = false
Vue.use(Message)

const store = new Vuex.Store({
  state: {
    profile: null,
    site:{}
  },
  mutations: {
    get_profile (state, status) {
      state.profile = status
    },
    get_site (state, data) {
      state.site = data
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
