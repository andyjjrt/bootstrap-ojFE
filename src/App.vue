<template>
  <div id="app" v-if="$store.state.profile_ready == true">
    <Navbar v-if="$store.state.site" />
    <br><br><br>
    <transition name="component-fade" mode="out-in">
      <router-view />
    </transition>
    <br>
    <Footer v-if="$store.state.site" />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default{
  name: 'APP',
  components:{
    Navbar,
    Footer
  },
  created(){
    const api = window.location.origin + "/api";
    this.$http.get(api + "/website").then((response) => {
      this.$store.commit('get_site', response.data)
      window.document.title = this.$store.state.site.data.website_name_shortcut + ' | ' + this.$route.name
    });
    this.$http.get(api + "/profile").then((response) => {
      this.$store.commit('get_profile', response.data)
    });
  }
}
</script>


<style>
.component-fade-enter-active, .component-fade-leave-active {
  transition: opacity .3s ease;
}
.component-fade-enter, .component-fade-leave-to
/* .component-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
