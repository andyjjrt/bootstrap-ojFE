<template>
  <div class="container text-center">
    <h1>404 Not Found</h1>
    <br />
    <img :src="url" />
    <br />
    <br />
    <div class="d-grid gap-2 col-6 mx-auto">
      <button
        class="btn btn-primary"
        type="button"
        @click="$router.push({ name: 'Home' })"
      >
        Back to Home
      </button>
    </div>
  </div>
</template>

<script>
import PIC from "@/assets/404.jpg";
export default {
  name: "NullPage",
  data() {
    return {
      url: PIC,
    };
  },
};
</script>

<style></style>
