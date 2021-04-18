<template>
  <div class="container">
    <div style=" margin: 0 auto; position: relative; height:400px; width:100%">
      <Chart :option="chart_option" :data="chart_data" v-if="rank" />
      <div class="text-center" v-else>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <hr>
    <Announcement :announce_url="announce" />
  </div>
</template>

<script>
import Announcement from '@/components/Announce.vue'
import Chart from '@/components/Chart.vue'

export default {
  name: "Home",
  components:{
    Announcement,
    Chart
  },
  data(){
    return{
      announce: "/api/announcement?offset=0&limit=10",
      chart_option:{
        responsive: true,
        maintainAspectRatio: false,
      },
      chart_data:{
        datasets: [
          {
            data: [],
            label: 'AC',
            backgroundColor: '#dc3545'
          },
          {
            data: [],
            label: 'Total',
            backgroundColor: '#003480'
          }
        ],
				labels: []
      },
      rank: null
    }
  },
  created(){
    this.$http.get(window.location.origin + '/api/user_rank?offset=0&limit=10&rule=ACM').then(response => {
      this.rank = response.data
      for(let i in this.rank.data.results){
        this.chart_data.datasets[0].data.push(this.rank.data.results[i].accepted_number)
        this.chart_data.datasets[1].data.push(this.rank.data.results[i].submission_number)
        this.chart_data.labels.push(this.rank.data.results[i].user.username)
      }
    });
  }
};
</script>

<style scoped>

</style>
