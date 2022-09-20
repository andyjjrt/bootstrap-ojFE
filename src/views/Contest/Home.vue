<template>
  <div>
    <div class="card card-body">
      <div class="d-flex justify-content-between">
        <small class="text-muted">
          {{ get_time(contest.data.start_time) }}~{{
            get_time(contest.data.end_time)
          }}
        </small>
        <template v-if="$store.state.profile">
          <template v-if="$store.state.profile.data">
            <button
              class="btn btn-primary btn-sm"
              v-if="
                $store.state.profile.data.user.admin_type == 'Admin' ||
                $store.state.profile.data.user.admin_type == 'Super Admin'
              "
              @click="
                $router.push('/admin/contest/' + $store.state.contest.data.id)
              "
            >
              <i class="bi bi-pencil-square"></i>
            </button>
          </template>
        </template>
      </div>
      <hr />
      <v-md-editor
        :value="contest.data.description"
        mode="preview"
      ></v-md-editor>
    </div>
    <br />
    <Announce />
  </div>
</template>

<script>
import Announce from "@/components/Announce.vue";
export default {
  name: "contest_home",
  components: {
    Announce,
  },
  data() {
    return {
      contest: null,
    };
  },
  created() {
    this.contest = this.$store.state.contest;
  },
  methods: {
    get_time(isoString) {
      return new Date(isoString).toLocaleString();
    },
  },
};
</script>

<style></style>
