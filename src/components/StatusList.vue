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
                    <div v-if="!status.error">
                        <ul class="list-group list-group-flush">
                            <div class="list-group-item" v-for="stat in status.data.results" :key="stat.id">
                                <div class="row p-1">
                                    <span class="col-2 text-truncate md-no-display">{{new Date(stat.create_time).toLocaleString()}}</span>
                                    <span class="col-2 md-no-display"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span></span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate md-no-display" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate md-no-display" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    <span class="col-1 md-no-display">{{stat.statistic_info.time_cost}}ms</span>
                                    <span class="col-1 md-no-display">{{ parseInt(stat.statistic_info.memory_cost/1048576) }}MB</span>
                                    <span class="col-2 md-no-display">{{stat.language}}</span>
                                    <a role="button" style="text-decoration: none;" class="col-2 text-truncate md-no-display" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a>

                                    <span class="col-3 text-truncate md-display">{{new Date(stat.create_time).toLocaleString()}}</span>
                                    <span class="col-3 sm-md-display"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].name}}</span></span>
                                    <span class="col-3 sm-display"><span :class="'badge bg-' + status_list[stat.result].type">{{status_list[stat.result].short}}</span></span>
                                    <a role="button" style="text-decoration: none;" class="col-3 text-truncate md-display" @click="$router.push({ path:'/contest/' + $store.state.contest.data.id + '/problem/' + stat.problem})" v-if="mode == 'contest'">{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-3 text-truncate md-display" @click="$router.push({ name: 'Problem', params: { id:stat.problem }})" v-else>{{stat.problem}}</a>
                                    <a role="button" style="text-decoration: none;" class="col-3 text-truncate md-display" @click="$router.push({ name: 'User', query: { username:stat.username }})">{{stat.username}}</a>
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
            myself: undefined,
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
            if(this.page == undefined){
                this.page = 1
            }
            if(this.myself == undefined){
                this.myself = 0
            }
            let offset = (this.page-1) * 20
            this.$http.get(window.location.origin + this.status_url + 'myself=' + this.myself + '&result=&username=&page=' + this.page +'&limit=10&offset=' + offset).then(response => {
                this.status = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/20) + 1 || page == this.$route.query.page){
                return
            }
            this.$router.push({ path: 'status', query: { page: page, myself: this.myself}})
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
        },
        check_myself(new_val){
            if(new_val){
                this.myself = 1
            }else{
                this.myself = 0
            }
            this.$router.push({ path: 'status', query: { page: 1, myself: this.myself}})
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