<template>
  <div id="app">
    <Navbar/>
    <br>
    <router-view/>
    <br><br>
    <Footer/>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default{
  components:{
    Navbar,
    Footer
  },
  created(){
    const api = window.location.origin + "/api";
    this.$http.get(api + "/website").then((response) => {
      console.log(response.data);
      this.$store.commit('get_site', response.data)
    });
    this.$http.get(api + "/profile").then((response) => {
      console.log(response.data);
      this.$store.commit('get_profile', response.data)
    });
  }
}
</script>


<style>
</style>
