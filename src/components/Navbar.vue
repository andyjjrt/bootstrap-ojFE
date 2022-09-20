<template>
  <div>
    <div
      class="modal fade"
      id="exampleModal"
      ref="login_modal"
      tabindex="-1"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              Welcome to {{ $store.state.site.data.website_name_shortcut }}
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-pills">
              <a
                class="flex-sm-fill text-sm-center nav-link"
                role="button"
                :class="{
                  active:
                    current_action == 'login' || current_action == 'forget',
                }"
                @click="current_action = 'login'"
                >Login</a
              >
              <a
                class="flex-sm-fill text-sm-center nav-link"
                role="button"
                :class="{ active: current_action == 'register' }"
                @click="current_action = 'register'"
                >Register</a
              >
            </ul>
            <br />
            <div v-if="current_action == 'register'">
              <form @submit.prevent="register" action="#">
                <div class="mb-3">
                  <div class="form-floating mb-3">
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="username"
                      v-model="reg.username"
                    />
                    <label for="username">Username</label>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-floating mb-3">
                    <input
                      type="email"
                      class="form-control"
                      id="email"
                      placeholder="email"
                      v-model="reg.email"
                    />
                    <label for="email">Email</label>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Password"
                      v-model="reg.password"
                    />
                    <label for="password">Password</label>
                  </div>
                </div>
                <div class="mb-3">
                  <div class="form-floating">
                    <input
                      type="password"
                      class="form-control"
                      id="con_password"
                      placeholder="Confirm Password"
                      v-model="reg.password_con"
                    />
                    <label for="con_password">Confirm Password</label>
                  </div>
                </div>
                <div class="row mb-3">
                  <div class="col-8">
                    <div class="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="captcha"
                        placeholder="Captcha"
                        v-model="reg.captcha"
                      />
                      <label for="captcha">Captcha</label>
                    </div>
                  </div>
                  <div class="col-4 position-relative">
                    <img
                      :src="reg.captcha_url"
                      class="position-absolute top-50 start-50 translate-middle"
                    />
                  </div>
                </div>
                <div class="p-3" v-if="register_error">
                  <div class="alert alert-danger" role="alert">
                    {{ register_error }}
                  </div>
                </div>
                <div class="d-flex flex-row-reverse bd-highlight">
                  <button
                    type="submit"
                    class="btn btn-primary"
                    :class="{ disabled: login_btn }"
                  >
                    Register
                  </button>
                </div>
              </form>
            </div>
            <div v-else>
              <div v-if="current_action == 'login'">
                <form @submit.prevent="login" action="#">
                  <div class="mb-3">
                    <div class="form-floating mb-3">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingInput"
                        placeholder="username"
                        @blur="check_2fa"
                        v-model="username"
                      />
                      <label for="floatingInput">Username</label>
                    </div>
                  </div>
                  <div class="mb-3">
                    <div class="form-floating">
                      <input
                        type="password"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="Password"
                        v-model="password"
                      />
                      <label for="floatingPassword">Password</label>
                    </div>
                  </div>
                  <div class="mb-3" v-if="require_2fa">
                    <div class="form-floating">
                      <input
                        type="text"
                        class="form-control"
                        id="floatingPassword"
                        placeholder="2FA Code"
                        v-model="code_2fa"
                      />
                      <label for="floatingPassword">2FA Code</label>
                    </div>
                  </div>
                  <div class="p-3" v-if="login_error">
                    <div class="alert alert-danger" role="alert">
                      {{ login_error }}
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <a
                      role="button"
                      class="text-decoration-none"
                      @click="current_action = 'forget'"
                      >Forget Password?</a
                    >
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :class="{ disabled: login_btn }"
                    >
                      Login
                    </button>
                  </div>
                </form>
              </div>
              <div v-else>
                <form @submit.prevent="forgetPass" action="#">
                  <div class="mb-3">
                    <div class="form-floating mb-3">
                      <input
                        type="email"
                        class="form-control"
                        id="floatingInput"
                        placeholder="username"
                        v-model="forget.email"
                      />
                      <label for="floatingInput">Email</label>
                    </div>
                  </div>
                  <div class="row mb-3">
                    <div class="col-8">
                      <div class="form-floating">
                        <input
                          type="text"
                          class="form-control"
                          id="fcaptcha"
                          placeholder="Captcha"
                          v-model="forget.captcha"
                        />
                        <label for="fcaptcha">Captcha</label>
                      </div>
                    </div>
                    <div class="col-4 position-relative">
                      <img
                        :src="forget.captcha_url"
                        class="position-absolute top-50 start-50 translate-middle"
                      />
                    </div>
                  </div>
                  <div class="p-3" v-if="forget.error">
                    <div class="alert alert-danger" role="alert">
                      {{ forget.error }}
                    </div>
                  </div>
                  <div class="d-flex justify-content-between">
                    <a
                      role="button"
                      class="text-decoration-none"
                      @click="current_action = 'login'"
                      >Got Password?</a
                    >
                    <button
                      type="submit"
                      class="btn btn-primary"
                      :class="{ disabled: forget.btn }"
                    >
                      Send Reset Email
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <nav class="navbar navbar-expand-lg navbar-light fixed-top bg-light">
      <div class="container-fluid position-relative">
        <router-link
          to="/"
          class="navbar-brand d-none d-lg-block"
          @click.native="toggle_collapse"
          >{{ nav_brand }}</router-link
        >
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <router-link
          to="/"
          class="navbar-brand d-block d-lg-none position-absolute top-0 start-50 translate-middle-x"
          @click.native="toggle_collapse"
          >{{ nav_brand }}</router-link
        >
        <div
          class="collapse navbar-collapse"
          id="navbarSupportedContent"
          ref="nav_collapse"
        >
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <router-link
                to="/"
                class="nav-link text-nowrap"
                @click.native="toggle_collapse"
                :class="{ active: check_active('Home') }"
                ><i class="bi bi-house" style="padding: 0px 6px"></i
                >Home</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/problem"
                class="nav-link text-nowrap"
                @click.native="toggle_collapse"
                :class="{ active: check_active('Problem') }"
                ><i class="bi bi-grid-3x3-gap" style="padding: 0px 6px"></i
                >Problem</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/contest"
                class="nav-link text-nowrap"
                @click.native="toggle_collapse"
                :class="{ active: check_active('Contest') }"
                ><i class="bi bi-trophy" style="padding: 0px 6px"></i
                >Contest</router-link
              >
            </li>
            <li class="nav-item">
              <router-link
                to="/status"
                class="nav-link text-nowrap"
                @click.native="toggle_collapse"
                :class="{ active: check_active('Status') }"
                ><i class="bi bi-graph-up" style="padding: 0px 6px"></i
                >Status</router-link
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-bar-chart-line" style="padding: 0px 6px"></i
                >Rank
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link
                    to="/acm-rank"
                    class="dropdown-item"
                    @click.native="toggle_collapse"
                    >ACM Rank</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/oi-rank"
                    class="dropdown-item"
                    @click.native="toggle_collapse"
                    >OI Rank</router-link
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i class="bi bi-info-circle" style="padding: 0px 6px"></i>About
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <router-link
                    to="/judger"
                    class="dropdown-item"
                    @click.native="toggle_collapse"
                    >Judger</router-link
                  >
                </li>
                <li>
                  <router-link
                    to="/faq"
                    class="dropdown-item"
                    @click.native="toggle_collapse"
                    >FAQ</router-link
                  >
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="position-absolute top-0 end-0 d-flex">
          <div v-if="profile != null" class="px-2">
            <div v-if="profile.data == null">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#exampleModal"
                @click="
                  current_action = 'login';
                  check_2fa();
                "
              >
                Login
              </button>
            </div>
            <div v-else>
              <div class="dropdown">
                <a
                  role="button"
                  class="navbar-brand"
                  id="dropdownMenuLink"
                  ref="drop_profile"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    :src="custom_avatar(profile.data.avatar)"
                    width="40"
                    class="rounded-circle"
                    v-if="profile.data.avatar"
                  />
                  <img
                    :src="default_avatar"
                    width="40"
                    class="rounded-circle"
                    v-else
                  />
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 class="dropdown-header">
                      {{ profile.data.user.username }}
                    </h6>
                  </li>
                  <li>
                    <a class="dropdown-item" role="button" @click="to_user"
                      >Home</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      role="button"
                      @click="to_submission"
                      >Submissions</a
                    >
                  </li>
                  <li>
                    <a class="dropdown-item" role="button" @click="to_setting"
                      >Setting</a
                    >
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      role="button"
                      @click="$router.push({ path: '/admin' })"
                      v-if="
                        profile.data.user.admin_type == 'Admin' ||
                        profile.data.user.admin_type == 'Super Admin'
                      "
                      >Management</a
                    >
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item" role="button" @click="logout"
                      >Logout</a
                    >
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import Modal from "bootstrap/js/dist/modal.js";
import Collapse from "bootstrap/js/dist/collapse.js";
import Dropdown from "bootstrap/js/dist/dropdown.js";
import storage from "@/util/storage.js";

export default {
  data() {
    return {
      LoginModal: null,
      NavCollapse: null,
      DropProfile: null,
      username: "",
      password: "",
      require_2fa: false,
      code_2fa: "",
      login_error: null,
      register_error: null,
      top_route: null,

      current_action: "login",
      login_btn: false,
      register_btn: false,

      reg: {
        username: "",
        email: "",
        password: "",
        password_con: "",
        captcha: "",
        captcha_url: "",
      },

      forget: {
        email: "",
        captcha: "",
        captcha_url: "",
        error: null,
        btn: false,
      },
    };
  },
  created() {
    try {
      document.body.removeChild(document.getElementById("app-loader"));
    } catch (e) {
      console.error(e);
    }
  },
  mounted() {
    this.LoginModal = new Modal(this.$refs.login_modal);
    this.NavCollapse = new Collapse(this.$refs.nav_collapse, { toggle: false });
    if (this.profile != null && this.profile.data != null) {
      this.DropProfile = new Dropdown(this.$refs.drop_profile);
    }
    this.top_route = this.$route.meta.title;
  },
  computed: {
    nav_brand() {
      if (this.$store.state.site.data) {
        return this.$store.state.site.data.website_name;
      }
      return "";
    },
    profile() {
      return this.$store.state.profile;
    },
  },
  methods: {
    login() {
      this.login_btn = true;
      this.login_error = null;
      let payload = { username: this.username, password: this.password };
      if (this.require_2fa) {
        payload.tfa_code = this.code_2fa;
      }
      this.$http
        .post(window.location.origin + "/api/login", payload)
        .then((res) => {
          this.login_btn = false;
          if (res.data.error) {
            this.login_error = res.data.data;
            return;
          } else {
            this.$store.commit("get_profile", null);
            this.$http
              .get(window.location.origin + "/api/profile")
              .then((response) => {
                this.$store.commit("get_profile", response.data);
              });
            this.LoginModal.toggle();
            this.toggle_collapse();
            this.$success("Welcome back to OJ");
          }
        })
        .catch((error) => {
          this.$error(error);
          this.LoginModal.toggle();
        });
    },
    register() {
      if (
        this.reg.password != this.reg.password_con ||
        this.reg.password == ""
      ) {
        this.register_error = "confirm password";
        this.captcha();
        this.reg.captcha = "";
        return;
      }
      this.register_btn = true;
      this.register_error = null;
      this.$http
        .post(window.location.origin + "/api/register", {
          username: this.reg.username,
          password: this.reg.password,
          captcha: this.reg.captcha,
          email: this.reg.email,
        })
        .then((res) => {
          this.register_btn = false;
          if (res.data.error) {
            this.register_error = res.data.data;
            this.captcha();
            this.reg.captcha = "";
            return;
          }
          this.current_action = "login";
          this.$success("Register Succeed!");
        })
        .catch((error) => {
          this.$error(error);
          this.LoginModal.toggle();
        });
    },
    forgetPass() {
      if (this.forget.email == "" || this.forget.captcha == "") {
        this.forget.error = "Please fill blanks";
        this.forget_captcha();
        this.forget.captcha = "";
        return;
      }
      this.forget.btn = true;
      this.forget.error = null;
      this.$http
        .post(window.location.origin + "/api/apply_reset_password", {
          captcha: this.forget.captcha,
          email: this.forget.email,
        })
        .then((res) => {
          this.forget.btn = false;
          if (res.data.error) {
            this.forget.error = res.data.data;
            this.forget_captcha();
            this.forget.captcha = "";
            return;
          }
          this.LoginModal.toggle();
          this.toggle_collapse();
          this.$success("Email sent! Please check mailbox");
        })
        .catch((error) => {
          this.$error(error);
          this.LoginModal.toggle();
        });
    },
    logout() {
      this.toggle_collapse();
      this.$http
        .get(window.location.origin + "/api/logout")
        .then((response) => {
          this.$store.commit("get_profile", response.data);
          storage.clear();
          this.$router.push({ name: "Home" });
        });
    },
    default_avatar() {
      return window.location.origin + "/public/avatar/default.png";
    },
    custom_avatar(src) {
      return window.location.origin + src;
    },
    toggle_collapse() {
      this.NavCollapse.hide();
    },
    to_user() {
      this.toggle_collapse();
      this.$router.push({ name: "User" });
    },
    to_submission() {
      this.toggle_collapse();
      this.$router.push({ name: "Status", query: { page: 1, myself: 1 } });
    },
    to_setting() {
      this.toggle_collapse();
      this.$router.push({ path: "/setting" });
    },
    check_active(name) {
      if (this.top_route == name) {
        return true;
      }
      return false;
    },
    captcha() {
      this.reg.captcha_url = "";
      this.$http
        .get(window.location.origin + "/api/captcha")
        .then((response) => {
          this.reg.captcha_url = response.data.data;
        });
    },
    forget_captcha() {
      this.forget.captcha_url = "";
      this.$http
        .get(window.location.origin + "/api/captcha")
        .then((response) => {
          this.forget.captcha_url = response.data.data;
        });
    },
    check_2fa() {
      this.$http
        .post(window.location.origin + "/api/tfa_required", {
          username: this.username,
        })
        .then((response) => {
          this.require_2fa = response.data.data.result;
        });
    },
  },
  watch: {
    $route(to) {
      this.top_route = to.meta.title;
      if (
        to.meta.title != "Contest" ||
        (to.meta.title == "Contest" && !to.meta.contest)
      ) {
        window.document.title =
          this.$store.state.site.data.website_name_shortcut + " | " + to.name;
      }
    },
    current_action(a) {
      if (a == "register") {
        this.reg = {
          username: "",
          email: "",
          password: "",
          password_con: "",
          captcha: "",
          captcha_url: "",
        };
        this.$http
          .get(window.location.origin + "/api/captcha")
          .then((response) => {
            this.reg.captcha_url = response.data.data;
          });
      } else if (a == "forget") {
        this.forget = {
          email: "",
          captcha: "",
          captcha_url: "",
        };
        this.$http
          .get(window.location.origin + "/api/captcha")
          .then((response) => {
            this.forget.captcha_url = response.data.data;
          });
      } else {
        this.reg.captcha_url = "";
      }
    },
  },
};
</script>
