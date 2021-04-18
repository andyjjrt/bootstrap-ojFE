<template>
    <div>
        <Problem :problem_url="problem_url" />
    </div>
</template>

<script>
import Problem from '@/components/Problem.vue'

export default {
    name:"problem_page",
    data(){
        return{
            problem_url: '/api/contest/problem?contest_id=' + this.$route.params.id + '&problem_id=' + this.$route.params.pid
        }
    },
    components:{
        Problem
    }
}
</script>