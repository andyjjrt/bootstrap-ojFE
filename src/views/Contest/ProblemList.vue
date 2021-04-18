<template>
    <div class="container">
        <div>
            <div>
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Problems</h4>
                        <div v-if="problems">
                            <div v-if="!problems.error">
                                <ul class="list-group list-group-flush">
                                    <div role="button" class="list-group-item" v-for="problem in problems.data" :key="problem.id" @click="go_problem(problem._id)">
                                        <div class="row p-1">
                                            <span class="col-1">
                                                <div v-if="problem.my_status || problem.my_status == 0">
                                                    <span v-if="problem.my_status == 0">
                                                        <i class="bi bi-check text-success" style="font-size: 1.3rem;"></i>
                                                    </span>
                                                    <span v-else>
                                                        <i class="bi bi-x text-danger" style="font-size: 1.3rem;"></i>
                                                    </span>
                                                </div>
                                            </span>
                                            <span class="col-1 text-nowrap overflow-hidden sm-no-display">{{ problem._id }}</span>
                                            <span class="col-5 sm-no-display text-truncate">{{ problem.title }}</span>
                                            <span class="col-8 sm-display text-truncate">{{ problem.title }}</span>
                                            <span class="col text-center sm-no-display" v-html="difficulty_tag(problem.difficulty)"></span>
                                            <span class="col text-end sm-display" v-html="difficulty_tag(problem.difficulty)"></span>
                                            <span class="col-3 sm-no-display text-center"><span>{{ ac_rate(problem.accepted_number, problem.submission_number) }}</span></span>
                                        </div>
                                    </div>
                                </ul>
                            </div>
                            <div v-else>
                                <div class="alert alert-danger" role="alert">
                                    {{problems.data}}
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center" v-else>
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"contest_ProblemList",
    data(){
        return{
            problems: null,
        }
    },
    created() {
        this.get_problem()
    },
    methods:{
        get_problem(){
            this.problems = null
            this.$http.get(window.location.origin + '/api/contest/problem?contest_id=' + this.$store.state.contest.data.id).then(response => {
                this.problems = response.data
            });
        },
        to_page(page){
            console.log(page)
            if(page < 1 || page > parseInt(this.total/20) + 1 || page == this.$route.query.page){
                return
            }
            this.$router.push({ path: 'problem', query: { page: page }})
            this.get_problem()
        },
        difficulty_tag(difficulty){
            if(difficulty == "High"){
                return '<span class="badge bg-warning text-dark">High</span>'
            }else if(difficulty == "Mid"){
                return '<span class="badge bg-primary">Mid</span>'
            }
            return '<span class="badge bg-success">Low</span>'
        },
        ac_rate(ac,total){
            return (parseInt(ac)*100/parseInt(total)).toFixed(2) + "%"
        },
        go_problem(id){
            this.$router.push({ path:'/contest/' + this.$store.state.contest.data.id + '/problem/' + id})
        }
    },
    watch: {
        $route(to) {
            this.page = to.query.page
            this.get_problem()
        }
    }
}
</script>

<style scoped>
  .sm-no-display{
    display: none;
  }
  .sm-display{
    display: block;
  }
  .md-no-display{
    display: none;
  }
  @media (min-width: 768px) {
    .md-no-display{
      display: block;
    }
  }
  @media (min-width: 576px) {
    .sm-no-display{
      display: block;
    }
    .sm-display{
      display: none;
    }
  }
</style>
