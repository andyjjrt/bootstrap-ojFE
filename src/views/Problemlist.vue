<template>
    <div class="container">
        <div class="row">
            <div class="col">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Problems</h4>
                        <div class="table-responsive" v-if="problems && $store.state.profile_ready">
                            <table class="table text-nowrap">
                                <thead>
                                    <tr class="d-flex">
                                        <th scope="col" class="col-2 d-none d-md-block" style="border-left: 5px #ffffff solid">#</th>
                                        <th scope="col" class="col-6 d-none d-md-block">Problem</th>
                                        <th scope="col" class="col-2 d-none d-md-block">Level</th>
                                        <th scope="col" class="col-2 d-none d-md-block">AC rate</th>
                                        <th scope="col" class="col d-block d-md-none" style="border-left: 5px #ffffff solid">
                                            <span>Problem</span>
                                            <span class="float-end d-none d-sm-block">Level</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="d-flex" role="button"  v-for="problem in problems.data.results" :key="problem.id" @click="go_problem(problem._id)">
                                        <td class="text-truncate col-2 d-none d-md-block" :style="solved(problem.id)">{{ problem._id }}</td>
                                        <td class="text-truncate col-6 d-none d-md-block">{{ problem.title }}</td>
                                        <td class="col-2 d-none d-md-block" v-html="difficulty_tag(problem.difficulty)"></td>
                                        <td class="col-2 d-none d-md-block" >{{ ac_rate(problem.accepted_number, problem.submission_number) }}</td>
                                        <td class="col d-block d-md-none"  :style="solved(problem.id)">
                                            <span class="text-truncate">{{ problem.title }}</span>
                                            <span class="float-end d-none d-sm-block" v-html="difficulty_tag(problem.difficulty)"></span>
                                        </td>
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
            <div class="col-3 d-none d-sm-none d-md-none d-lg-block">
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
            let offset = (this.page-1) * 20
            this.$http.get(window.location.origin + '/api/problem?paging=true&tag=' + this.select_tag + '&offset=' + offset + '&limit=20&page=' + this.page).then(response => {
                this.problems = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
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
            if(total == 0){
                return '0.00%'
            }
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
        },
        solved(id){
            if(this.$store.state.profile.data){
                if(this.$store.state.profile.data.acm_problems_status.problems){
                    if(this.$store.state.profile.data.acm_problems_status.problems[id]){
                        if(this.$store.state.profile.data.acm_problems_status.problems[id].status == 0){
                            return "border-left: 5px #198754 solid"
                        }else{
                            return "border-left: 5px #dc3545 solid"
                        }
                    }
                }
                if(this.$store.state.profile.data.oi_problems_status.problems){
                    if(this.$store.state.profile.data.oi_problems_status.problems[id]){
                        if(this.$store.state.profile.data.oi_problems_status.problems[id].status == 0){
                            return "border-left: 5px #198754 solid"
                        }else{
                            return "border-left: 5px #dc3545 solid"
                        }
                    }
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
</style>
