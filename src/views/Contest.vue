<template>
    <div v-if="contest">
        <div class="container-fluid">
            <div class="d-flex justify-content-between p-1">
                <h2>{{contest.data.title}}</h2>
                <span v-html="contest_data.remain_time"/>
            </div>
            <ul class="nav nav-pills">
                <li class="nav-item">
                    <router-link :to="'/contest/' + $store.state.contest.data.id" class="nav-link">Overview</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="'/contest/' + $store.state.contest.data.id + '/problem'" class="nav-link">Problems</router-link>
                </li>
                <li class="nav-item">
                    <router-link :to="'/contest/' + $store.state.contest.data.id + '/status'" class="nav-link">Status</router-link>
                </li>
            </ul>
            <hr>
        </div>
        <div class="container">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    name:"Contest",
    data(){
        return{
            contest_data:{
                announce: "/api/contest/announcement?contest_id=67",
                remain_time:""
            },
            contest: null,
            ticker: null
        }
    },
    created(){
        this.$http.get(window.location.origin + '/api/contest?id=' + this.$route.params.id).then(response => {
            this.contest = response.data
            this.$store.commit('get_contest', response.data)
            let start_date = new Date(this.contest.data.start_time)
            let end_date = new Date(this.contest.data.end_time)
            let now_date = new Date()
            if(now_date < start_date){
                this.contest_data.remain_time = '<span class="p-2 fs-5 badge bg-warning text-dark">Not Started</span>'
            }else if(now_date > end_date){
                this.contest_data.remain_time = '<span class="p-2 fs-5 badge bg-danger">Ended</span>'
            }else{
                let end = response.data.data.end_time
                this.get_remain(end)
                let vm = this
                this.ticker = window.setInterval(function(){vm.get_remain(end)}, 1000)
            }
        });
    },
    methods:{
        get_remain(end){
            const total_ = Date.parse(new Date(end)) - Date.parse(new Date());
            const seconds_ = Math.floor( (total_/1000) % 60 );
            const minutes_ = Math.floor( (total_/1000/60) % 60 );
            const hours_ = Math.floor( (total_/(1000*60*60)) % 24 );
            const days_ = Math.floor( total_/(1000*60*60*24) );
            this.contest_data.remain_time =  '<span class="p-2 fs-5 badge bg-success">' + days_ + "d " + hours_ + ":" + minutes_ + ":" + seconds_ + '</span>'
        }
    }
    
}
</script>

<style>

</style>