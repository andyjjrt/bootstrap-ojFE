<template>
    <div>
        <div class="card card-body">
            <small class="text-muted">{{ get_time(contest.data.start_time) }}~{{ get_time(contest.data.end_time) }}</small>
            <hr>
            <v-md-editor :value="contest.data.description" mode="preview"></v-md-editor>
        </div>
        <br>
        <Announce />
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
    methods:{
        get_time(isoString){
            return new Date(isoString).toLocaleString();
        },
    }
}
</script>

<style>

</style>