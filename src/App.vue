<template>
  <div id="app">
    <Navbar v-if="$store.state.site" />
    <div><br /><br /><br /><br /></div>
    <transition name="component-fade" mode="out-in">
      <router-view v-if="ready" />
    </transition>
    <br />
    <Footer v-if="$store.state.site" />
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default {
  name: "APP",
  components: {
    Navbar,
    Footer,
  },
  created() {
    const api = window.location.origin + "/api";
    this.$http.get(api + "/website").then((response) => {
      this.$store.commit("get_site", response.data);
      window.document.title =
        this.$store.state.site.data.website_name_shortcut +
        " | " +
        this.$route.name;
    });
    this.$http.get(api + "/profile").then((response) => {
      this.$store.commit("get_profile", response.data);
    });
    this.$http
      .get(window.location.origin + "/api/languages")
      .then((response) => {
        this.$store.commit("set_languages", response.data);
      });
  },
  computed: {
    ready() {
      if (
        this.$store.state.profile &&
        this.$store.state.site &&
        this.$store.state.languages
      ) {
        this.$store.commit("set_ready");
      }
      return (
        this.$store.state.profile &&
        this.$store.state.site &&
        this.$store.state.languages
      );
    },
  },
};
</script>

<style>
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
pre {
  word-wrap: normal;
}
</style>
