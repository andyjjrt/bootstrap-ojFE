<template>
    <StatusList :status_url="status_url" mode="contest"/>
</template>

<script>
import StatusList from '@/components/StatusList.vue'

export default {
    name:"Status",
    components:{
        StatusList
    },
    data(){
        return{
            status_url : '/api/contest_submissions?contest_id=' + this.$store.state.contest.data.id + '&'
        }
    },
    created() {
    },
}
</script>

<style scoped>

</style>