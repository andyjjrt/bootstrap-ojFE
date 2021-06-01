<template>
    <div>
        <div v-if="problems">
            <div v-if="!rank.error">
                <div class="card card-body">
                    <div>
                        <div class="form-check form-switch">
                            <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="auto_refresh">
                            <label class="form-check-label" for="flexSwitchCheckDefault">Auto Refresh(10s)</label>
                        </div>
                    </div>
                    <div style=" margin: 0 auto; position: relative; height:300x; width:100%; display:block;">
                        <Chart :option="chart_option" :data="chart_data" v-if="chart_ready" />
                    </div>
                </div>
                <br>
                <div class="card">
                    <div class="card-body">
                        <div class="table-responsive text-center text-nowrap">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Score</th>
                                        <th scope="col" v-for="problem in problems.data" :key="problem.id">{{problem._id}}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(stat, index) in rank.data.results" :key="stat.id">
                                        <th scope="row">{{(page-1)*30+index+1}}</th>
                                        <td>
                                            <a style="width: 100px" role="button" class="text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.user.username }})">{{stat.user.username}}</a>
                                        </td>
                                        <td>{{stat.total_score}}</td>
                                        <td  v-for="problem in problems.data" :key="problem.id">{{stat.submission_info[problem.id]}}</td>
                                    </tr>
                                    <tr v-if="rank.data.results.length == 0">
                                        <td :colspan="problems.data.length + 4" class="text-center">
                                            No Data
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination @nav="load_page" :total="total" :page="page" :perpage="30" :dress_class="'card-body border-top'" />
                </div>
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
import Chart from '@/components/Chart.vue'
import Pagination from '@/components/Pagination.vue'
export default {
    name:"Contest_Rank",
    components:{
        Chart,
        Pagination
    },
    data(){
        return{
            chart_option:{
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                },
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 20,
                        right: 20,
                        top: 10,
                        bottom: 10
                    }
                }
            },
            rank:null,
            chart_data:{
                datasets: [
                    {
                        data: [],
                        label: 'Score',
                        backgroundColor: '#dc3545'
                    }
                ],
                labels: []
            },
            problems:null,
            page: 1,
            total: 0,
            auto_refresh: false,
            refresh_item: null,
            chart_ready: false
        }
    },
    created(){
        this.init()
        this.$http.get(window.location.origin + '/api/contest/problem?contest_id=' + this.$store.state.contest.data.id).then(response => {
            this.problems = response.data
        });
    },
    methods:{
        init(){
            this.chart_data = {
                datasets: [
                    {
                        data: [],
                        label: 'Score',
                        backgroundColor: '#dc3545'
                    }
                ],
                labels: []
            }
            this.$http.get(window.location.origin + '/api/contest_rank?offset=0&limit=30&contest_id=' + this.$route.params.id).then(response => {
                this.rank = response.data
                this.chart_ready = false
                for(let i = 0; i < 10 && this.rank.data.results[i]; i++){
                    this.chart_data.datasets[0].data.push(this.rank.data.results[i].total_score)
                    this.chart_data.labels.push(this.rank.data.results[i].user.username)
                }
                let vm = this
                window.setTimeout(function(){vm.chart_ready = true},10 )
                this.total = response.data.data.total
            })
        },
        load_page(page){
            if(page < 1 || page > parseInt(this.total/30) + 1 || page == this.page){
                return
            }
            this.page = page
            let offset = (this.page-1) * 30
            this.$http.get(window.location.origin + '/api/contest_rank?offset=' + offset + '&limit=30&contest_id=' + this.$route.params.id).then(response => {
                this.rank = response.data
                window.scrollTo(0,500)
            })
        }
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