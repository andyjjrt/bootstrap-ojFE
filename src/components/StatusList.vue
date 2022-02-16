<template>
    <div>
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-sm-8 mb-3">
                        <div class="d-flex justify-content-between">
                            <h4 class="card-title">Status</h4>
                            <div class="d-flex px-1">
                                <div class="form-check form-switch" style="padding-top: 5px;padding-right:15px;">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="check_myself">
                                    <label class="form-check-label" for="flexSwitchCheckDefault">myself </label>
                                </div>
                                <div class="dropdown">
                                    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                        {{stats_string}}
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton1">
                                        <li><a class="dropdown-item" @click="query_status(undefined, 'All')" role="button">All</a></li>
                                        <li v-for="stats in Object.keys($store.state.status_list)" :key="stats"><a class="dropdown-item" @click="query_status(stats, $store.state.status_list[stats].name)" role="button">{{$store.state.status_list[stats].name}}</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-4 mb-3">
                        <form action="#" @submit.prevent="search_user">
                            <input class="form-control form-control-sm" type="text" placeholder="Search..." aria-label="search user" v-model="searching_user">
                        </form>
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

                                    <th class="col d-block d-md-none">Time</th>
                                    <th class="col d-block d-md-none">Status</th>
                                    <th class="col d-block d-md-none">Problem</th>
                                    <th class="col d-block d-md-none">Author</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="stat in status.data.results" :key="stat.id" class="d-flex position-relative" :class="{can_see: stat.show_link}">
                                    <td class="col-3 d-none d-md-block">{{date_format(new Date(stat.create_time))}}</td>
                                    <td class="col-2 d-none d-md-block">
                                        <span v-if="stat.show_link" role="button" @click="$router.push({ name: 'Submission', params: { submission_id:stat.id }})">
                                            <span class="d-none d-lg-block"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span></span>
                                            <span class="d-block d-lg-none"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                        </span>
                                        <span v-else>
                                            <span class="d-none d-lg-block"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span></span>
                                            <span class="d-block d-lg-none"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                        </span>
                                    </td>
                                    <td class="col-2 d-none d-lg-block">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { pid:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                    <td class="col-5 d-none d-md-block d-lg-none">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { pid:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                    <td class="col-1 d-none d-lg-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{stat.statistic_info.time_cost}}ms</span></td>
                                    <td class="col-1 d-none d-lg-block"><span v-if="stat.statistic_info.err_info">----</span><span v-else>{{ parseInt(stat.statistic_info.memory_cost/1048576)+1 }}MB</span></td>
                                    <td class="col-1 d-none d-lg-block">{{stat.language}}</td>
                                    <td class="col-2 d-none d-md-block"><a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a></td>

                                    <td class="col d-block d-md-none"><span>{{date_format2(new Date(stat.create_time))}}</span></td>
                                    <td class="col d-block d-md-none">
                                        <span v-if="stat.show_link" role="button" @click="$router.push({ name: 'Submission', params: { submission_id:stat.id }})">
                                            <span class="d-block"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                        </span>
                                        <span v-else>
                                            <span class="d-block"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                        </span>
                                    </td>
                                    <td class="col d-block d-md-none">
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                        <a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    </td>
                                    <td class="col d-block d-md-none"><a role="button" class="link-primary text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a></td>
                                    <template v-if="$store.state.profile">
                                        <template v-if="$store.state.profile.data">
                                            <div class="position-absolute top-50 end-0 translate-middle-y d-none d-lg-block" v-if="$store.state.profile.data.user.admin_type == 'Admin' || $store.state.profile.data.user.admin_type == 'Super Admin'">
                                                <button type="button" class="btn btn-primary btn-sm" @click="rejudge(stat.id)">Rejudge</button>
                                            </div>
                                        </template>
                                    </template>
                                </tr>
                                <tr v-if="status.data.results.length == 0">
                                        <td colspan="4" class="text-center">
                                            No Data
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
            <Pagination @nav="to_page" :total="total" :page="query.page" :perpage="12" :dress_class="'card-body border-top'" />
        </div>
    </div>
</template>

<script>
import Pagination from '@/components/Pagination.vue'
export default {
    name:"Status",
    props:{
        status_url: String,
        mode: String
    },
    data(){
        return{
            status: null,
            total: 0,
            page: 1,
            status_list: this.$store.state.status_list,
            check_myself: false,
            query: {},
            searching_user:"",
            stats_string:"All",
            select_stat:undefined,
        }
    },
    components:{
        Pagination
    },
    created() {
        this.get_Status()
    },
    methods:{
        get_Status(){
            this.status = null
            window.scrollTo(0,0)
            this.query = this.$route.query
            this.query["limit"] = 12
            if(this.query.page == undefined){
                this.query["page"] = 1
            }else{
                this.query.page = parseInt(this.query.page)
            }
            this.query["offset"] = (this.query["page"]-1) * 12
            if(this.query.myself == undefined || this.query.myself == 0){
                this.query["myself"] = 0
                this.check_myself = false
            }else{
                this.check_myself = true
            }
            if(this.query.username){
                this.searching_user = this.query.username
            }
            if(this.query.result){
                this.select_stat = this.query.result
                this.stats_string = this.$store.state.status_list[this.query.result].name
            }
            this.$http.get(window.location.origin + this.status_url,{params: this.query}).then(response => {
                this.status = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
             this.query["page"] = page
            this.pusher()
        },
        ac_rate(ac,total){
            return (parseInt(ac)*100/parseInt(total)).toFixed(2) + "%"
        },
        date_format(date){
            return date.getFullYear() + '/' +  (date.getMonth()+1) + '/' + date.getDate() + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes() + ':' + (date.getSeconds()<10?'0':'') + date.getSeconds()
        },
        date_format2(date){
            return (date.getMonth()+1) + '/' + (date.getDate()<10?'0':'') + date.getDate() + ' ' + (date.getHours()<10?'0':'') + date.getHours() + ':' + (date.getMinutes()<10?'0':'') + date.getMinutes()
        },
        pusher(){
            let aaa = {}
            aaa.page = this.query.page,
            aaa.myself =  this.query.myself,
            aaa.problem_id = this.query.problem_id ? this.query.problem_id : undefined
            aaa.result = this.query.result ? this.query.result : undefined
            aaa.username = this.query.username ? this.query.username : undefined
            this.$router.push({ path: this.$route.path, query: aaa}).catch(err => {console.log(err)})
        },
        search_user(){
            this.query.username = this.searching_user
            this.pusher()
        },
        query_status(code, str){
            this.query.result = code
            this.stats_string = str
            this.pusher()
        },
        rejudge(id){
            this.$http.get(window.location.origin + '/api/admin/submission/rejudge?id=' + id).then(()=>{
                this.get_Status()
            });
        }
    },
    watch: {
        $route(){
            this.get_Status()
        },
        check_myself(new_myself){
            if(new_myself){
                this.query.myself = 1
            }else{
                this.query.myself = 0
            }
            this.query.page = 1
            if(this.status)
                this.pusher()
        }
    }
}
</script>

<style scoped>
    .can_see{
        background-color: #edfafd;
    }
</style>