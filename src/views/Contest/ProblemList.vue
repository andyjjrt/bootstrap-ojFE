<template>
    <div class="container">
        <div>
            <div>
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Problems</h4>
                        <div class="table-responsive" v-if="problems">
                            <table class="table text-nowrap">
                                <thead>
                                    <tr class="d-flex">
                                        <th scope="col" class="col-2 d-none d-md-block" style="border-left: 5px #ffffff solid">#</th>
                                        <th scope="col" class="col-6 d-none d-md-block">Problem</th>
                                        <th scope="col" class="col-2 d-none d-md-block">Level</th>
                                        <th scope="col" class="col-2 d-none d-md-block">AC rate</th>
                                        <th scope="col" class="col-10 d-block d-md-none" style="border-left: 5px #ffffff solid">Problem</th>
                                        <th scope="col" class="col-2 d-block d-md-none">Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="d-flex" role="button"  v-for="problem in problems.data" :key="problem.id" @click="go_problem(problem._id)">
                                        <td class="text-truncate col-2 d-none d-md-block" :style="solved(problem)">{{ problem._id }}</td>
                                        <td class="text-truncate col-6 d-none d-md-block">{{ problem.title }}</td>
                                        <td class="col-2 d-none d-md-block" v-html="difficulty_tag(problem.difficulty)"></td>
                                        <td class="col-2 d-none d-md-block" >{{ ac_rate(problem.accepted_number, problem.submission_number) }}</td>
                                        <td class="text-truncate col-10 d-block d-md-none" :style="solved(problem)">{{ problem.title }}</td>
                                        <td class="col-2 d-block d-md-none" v-html="difficulty_tag(problem.difficulty)"></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div  class="d-flex justify-content-center" v-else>
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
        },
        solved(problem){
            if(problem.my_status || problem.my_status == 0){
                if(problem.my_status == 0){
                    return "border-left: 5px #198754 solid"
                }else{
                    return "border-left: 5px #dc3545 solid"
                }
            }
            return "border-left: 5px #ffffff solid"
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
