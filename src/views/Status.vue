<template>
  <div class="container-fluid">
    <StatusList :status_url="status_url" />
  </div>
</template>

<script>
import StatusList from "@/components/StatusList.vue";

export default {
  name: "Status",
  components: {
    StatusList,
  },
  data() {
    return {
      status_url: "/api/submissions?",
    };
  },
  created() {},
};
</script>

<style scoped></style>
