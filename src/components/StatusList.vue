<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h4 class="card-title">Status</h4>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="check_myself">
                        <label class="form-check-label" for="flexSwitchCheckDefault">myself</label>
                    </div>
                </div>
                <div v-if="status">
                    <div v-if="!status.error" class="table-responsive">
                        <table class="table text-nowrap">
                            <thead>
                                <tr class="d-flex">
                                    <th class="col-3 d-none d-md-block">Time</th>
                                    <th class="col-2 d-none d-md-block">Status</th>
                                    <th class="col-2 d-none d-lg-block">Problem</th>
                                    <th class="col-5 d-none d-md-block d-lg-none">Problem</th>
                                    <th class="col-1 d-none d-lg-block">Time</th>
                                    <th class="col-1 d-none d-lg-block">Mem</th>
                                    <th class="col-1 d-none d-lg-block">Lang</th>
                                    <th class="col-2 d-none d-md-block">Author</th>

                                    <th class="col-4 d-block d-md-none">Time</th>
                                    <th class="col-3 d-block d-md-none">Status</th>
                                    <th class="col-5 d-block d-md-none">Problem</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in status.data.results" :key="stat.id" class="d-flex" :class="{can_see: stat.show_link}">
                                    <td class="col-3 d-none d-md-block">{{date_format(new Date(stat.create_time))}}</td>
                                    <td class="col-2 d-none d-md-block">
                                        <span v-if="stat.show_link" role="button" @click="$router.push({ name: 'Submission', params: { submission_id:stat.id }})">
                                            <span class="d-none d-lg-block" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span>
                                            <span class="d-block d-lg-none" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span>
                                        </span>
                                        <span v-else>
                                            <span class="d-none d-lg-block" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span>
                                            <span class="d-block d-lg-none" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span>
                                        </span>
                                    </td>
                                    <td class="col-2 d-none d-lg-block">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                    <td class="col-5 d-none d-md-block d-lg-none">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                    <td class="col-1 d-none d-lg-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{stat.statistic_info.time_cost}}ms</span></td>
                                    <td class="col-1 d-none d-lg-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{ parseInt(stat.statistic_info.memory_cost/1048576)+1 }}MB</span></td>
                                    <td class="col-1 d-none d-lg-block">{{stat.language}}</td>
                                    <td class="col-2 d-none d-md-block"><a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a></td>

                                    <td class="col-4 d-block d-md-none"><span>{{date_format2(new Date(stat.create_time))}}</span></td>
                                    <td class="col-3 d-block d-md-none">
                                        <span v-if="stat.show_link" role="button" @click="$router.push({ name: 'Submission', params: { submission_id:stat.id }})">
                                            <span class="d-block" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span>
                                        </span>
                                        <span v-else>
                                            <span class="d-block" :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span>
                                        </span>
                                    </td>
                                    <td class="col-5 d-block d-md-none">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!--
                        <ul class="list-group list-group-flush">
                            <div class="list-group-item"  :class="{'can_see':stat.show_link}">
                                <div class="row p-1">
                                    <span class="col-2 text-truncate d-none d-lg-block d-xl-block d-xxl-block">{{new Date(stat.create_time).toLocaleString()}}</span>
                                    <span class="col-2 d-none d-lg-block d-xl-block d-xxl-block" ></span>
                                    <span class="col-2 d-none d-lg-block d-xl-block d-xxl-block"></span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate d-none d-lg-block d-xl-block d-xxl-block" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate d-none d-lg-block d-xl-block d-xxl-block" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    <span class="col-1 d-none d-lg-block d-xl-block d-xxl-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{stat.statistic_info.time_cost}}ms</span></span>
                                    <span class="col-1 d-none d-lg-block d-xl-block d-xxl-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{ parseInt(stat.statistic_info.memory_cost/1048576)+1 }}MB</span></span>
                                    <span class="col-2 d-none d-lg-block d-xl-block d-xxl-block">{{stat.language}}</span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate d-none d-lg-block d-xl-block d-xxl-block" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a>

                                    <span class="col-3 text-truncate d-block d-lg-none d-xl-none d-xxl-none">{{new Date(stat.create_time).toLocaleString()}}</span>
                                    <span class="col-2 d-block d-lg-none d-xl-none d-xxl-none" v-if="stat.show_link" role="button" @click="$router.push({ name: 'Submission', params: { submission_id:stat.id }})"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                    <span class="col-2 d-block d-lg-none d-xl-none d-xxl-none" v-else><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                    <a role="button" style="text-decoration: none;" class="col-4 text-truncate d-block d-lg-none d-xl-none d-xxl-none text-center" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-4 text-truncate d-block d-lg-none d-xl-none d-xxl-none text-center" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-3 text-truncate d-block d-lg-none d-xl-none d-xxl-none" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a>
                                </div>
                            </div>
                        </ul>
                        <ul class="list-group list-group-flush" v-if="status.data.length == 0 || status.data.results.length == 0">
                            <li class="d-flex justify-content-between p-1">
                                No data
                            </li>
                        </ul>
                        -->
                    </div>
                    <div v-else>
                        <div class="alert alert-danger" role="alert">
                            {{status.data}}
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
        <br>
        <nav aria-label="Page navigation example">
            <ul class="pagination justify-content-end">
                <li class="page-item"><a class="page-link" role="button" @click="to_page(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)-1)"><i class="bi bi-chevron-left"></i></a></li>
                <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)+1)"><i class="bi bi-chevron-right"></i></a></li>
                <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/12) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
            </ul>
        </nav>
    </div>
</template>

<script>
export default {
    name:"Status",
    props:{
        status_url: String,
        mode: String
    },
    data(){
        return{
            status: null,
            total: -1,
            page: undefined,
            myself: undefined,
            problem_id: undefined,
            status_list: this.$store.state.status_list,
            check_myself: false
        }
    },
    created() {
        this.get_Status()
    },
    methods:{
        get_Status(){
            this.status = null
            window.scrollTo(0,0)
            this.page = this.$route.query.page
            this.myself = this.$route.query.myself
            this.problem_id = this.$route.query.problemID
            if(this.page == undefined){
                this.page = 1
            }
            if(this.myself == undefined){
                this.myself = 0
            }
            if(this.problem_id == undefined){
                this.problem_id = ""
            }
            if(this.myself == 1){
                this.check_myself = true
            }
            let offset = (this.page-1) * 12
            this.$http.get(window.location.origin + this.status_url + 'myself=' + this.myself + '&result=&username=&page=' + this.page +'&limit=12&offset=' + offset + '&problem_id=' + this.problem_id).then(response => {
                this.status = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/12) + 1 || page == this.$route.query.page){
                return
            }
            this.$router.push({ path: 'status', query: { page: page, myself: this.myself, problemID: this.problem_id}})
            this.get_Status()
        },
        ac_rate(ac,total){
            return (parseInt(ac)*100/parseInt(total)).toFixed(2) + "%"
        },
        date_format(date){
            return date.getFullYear() + '/' +  (date.getMonth()+1) + '/' + date.getDate() + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ':' + (date.getSeconds()<10?'0':'') + date.getSeconds()
        },
        date_format2(date){
            return (date.getMonth()+1) + '/' + date.getDate() + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes()
        },
    },
    watch: {
        $route(to) {
            this.page = to.query.page
            this.get_Status()
        },
        check_myself(new_val){
            if(new_val){
                this.myself = 1
            }else{
                this.myself = 0
            }
            this.$router.replace({ path: 'status', query: { page: 1, myself: this.myself, problemID: this.problem_id}}).catch(err => {
                if (err.name !== 'NavigationDuplicated' && !err.message.includes('Avoided redundant navigation to current location')) {
                    console.error(err);
                }
            });
            this.get_Status()
        }
    }
}
</script>

<style scoped>
    .can_see{
        background-color: #edfafd;
    }

  .sm-no-display{
    display: none;
  }
  .sm-display{
    display: block;
  }
  .md-display{
    display: block;
  }
  .md-no-display{
    display: none;
  }
  @media (min-width: 768px) {
    .md-no-display{
      display: block;
    }
    .md-display{
        display: none;
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
  .sm-md-display{
      display: none;
    }
  @media (min-width: 576px) and (max-width: 768px) {
    .sm-md-display{
      display: block;
    }
  }
  
</style>