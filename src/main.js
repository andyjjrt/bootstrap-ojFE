import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import Message from 'vue-m-message'
import Katex from 'vue-katex-auto-render'
import VueClipboard from 'vue-clipboard2'

import VueMarkdownEditor from '@kangc/v-md-editor';
import '@/css/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import createTipPlugin from '@kangc/v-md-editor/lib/plugins/tip/index';
import '@/css/vuepress.css';
import '@/css/tip.css';
import createKatexPlugin from '@kangc/v-md-editor/lib/plugins/katex/cdn';

VueMarkdownEditor.use(createKatexPlugin());
VueMarkdownEditor.use(createTipPlugin());
VueMarkdownEditor.use(vuepressTheme);

Vue.use(VueMarkdownEditor);

import 'vue-m-message/dist/index.css'
import "@/scss/bootstrap-5.0.0/scss/bootstrap.scss";

import 'highlight.js/styles/atom-one-light.css'
import hljs from 'highlight.js'

Vue.use(Vuex)
import store from '@/store.js'

Vue.use(VueClipboard)
Vue.directive('katex', Katex);
Vue.prototype.$http = axios
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
Vue.use(Message)

Vue.directive('highlightjs', {
  deep: true,
  bind: function (el, binding) {
    // on first bind, highlight all targets
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      if (binding.value) {
        target.textContent = binding.value
      }
      hljs.highlightBlock(target)
    })
  },
  componentUpdated: function (el, binding) {
    // after an update, re-fill the content and then highlight
    let targets = el.querySelectorAll('code')
    targets.forEach((target) => {
      if (binding.value) {
        target.textContent = binding.value
        hljs.highlightBlock(target)
      }
    })
  }
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')