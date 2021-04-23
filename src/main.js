import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Message from 'vue-m-message'
import Katex from 'vue-katex-auto-render'
import VueClipboard from 'vue-clipboard2'

import 'vue-m-message/dist/index.css'
import "bootstrap/dist/css/bootstrap.min.css";

import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-light.css'
Vue.use(VueHighlightJS)

Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(VueClipboard)
Vue.directive('katex', Katex);
Vue.$http.defaults.xsrfHeaderName = "X-CSRFToken";
Vue.$http.defaults.xsrfCookieName = "csrftoken";
Vue.config.productionTip = false
Vue.use(Message)

const store = new Vuex.Store({
  state: {
    profile: null,
    profile_ready: false,
    login:null,
    site:{},
    contest: null,
    status_list:{
      '-2': {
          name: 'Compile Error',
          short: 'CE',
          type: 'warning',
          color:"#ffc107"
      },
      '-1': {
          name: 'Wrong Answer',
          short: 'WA',
          type: 'danger',
          color:"#dc3545"
      },
      '0': {
          name: 'Accepted',
          short: 'AC',
          type: 'success',
          color:"#198754"
      },
      '1': {
          name: 'Time Limit Exceeded',
          short: 'TLE',
          type: 'danger',
          color:"#dc3545"
      },
      '2': {
          name: 'Time Limit Exceeded',
          short: 'TLE',
          type: 'danger',
          color:"#dc3545"
      },
      '3': {
          name: 'Memory Limit Exceeded',
          short: 'MLE',
          type: 'danger',
          color:"#dc3545"
      },
      '4': {
          name: 'Runtime Error',
          short: 'RE',
          type: 'danger',
          color:"#dc3545"
      },
      '5': {
          name: 'System Error',
          short: 'SE',
          type: 'danger',
          color:"#dc3545"
      },
      '6': {
          name: 'Pending',
          short: '...',
          type: 'warning',
          color:"#ffc107"
      },
      '7': {
          name: 'Judging',
          short: 'JG',
          type: 'info',
          color:"#0dcaf0"
      },
      '8': {
          name: 'Partial Accepted',
          short: 'PAC',
          type: 'primary',
          color:"#0d6efd"
      },
      '9': {
          name: 'Submitting',
          short: '...',
          type: 'warning',
          color:"#ffc107"
      }
    }
  },
  mutations: {
    get_profile (state, status) {
      state.profile = status
      state.profile_ready = true
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