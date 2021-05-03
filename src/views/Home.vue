<template>
  <div class="container">
    <div style=" margin: 0 auto; position: relative; height:300x; width:100%;" class="card card-body">
      <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-success btn-sm" disabled>V1.0.0-beta10</button>
        <button class="btn btn-primary btn-sm" type="button" @click="change()" :class="{'disabled':chart_btn}">{{next_chart_type}}</button>
      </div>
      <Chart :option="chart_option" :data="chart_data" v-if="rank" />
      <div class="text-center" v-else>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
    </div>
    <br>
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
      next_chart_type:"OI Rank",
      chart_btn: false,
      chart_option:{
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 10,
            bottom: 10
          }
        }
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
    this.acm_chart()
  },
  methods:{
    acm_chart(){
      this.chart_data = {
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
      this.$http.get(window.location.origin + '/api/user_rank?offset=0&limit=10&rule=ACM').then(response => {
        this.rank = response.data
        for(let i in this.rank.data.results){
          this.chart_data.datasets[0].data.push(this.rank.data.results[i].accepted_number)
          this.chart_data.datasets[1].data.push(this.rank.data.results[i].submission_number)
          this.chart_data.labels.push(this.rank.data.results[i].user.username)
        }
        this.chart_btn = false
      });
    },
    oi_chart(){
      this.chart_data = {
        datasets: [
          {
            data: [],
            label: 'Score',
            backgroundColor: '#dc3545'
          }
        ],
				labels: []
      },
      this.$http.get(window.location.origin + '/api/user_rank?offset=0&limit=10&rule=OI').then(response => {
        this.rank = response.data
        for(let i in this.rank.data.results){
          this.chart_data.datasets[0].data.push(this.rank.data.results[i].total_score)
          this.chart_data.labels.push(this.rank.data.results[i].user.username)
        }
        this.chart_btn = false
      });
    },
    change(){
      this.rank = null
      this.chart_btn = true
      if(this.next_chart_type == "OI Rank"){
        this.next_chart_type = "ACM Rank"
        this.oi_chart()
      }else{
        this.next_chart_type = "OI Rank"
        this.acm_chart()
      }
    }
  }
};
</script>

<style scoped>

</style>
