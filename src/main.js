import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import Vuex from "vuex";
import Message from "vue-m-message";
import Katex from "vue-katex-auto-render";
import VueClipboard from "vue-clipboard2";
import Pagination from "vue-pagination-2";
import hljs from "highlight.js";

import "@/css/bootstrap-icon@1.5.0/bootstrap-icon.css";
import "@/css/Noto-Sans-Tc.css";

import VueMarkdownEditor from "@kangc/v-md-editor";
import "@kangc/v-md-editor/lib/style/base-editor.css";
import githubTheme from "@kangc/v-md-editor/lib/theme/github.js";
import "@kangc/v-md-editor/lib/theme/style/github.css";

import createTipPlugin from "@kangc/v-md-editor/lib/plugins/tip/index";
import "@/css/tip.css";
import createKatexPlugin from "@kangc/v-md-editor/lib/plugins/katex/cdn";
import enUS from "@kangc/v-md-editor/lib/lang/en-US";

VueMarkdownEditor.use(createKatexPlugin());
VueMarkdownEditor.use(createTipPlugin());
VueMarkdownEditor.lang.use("en-US", enUS);
VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs,
});

Vue.use(VueMarkdownEditor);

import "vue-m-message/dist/index.css";
import "@/scss/style.scss";

import "highlight.js/styles/atom-one-light.css";

Vue.use(Vuex);
import store from "@/store.js";

Vue.use(VueClipboard);
Vue.directive("katex", Katex);
Vue.prototype.$http = axios;
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.xsrfCookieName = "csrftoken";
Vue.use(Message);

Vue.directive("highlightjs", {
  deep: true,
  bind: function (el, binding) {
    // on first bind, highlight all targets
    let targets = el.querySelectorAll("code");
    targets.forEach((target) => {
      // if a value is directly assigned to the directive, use this
      // instead of the element content.
      if (binding.value) {
        target.textContent = binding.value;
      }
      hljs.highlightBlock(target);
    });
  },
  componentUpdated: function (el, binding) {
    // after an update, re-fill the content and then highlight
    let targets = el.querySelectorAll("code");
    targets.forEach((target) => {
      if (binding.value) {
        target.textContent = binding.value;
        hljs.highlightBlock(target);
      }
    });
  },
});
Vue.component("pagination", Pagination);

Vue.prototype.$success = (s) => {
  Vue.prototype.$message.success({
    message: s,
    duration: 1500,
    zIndex: 1000000,
  });
};
Vue.prototype.$error = (s) => {
  Vue.prototype.$message.error({
    message: s,
    duration: 3000,
    zIndex: 1000000,
  });
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
