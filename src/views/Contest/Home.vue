<template>
    <div>
        <div class="card card-body" v-html="contest.data.description"/>
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
        }
    }
}
</script>

<style>

</style>