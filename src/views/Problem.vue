<template>
    <div class="container">
        <Problem :problem_url="problem_url" />
    </div>
</template>

<script>
import Problem from '@/components/Problem.vue'

export default {
    name:"problem_page",
    data(){
        return{
            problem_url: '/api/problem?problem_id=' + this.$route.params.id
        }
    },
    components:{
        Problem
    }
}
</script>