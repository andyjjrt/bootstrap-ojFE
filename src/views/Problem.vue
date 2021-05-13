<template>
    <div class="container">
        <Problem :problem_url="problem_url" type="normal" />
    </div>
</template>

<script>
import Problem from '@/components/Problem.vue'

export default {
    name:"problem_page",
    data(){
        return{
            problem_url: '/api/problem?problem_id=' + this.$route.params.pid
        }
    },
    components:{
        Problem
    }
}
</script>