<template>
  <div v-if="dashboard">
    <div class="card card-body">
      <div class="row">
        <div class="col">
          <h2 class="card-title">
            <i class="bi bi-people"></i> {{ dashboard.data.user_count }}
          </h2>
        </div>
        <div class="col">
          <h2 class="card-title">
            <i class="bi bi-trophy"></i>
            {{ dashboard.data.recent_contest_count }}
          </h2>
        </div>
        <div class="col">
          <h2 class="card-title">
            <i class="bi bi-card-list"></i>
            {{ dashboard.data.today_submission_count }}
          </h2>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <h6 class="card-title">
            HTTPS Status:
            <span class="badge rounded-pill bg-success" v-if="isHTTPS"
              >True</span
            ><span class="badge rounded-pill bg-danger" v-else>False</span>
          </h6>
        </div>
        <div class="col">
          <h6 class="card-title">
            Force HTTPS:
            <span
              class="badge rounded-pill bg-success"
              v-if="dashboard.data.env.FORCE_HTTPS"
              >True</span
            ><span class="badge rounded-pill bg-danger" v-else>False</span>
          </h6>
        </div>
        <div class="col">
          <h6 class="card-title">
            CDN HOST:
            <span
              class="badge rounded-pill bg-success"
              v-if="dashboard.data.env.STATIC_CDN_HOST != ''"
              >{{ dashboard.data.env.STATIC_CDN_HOST }}</span
            ><span class="badge rounded-pill bg-warning" v-else>Not used</span>
          </h6>
        </div>
      </div>
    </div>
    <br />
    <div v-if="update_note">
      <div class="list-group">
        <div
          class="list-group-item"
          v-for="note in update_note.data.update"
          :key="note.version"
        >
          <h6>{{ note.title }}</h6>
          <li v-for="detail in note.details" :key="detail" v-html="detail" />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-else>
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "General",
  data() {
    return {
      dashboard: null,
      update_note: null,
    };
  },
  computed: {
    isHTTPS() {
      return window.location.protocol == "https:";
    },
  },
  created() {
    this.$http
      .get(window.location.origin + "/api/admin/dashboard_info")
      .then((response) => {
        this.dashboard = response.data;
      });
    this.$http
      .get(window.location.origin + "/api/admin/versions")
      .then((response) => {
        this.update_note = response.data;
      });
  },
};
</script>

<style></style>
