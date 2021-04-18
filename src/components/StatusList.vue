<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Status</h4>
                <div v-if="status">
                    <div v-if="!status.error">
                        <ul class="list-group list-group-flush">
                            <div class="list-group-item" v-for="stat in status.data.results" :key="stat.id">
                                <div class="row p-1">
                                    <span class="col-2 text-truncate">{{new Date(stat.create_time).toLocaleString()}}</span>
                                    <span class="col-2"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span></span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    <span class="col-1">{{stat.statistic_info.time_cost}}ms</span>
                                    <span class="col-1">{{ parseInt(stat.statistic_info.memory_cost/1048576) }}MB</span>
                                    <span class="col-2">{{stat.language}}</span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a>
                                </div>
                            </div>
                        </ul>
                        <ul class="list-group list-group-flush" v-if="status.data.length == 0 || status.data.results.length == 0">
                            <li class="d-flex justify-content-between p-1">
                                No data
                            </li>
                        </ul>
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
                <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/20) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
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
            status_list:{
                '-2': {
                    name: 'Compile Error',
                    short: 'CE',
                    type: 'warning'
                },
                '-1': {
                    name: 'Wrong Answer',
                    short: 'WA',
                    type: 'danger'
                },
                '0': {
                    name: 'Accepted',
                    short: 'AC',
                    type: 'success'
                },
                '1': {
                    name: 'Time Limit Exceeded',
                    short: 'TLE',
                    type: 'danger'
                },
                '2': {
                    name: 'Time Limit Exceeded',
                    short: 'TLE',
                    type: 'danger'
                },
                '3': {
                    name: 'Memory Limit Exceeded',
                    short: 'MLE',
                    type: 'danger'
                },
                '4': {
                    name: 'Runtime Error',
                    short: 'RE',
                    type: 'danger'
                },
                '5': {
                    name: 'System Error',
                    short: 'SE',
                    type: 'danger'
                },
                '6': {
                    name: 'Pending',
                    short: '...',
                    type: 'warning'
                },
                '7': {
                    name: 'Judging',
                    short: 'JG',
                    type: 'info'
                },
                '8': {
                    name: 'Partial Accepted',
                    short: 'PAC',
                    type: 'primary'
                },
                '9': {
                    name: 'Submitting',
                    short: '...',
                    type: 'warning'
                }
            }
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
            if(this.page == undefined){
                this.page = 1
            }
            let offset = (this.page-1) * 20
            this.$http.get(window.location.origin + this.status_url + 'myself=0&result=&username=&page=' + this.page +'&limit=12&offset=' + offset).then(response => {
                this.status = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/20) + 1 || page == this.$route.query.page){
                return
            }
            this.$router.push({ path: 'status', query: { page: page }})
            this.get_Status()
        },
        ac_rate(ac,total){
            return (parseInt(ac)*100/parseInt(total)).toFixed(2) + "%"
        },
    },
    watch: {
        $route(to) {
            this.page = to.query.page
            this.get_Status()
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