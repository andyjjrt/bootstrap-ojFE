import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Message from 'vue-m-message'
import Katex from 'vue-katex-auto-render'
import VueClipboard from 'vue-clipboard2'
import VueCodemirror from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'
import 'vue-m-message/dist/index.css'
import "bootstrap/dist/css/bootstrap.min.css";

Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.directive('katex', Katex);
Vue.$http.defaults.xsrfHeaderName = "X-CSRFToken";
Vue.$http.defaults.xsrfCookieName = "csrftoken";
Vue.config.productionTip = false
Vue.use(Message)
Vue.use(VueCodemirror, /* {
  options: { theme: 'base16-dark', ... },
  events: ['scroll', ...]
} */)

const store = new Vuex.Store({
  state: {
    profile: null,
    site:{},
    contest: null
  },
  mutations: {
    get_profile (state, status) {
      state.profile = status
    },
    get_site (state, data) {
      state.site = data
    },
    get_contest (state, data) {
      state.contest = data
    }
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')