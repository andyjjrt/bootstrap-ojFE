<template>
  <div class="container">
    <div v-if="profile">
      <br /><br /><br />
      <div class="card position-relative">
        <div class="card-body">
          <div class="text-center pt-5">
            <p>
              <span class="fw-bolder fs-4">{{ username }}</span>
              <span v-if="profile.data.school">@{{ profile.data.school }}</span>
              <br />
              <span
                class="badge bg-danger"
                v-if="profile.data.user.admin_type == 'Super Admin'"
                >Super Admin</span
              >
              <span
                class="badge bg-danger"
                v-if="profile.data.user.admin_type == 'Admin'"
                >Admin</span
              >
            </p>
            <p v-if="profile.data.mood">{{ profile.data.mood }}</p>
          </div>
          <hr />
          <div class="row text-center">
            <div class="col">
              <p>Solved</p>
              <p class="fw-bolder fs-4">{{ profile.data.accepted_number }}</p>
            </div>
            <div class="col">
              <p>Submissions</p>
              <p class="fw-bolder fs-4">{{ profile.data.submission_number }}</p>
            </div>
            <div class="col">
              <p>Score</p>
              <p class="fw-bolder fs-4">{{ profile.data.total_score }}</p>
            </div>
          </div>
          <br /><br />
          <div class="text-center">
            <div class="btn-group" role="group" aria-label="Basic example">
              <a
                role="button"
                class="btn btn-light btn-lg text-black"
                :href="'mailto:' + profile.data.user.email"
              >
                <i class="bi bi-envelope"></i>
              </a>
              <a
                role="button"
                class="btn btn-light btn-lg text-black"
                :href="profile.data.github"
              >
                <i class="bi bi-github"></i>
              </a>
              <a
                role="button"
                class="btn btn-light btn-lg text-black"
                :href="profile.data.blog"
              >
                <i class="bi bi-globe"></i>
              </a>
            </div>
          </div>
          <div class="position-absolute top-0 start-50 translate-middle">
            <img
              :src="custom_avatar(profile.data.avatar)"
              width="125"
              class="rounded-circle"
              v-if="profile.data.avatar"
            />
            <img
              :src="default_avatar"
              width="125"
              class="rounded-circle"
              v-else
            />
          </div>
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
  name: "User",
  data() {
    return {
      username: undefined,
      profile: null,
      stats: {
        solved: 0,
        submissions: 0,
        score: 0,
      },
    };
  },
  created() {
    this.username = this.$route.query.username;
    if (this.username == undefined) {
      this.profile = this.$store.state.profile;
      if (this.profile.data != null) {
        this.username = this.profile.data.user.username;
      }
      this.push_back();
    } else {
      this.$http
        .get(window.location.origin + "/api/profile?username=" + this.username)
        .then((response) => {
          this.profile = response.data;
          this.push_back();
        });
    }
  },
  methods: {
    custom_avatar(src) {
      return window.location.origin + src;
    },
    default_avatar() {
      return window.location.origin + "/public/avatar/default.png";
    },
    push_back() {
      if (this.profile.data == null || this.login == false) {
        this.$message.error({
          message: "Please Login First",
          duration: 1500,
          zIndex: 1000000,
        });
        this.$router.push({ name: "Home" });
        return;
      }
      if (this.profile.error) {
        this.$message.error({
          message: this.profile.data,
          duration: 1500,
          zIndex: 1000000,
        });
        this.$router.push({ name: "Home" });
        return;
      }
    },
  },
  watch: {
    login() {
      this.push_back();
    },
  },
};
</script>

<style></style>
