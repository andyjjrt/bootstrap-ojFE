<template>
  <div class="container">
    <div class="card">
      <div class="card-body">
        <h4 class="card-title">Contests</h4>
        <div v-if="contests">
          <ul class="list-group list-group-flush">
            <div v-for="contest in contests.data.results" :key="contest.id" class="list-group-item">
              <div role="button" class="d-flex justify-content-between p-1" @click="$router.push({ name: 'Contest', params: { id:contest.id }})">
                <span>{{ contest.title }}<small class="md-display">{{ get_time(contest.start_time) }}~{{ get_time(contest.end_time) }}</small></span>
                <div v-html="check_time(contest.start_time, contest.end_time)"></div>
              </div>
            </div>
          </ul>
        </div>
        <div class="d-flex justify-content-center" v-else>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "Home",
  data(){
    return{
      contests: null
    }
  },
  created() {
    this.$http.get(window.location.origin + '/api/contests?offset=0&limit=10').then(response => {
      this.contests = response.data
    });
  },
  methods:{
    get_time(isoString){
      return new Date(isoString).toLocaleString();
    },
    check_time(start,end){
      let time_now = new Date()
      if(time_now < new Date(start)){
        return '<span class="badge bg-warning text-dark">Not Started</span>'; 
      }else if(time_now > new Date(end)){
        return '<span class="badge bg-danger">Ended</span>'; 
      }
        return '<span class="badge bg-success">Underway</span>'; 
    }
  }
};
</script>

<style scoped>
  .md-display{
    display: none;
  }
  @media (min-width: 768px) {
    .md-display{
      display: block;
    }
  }
</style>
