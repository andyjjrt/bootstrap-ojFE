<template>
  <div v-if="$store.state.contest">
    <OIRank v-if="$store.state.contest.data.rule_type == 'OI'" />
    <ACMRank v-else />
  </div>
</template>

<script>
import OIRank from "@/views/Contest/OIRank.vue";
import ACMRank from "@/views/Contest/ACMRank.vue";
export default {
  name: "Contest_Rank",
  components: {
    OIRank,
    ACMRank,
  },
};
</script>

<style></style>
