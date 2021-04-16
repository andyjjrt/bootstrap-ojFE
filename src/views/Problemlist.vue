<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Problems</h4>
                        <div v-if="problems">
                            <ul class="list-group list-group-flush">
                                <div role="button" class="list-group-item" v-for="problem in problems.data.results" :key="problem.id" @click="go_problem(problem._id)">
                                    <div class="row">
                                        <span class="col-1">
                                            <!--<i class="bi bi-check"></i>-->
                                            <span v-if="$store.state.profile.data.acm_problems_status.problems[problem.id]">
                                                <span v-if="$store.state.profile.data.acm_problems_status.problems[problem.id].status == 0">
                                                    <i class="bi bi-check text-success"></i>
                                                </span>
                                                <span v-else>
                                                    <i class="bi bi-x text-danger"></i>
                                                </span>
                                            </span>
                                            <span v-if="$store.state.profile.data.oi_problems_status.problems[problem.id]">
                                                <span v-if="$store.state.profile.data.oi_problems_status.problems[problem.id].status == 0">
                                                    <i class="bi bi-check text-success"></i>
                                                </span>
                                                <span v-else>
                                                    <i class="bi bi-x text-danger"></i>
                                                </span>
                                            </span>
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
                        <div class="d-flex justify-content-center" v-else>
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <nav aria-label="Page navigation example">
                    <ul class="pagination justify-content-end">
                        <li class="page-item"><a class="page-link" role="button" @click="to_page(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                        <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)-1)"><i class="bi bi-chevron-left"></i></a></li>
                        <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)+1)"><i class="bi bi-chevron-right"></i></a></li>
                        <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/20) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
                    </ul>
                </nav>
            </div>
            <div class="col-3 md-no-display">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tags</h4>
                        <div class="d-flex flex-wrap" v-if="tags">
                            <div style="padding: 3px" v-for="tag in tags.data" :key="tag.id">
                                <button type="button" class="btn btn-primary btn-sm" v-if="select_tag == tag.name" @click="select_tag_func(tag.name)">{{ tag.name }}</button>
                                <button type="button" class="btn btn-outline-primary btn-sm" v-else @click="select_tag_func(tag.name)">{{ tag.name }}</button>
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
    name:"ProblemList",
    data(){
        return{
            problems: null,
            tags: null,
            total: -1,
            select_tag: "",
            page: undefined
        }
    },
    created() {
        this.get_problem()
        this.$http.get(window.location.origin + '/api/problem/tags').then(response => {
            this.tags = response.data
        });
    },
    methods:{
        get_problem(){
            this.problems = null
            window.scrollTo(0,0)
            this.page = this.$route.query.page
            if(this.page == undefined){
                this.page = 1
            }
            console.log(this.page)
            let offset = (this.page-1) * 20
            this.$http.get(window.location.origin + '/api/problem?paging=true&tag=' + this.select_tag + '&offset=' + offset + '&limit=20&page=' + this.page).then(response => {
                this.problems = response.data
                this.total = response.data.data.total
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
        select_tag_func(name){
            if(this.select_tag == name){
                this.select_tag = ""
            }else{
                this.select_tag = name
            }
            this.$router.replace({ path: 'problem', query: { page: 1 }})
            this.get_problem()
        },
        go_problem(id){
            this.$router.push({ name: 'Problem', params: { id:id }})
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