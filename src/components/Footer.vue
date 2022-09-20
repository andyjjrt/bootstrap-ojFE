<template>
  <div>
    <div class="text-center" style="font-size: 0.7em">
      <span v-html="footer"></span>
      <br />
      <span>
        FE redesign by
        <a href="https://github.com/andyjjrt/bootstrap-ojFE" class="a-class"
          >andyjjrt</a
        >
        <span>
          &nbsp; Version:
          <a
            class="a-class"
            :href="
              'https://github.com/andyjjrt/bootstrap-ojFE/releases/tag/V' +
              version
            "
          >
            {{ version }}-{{ hash }}
          </a>
        </span>
      </span>
    </div>
    <br />
  </div>
</template>

<script>
export default {
  computed: {
    footer() {
      if (this.$store.state.site) {
        return this.$store.state.site.data.website_footer;
      }
      return "";
    },
    version() {
      return process.env.VUE_APP_VERSION;
    },
    hash() {
      return process.env.VUE_APP_HASH;
    },
  },
};
</script>

<style>
.a-class {
  text-decoration: none;
}
</style>
