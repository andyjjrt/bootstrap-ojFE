<template>
    <div>
        <div class="card card-body">
            <small class="text-muted">{{ get_time(contest.data.start_time) }}~{{ get_time(contest.data.end_time) }}</small>
            <div v-html="contest.data.description" />
        </div>
        <br>
        <Announce :announce_url="announce_url"/>
    </div>
</template>

<script>
import Announce from '@/components/Announce.vue'
export default {
    name:"contest_home",
    components:{
        Announce
    },
    data(){
        return{
            contest: null,
        }
    },
    created(){
        this.contest = this.$store.state.contest
    },
    computed:{
        announce_url(){
            return '/api/contest/announcement?contest_id=' + this.$store.state.contest.data.id
        },
    },
    methods:{
        get_time(isoString){
            return new Date(isoString).toLocaleString();
        },
    }
}
</script>

<style>

</style>