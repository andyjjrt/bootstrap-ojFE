<template>
    <div class="container-fluid">
        <div class="card card-body" v-if="chart_ready">
            <div class="fs-4">
                OI Rank
            </div>
            <div style=" margin: 0 auto; position: relative; height:300x; width:100%; display:block;">
                <Chart :option="chart_option" :data="chart_data" />
            </div>
        </div>
        <br>
        <div class="card" v-if="chart_ready">
            <div class="card-body">
                <div class="table-responsive text-nowrap" v-if="rank">
                    <table class="table">
                        <thead>
                            <tr class="d-flex">
                                <th scope="col" class="d-block col">#</th>
                                <th scope="col" class="d-block col">Name</th>
                                <th scope="col" class="d-none d-md-block col">Mood</th>
                                <th scope="col" class="d-block col">Score</th>
                                <th scope="col" class="d-none d-md-block col">AC</th>
                                <th scope="col" class="d-none d-md-block col">Total</th>
                                <th scope="col" class="d-none d-md-block col">AC Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="d-flex" v-for="(stat, index) in rank.data.results" :key="stat.id">
                                <th scope="row" class="d-block col">{{(page-1)*30+index+1}}</th>
                                <td class="d-block col">
                                    <a style="width: 100px" role="button" class="text-decoration-none" @click="$router.push({ name: 'User', query: { username:stat.user.username }})">{{stat.user.username}}</a>
                                </td>
                                <td class="d-none d-md-block col">{{stat.mood}}</td>
                                <td class="d-block col">{{stat.total_score}}</td>
                                <td class="d-none d-md-block col">{{stat.accepted_number}}</td>
                                <td class="d-none d-md-block col">{{stat.submission_number}}</td>
                                <td class="d-none d-md-block col">{{ac_rate(stat.accepted_number, stat.submission_number)}}</td>
                            </tr>
                            <tr v-if="rank.data.results.length == 0">
                                <td colspan="7" class="text-center">
                                    No Data
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div  class="d-flex justify-content-center"  v-else>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <Pagination @nav="load_page" :total="total" :page="page" :perpage="30" :dress_class="'card-body border-top'" />
        </div>
        <div  class="d-flex justify-content-center"  v-if="!chart_ready">
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
    name:"OIRank",
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
            page: 1,
            total: 0,
            chart_ready: false
        }
    },
    created(){
        this.init()
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
            this.$http.get(window.location.origin + '/api/user_rank?offset=0&limit=30&rule=OI').then(response => {
                this.rank = response.data
                this.chart_ready = true
                for(let i = 0; i < 10 && this.rank.data.results[i]; i++){
                    this.chart_data.datasets[0].data.push(this.rank.data.results[i].total_score)
                    this.chart_data.labels.push(this.rank.data.results[i].user.username)
                }
                this.total = response.data.data.total
            })
        },
        load_page(page){
            window.scrollTo(0,0)
            this.page = page
            let offset = (this.page-1) * 30
            this.rank = null
            this.$http.get(window.location.origin + '/api/user_rank?offset=' + offset + '&limit=30&rule=OI').then(response => {
                this.rank = response.data
            })
        },
        ac_rate(ac,total){
            if(total == 0){
                return '0.00%'
            }else if(ac > total){
                return '100%'
            }
            return (parseInt(ac)*100/parseInt(total)).toFixed(2) + "%"
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