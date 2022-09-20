<template>
  <div class="container">
    <Status :id="$route.params.submission_id" />
  </div>
</template>

<script>
import Status from "@/components/Status.vue";
export default {
  name: "Submission",
  components: {
    Status,
  },
};
</script>

<style></style>
