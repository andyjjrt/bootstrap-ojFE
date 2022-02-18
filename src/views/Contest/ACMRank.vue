<template>
    <div>
        <div v-if="problems && rank">
            <div v-if="!rank.error">
                <div class="card card-body">
                    <div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="auto_refresh">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Auto Refresh(10s)</label>
                        </div>
                    </div>
                    <div style="margin: auto; position: relative; height:300px; width:100%;">
                        <Chart Type="line" :ChartData="chart_data" :Option="chart_option" />
                    </div>
                </div>
                <br>
                <div class="card card-body">
                    <div class="table-responsive text-center text-nowrap">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">AC/Total</th>
                                    <th scope="col">Total Time</th>
                                    <th scope="col" v-for="problem in problems.data" :key="problem.id">{{problem._id}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(stat, index) in rank.data.results" :key="stat.id">
                                    <th scope="row">{{(page-1)*30+index+1}}</th>
                                    <td>
                                        <a style="width: 100px" role="button" class="text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.user.username }})">{{stat.user.username}}</a>
                                    </td>
                                    <td>{{stat.accepted_number}}/{{stat.submission_number}}</td>
                                    <td>{{get_remain(stat.total_time)}}</td>
                                    <td  v-for="problem in problems.data" :key="problem.id" :style="acm_td(stat.submission_info[problem.id])">
                                        <span v-if="stat.submission_info[problem.id]">{{stat.submission_info[problem.id].is_ac == false?'':get_remain(stat.submission_info[problem.id].ac_time)}}{{stat.submission_info[problem.id].error_number == 0?'':'(-' + stat.submission_info[problem.id].error_number + ')'}}</span>
                                    </td>
                                </tr>
                                <tr v-if="rank.data.results.length == 0">
                                    <td :colspan="problems.data.length + 4" class="text-center">
                                        No Data
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br>
                    </div>
                </div>
                <Pagination @nav="load_page" :total="total" :page="page" :perpage="30" :dress_class="'card-body border-top'" />
            </div>
            <div v-else>
                <div class="card card-body">
                    <div class="alert alert-danger" role="alert">
                        {{rank.data}}
                    </div>
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center" v-else>
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
import Chart from '@/components/MyChart.vue'
import Pagination from '@/components/Pagination.vue'
export default {
    name:"Contest_Rank",
    components:{
        Chart,
        Pagination
    },
    data(){
        return{
            rank:null,
            problems:null,
            page: 1,
            total: 0,
            auto_refresh: false,
            refresh_item: null,
            chart_option:{
                maintainAspectRatio: false,
                
            },
            chart_data:{
                datasets: []
            },
        }
    },
    created(){
        this.$http.get(window.location.origin + '/api/contest/problem?contest_id=' + this.$store.state.contest.data.id).then(response => {
            this.problems = response.data
        });
        this.init()
    },
    methods:{
        init(){
            this.rank = null
            this.chart_data = {
                datasets: [],
            }
            this.$http.get(window.location.origin + '/api/contest_rank?offset=0&limit=30&contest_id=' + this.$route.params.id).then(response => {
                this.rank = response.data
                let colors=["#0d6efd","#6c757d","#0dcaf0","#ffc107","#dc3545","#212529","#fd7e14","#20c997","#6f42c1","#6610f2"]
                for(let i = 0; i < 10 && this.rank.data.results[i]; i++){
                    let ranker = {
                        data: [{x:0,y:0}],
                        label: this.rank.data.results[i].user.username,
                        fill: false,
                        borderColor: colors[i],
                        tension: 0
                    }
                    let counter = 1
                    for(let j in this.rank.data.results[i].submission_info){
                        if(this.rank.data.results[i].submission_info[j].is_ac){
                            ranker.data.push({x:this.rank.data.results[i].submission_info[j].ac_time, y:counter})
                            counter++
                        }
                    }
                    this.chart_data.datasets.push(ranker)
                }
                this.total = response.data.data.total
            })
        },
        load_page(page){
            this.page = page
            let offset = (this.page-1) * 30
            this.$http.get(window.location.origin + '/api/contest_rank?offset=' + offset + '&limit=30&contest_id=' + this.$route.params.id).then(response => {
                this.rank = response.data
                window.scrollTo(0,500)
            })
        },
        acm_td(problem){
            if(problem != undefined){
                if(problem.is_ac){
                    if(problem.is_first_ac){
                        return "background-color: #a8edce;"
                    }
                    return "background-color: #d1e7dd;"
                }
                return "background-color: #f8d7da;"
            }
            return "background-color: #ffffff;"
            
        },
        get_remain(remain){
            const total_ = remain*1000
            const seconds_ = Math.floor( (total_/1000) % 60 );
            const minutes_ = Math.floor( (total_/1000/60) % 60 );
            const hours_ = Math.floor( (total_/(1000*60*60)) % 24 );
            const days_ = Math.floor( total_/(1000*60*60*24) );
            return (days_==0?'':(days_ < 10 ? '0' + days_ : days_) + 'd ') + (hours_ < 10 ? '0' + hours_ : hours_) + ":" + (minutes_ < 10 ? '0' + minutes_ : minutes_) + ":" + (seconds_ < 10 ? '0' + seconds_ : seconds_)
        },
    },
    watch:{
        auto_refresh(){
            if(this.auto_refresh){
                let vm = this
                this.refresh_item = window.setInterval(function(){vm.init()},10000)
            }else{
                window.clearInterval(this.refresh_item)
            }
        }
    }
}
</script>

<style>

</style>