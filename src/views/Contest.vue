<template>
  <div>
    <div v-if="all_varified">
      <div class="container-fluid">
        <div class="d-flex justify-content-between p-1">
          <h2>{{ contest.data.title }}</h2>
          <span v-html="contest_data.remain_time" />
        </div>
        <ul
          class="nav nav-pills"
          v-if="
            pass_protected == false ||
            $store.state.profile.data.user.admin_type == 'Admin' ||
            $store.state.profile.data.user.admin_type == 'Super Admin'
          "
        >
          <li class="nav-item">
            <router-link
              :to="'/contest/' + $store.state.contest.data.id"
              class="nav-link"
              :class="{ active: check_active('Overview') }"
              >Overview</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/contest/' + $store.state.contest.data.id + '/problem'"
              class="nav-link"
              :class="{ active: check_active('Problem') }"
              >Problem</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/contest/' + $store.state.contest.data.id + '/status'"
              class="nav-link"
              :class="{ active: check_active('Status') }"
              >Status</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/contest/' + $store.state.contest.data.id + '/rank'"
              class="nav-link"
              :class="{ active: check_active('Rank') }"
              >Rank</router-link
            >
          </li>
          <template v-if="$store.state.profile.data">
            <template
              v-if="
                $store.state.profile.data.user.admin_type == 'Admin' ||
                $store.state.profile.data.user.admin_type == 'Super Admin'
              "
            >
              <li class="nav-item">
                <router-link
                  :to="'/admin/contest/' + $store.state.contest.data.id"
                  class="nav-link"
                  >Setting</router-link
                >
              </li>
            </template>
          </template>
        </ul>
        <hr />
      </div>
      <div
        class="container-fluid"
        v-if="
          pass_protected == false ||
          $store.state.profile.data.user.admin_type == 'Admin' ||
          $store.state.profile.data.user.admin_type == 'Super Admin'
        "
      >
        <transition name="component-fade" mode="out-in">
          <router-view />
        </transition>
      </div>
      <div class="container" v-else>
        <form action="#" @submit.prevent="check_pass">
          <div class="mb-3">
            <label class="form-label">Password required</label>
            <div class="form-floating">
              <input
                type="password"
                class="form-control"
                id="ContestPassword"
                placeholder="ContestPassword"
                v-model="pass"
              />
              <label for="ContestPassword">Password</label>
            </div>
          </div>
          <div class="d-flex justify-content-md-end">
            <button class="btn btn-success" type="submit">Access</button>
          </div>
        </form>
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
  name: "Contest",
  data() {
    return {
      contest_data: {
        remain_time: "",
      },
      contest: null,
      ticker: null,
      sec_route: null,
      pass_protected: false,
      pass: "",
      all_varified: false,
    };
  },
  created() {
    this.sec_route = this.$route.meta.contest;
    if (this.$store.state.contest) {
      if (this.$store.state.contest.data.id == this.$route.params.id) {
        this.contest = this.$store.state.contest;
        window.document.title =
          this.$store.state.site.data.website_name_shortcut +
          " | " +
          this.contest.data.title;
        this.init(this.contest);
        return;
      }
    }
    this.$http
      .get(window.location.origin + "/api/contest?id=" + this.$route.params.id)
      .then((response) => {
        this.contest = response.data;
        window.document.title =
          this.$store.state.site.data.website_name_shortcut +
          " | " +
          this.contest.data.title;
        this.$store.commit("get_contest", response.data);
        this.init(this.contest);
      });
  },
  methods: {
    init(response) {
      let start_date = new Date(this.contest.data.start_time);
      let end_date = new Date(this.contest.data.end_time);
      let now_date = new Date();
      if (now_date < start_date) {
        this.contest_data.remain_time =
          '<span class="p-2 fs-5 badge bg-warning">Not Started</span>';
      } else if (now_date > end_date) {
        this.contest_data.remain_time =
          '<span class="p-2 fs-5 badge bg-danger">Ended</span>';
      } else {
        let end = response.data.end_time;
        this.get_remain(end);
        let vm = this;
        this.ticker = window.setInterval(function () {
          vm.get_remain(end);
        }, 1000);
      }
      if (response.data.contest_type == "Password Protected") {
        this.pass_protected = true;
        this.$http
          .get(
            window.location.origin +
              "/api/contest/access?contest_id=" +
              this.$route.params.id
          )
          .then((check_response) => {
            if (check_response.data.data.access == true) {
              this.pass_protected = false;
            }
            this.all_varified = true;
          });
      } else {
        this.all_varified = true;
      }
    },
    get_remain(end) {
      let end_date = new Date(this.contest.data.end_time);
      let now_date = new Date();
      if (now_date > end_date) {
        this.contest_data.remain_time =
          '<span class="p-2 fs-5 badge bg-danger">Ended</span>';
        window.clearInterval(this.ticker);
      }
      const total_ = Date.parse(new Date(end)) - Date.parse(new Date());
      const seconds_ = Math.floor((total_ / 1000) % 60);
      const minutes_ = Math.floor((total_ / 1000 / 60) % 60);
      const hours_ = Math.floor((total_ / (1000 * 60 * 60)) % 24);
      const days_ = Math.floor(total_ / (1000 * 60 * 60 * 24));
      this.contest_data.remain_time =
        '<span class="p-2 fs-5 badge bg-success">' +
        (days_ == 0 ? "" : (days_ < 10 ? "0" + days_ : days_) + "d ") +
        (hours_ < 10 ? "0" + hours_ : hours_) +
        ":" +
        (minutes_ < 10 ? "0" + minutes_ : minutes_) +
        ":" +
        (seconds_ < 10 ? "0" + seconds_ : seconds_) +
        "</span>";
    },
    check_active(name) {
      if (this.sec_route == name) {
        return true;
      }
      return false;
    },
    check_pass() {
      this.$http
        .post(window.location.origin + "/api/contest/password", {
          contest_id: this.$route.params.id,
          password: this.pass,
        })
        .then((response) => {
          if (!response.data.error) {
            this.$message.success({
              message: "Success",
              duration: 1500,
              zIndex: 1000000,
            });
            this.pass_protected = false;
          } else {
            this.$message.error({
              message: response.data.data,
              duration: 1500,
              zIndex: 1000000,
            });
          }
        });
    },
  },
  watch: {
    $route(to) {
      this.sec_route = to.meta.contest;
      window.document.title =
        this.$store.state.site.data.website_name_shortcut +
        " | " +
        this.contest.data.title;
    },
  },
};
</script>

<style></style>
