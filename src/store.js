import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
      profile: null,
      profile_ready: false,
      login:null,
      site:null,
      contest: null,
      languages: null,
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
            color:"#28a745"
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
            color:"#17a2b8"
        },
        '8': {
            name: 'Partial Accepted',
            short: 'PAC',
            type: 'primary',
            color:"#007bff"
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
      },
      set_languages (state, payload) {
        state.languages = payload
      }
    }
  })

  export default store