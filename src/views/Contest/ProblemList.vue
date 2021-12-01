<template>
  <ProblemList />
</template>

<script>
import ProblemList from '@/components/Problemlist.vue'
export default {
    name:"contest_ProblemList",
    components:{
      ProblemList
    }
}
</script>

<style scoped>
  .sm-no-display{
    display: none;
  }
  .sm-display{
    display: block;
  }
  .md-no-display{
    display: none;
  }
  @media (min-width: 768px) {
    .md-no-display{
      display: block;
    }
  }
  @media (min-width: 576px) {
    .sm-no-display{
      display: block;
    }
    .sm-display{
      display: none;
    }
  }
</style>
