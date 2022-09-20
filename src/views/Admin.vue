<template>
  <div v-if="profile" class="container-fluid">
    <div
      v-if="
        profile.user.admin_type == 'Admin' ||
        profile.user.admin_type == 'Super Admin'
      "
      class="d-lg-flex"
    >
      <div class="me-4 d-none d-lg-block" style="min-width: 200px">
        <div class="card">
          <ul class="list-group list-group-flush">
            <router-link
              to="/admin"
              class="list-group-item"
              :class="{ active: check_active('DashBoard') }"
            >
              <i class="bi bi-palette-fill" style="padding-right: 5px"></i>
              Dashboard
            </router-link>
            <template v-if="profile.user.admin_type == 'Super Admin'">
              <router-link
                :to="'/admin/users'"
                class="list-group-item"
                :class="{ active: check_active('Users') }"
              >
                <i class="bi bi-people-fill" style="padding-right: 5px"></i>
                Users
              </router-link>
              <router-link
                :to="'/admin/announce'"
                class="list-group-item"
                :class="{ active: check_active('Announce') }"
              >
                <i class="bi bi-megaphone-fill" style="padding-right: 5px"></i>
                Announce
              </router-link>
              <router-link
                :to="'/admin/config'"
                class="list-group-item"
                :class="{ active: check_active('Config') }"
              >
                <i class="bi bi-wrench" style="padding-right: 5px"></i>
                Config
              </router-link>
              <router-link
                :to="'/admin/judgeserver'"
                class="list-group-item"
                :class="{ active: check_active('Judge Server') }"
              >
                <i class="bi bi-server" style="padding-right: 5px"></i>
                Server
              </router-link>
              <router-link
                :to="'/admin/prunetestcase'"
                class="list-group-item"
                :class="{ active: check_active('Prune Testcase') }"
              >
                <i class="bi bi-safe-fill" style="padding-right: 5px"></i>
                Prune Testcase
              </router-link>
            </template>
            <router-link
              to="/admin/problem"
              class="list-group-item"
              :class="{ active: check_active('Problem') }"
            >
              <i class="bi bi-grid-3x3-gap-fill" style="padding-right: 5px"></i>
              Problem
            </router-link>
            <router-link
              to="/admin/contest"
              class="list-group-item"
              :class="{ active: check_active('ContestList') }"
            >
              <i class="bi bi-trophy-fill" style="padding-right: 5px"></i>
              Contest
            </router-link>
          </ul>
        </div>
      </div>
      <!-- <div class="card card-body">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <router-link
              :to="'/admin'"
              class="nav-link"
              :class="{ active: check_active('DashBoard') }"
              ><i class="bi bi-palette-fill" style="padding-right: 5px"></i
              >Dashboard</router-link
            >
          </li>
          <li
            class="nav-item dropdown"
            v-if="profile.user.admin_type == 'Super Admin'"
          >
            <a
              class="nav-link dropdown-toggle"
              data-bs-toggle="dropdown"
              href="#"
              role="button"
              aria-expanded="false"
              >General</a
            >
            <ul class="dropdown-menu">
              <li>
                <router-link
                  :to="'/admin/users'"
                  class="dropdown-item"
                  :class="{ active: check_active('Users') }"
                  ><i class="bi bi-people-fill" style="padding-right: 5px"></i
                  >Users</router-link
                >
              </li>
              <li>
                <router-link
                  :to="'/admin/announce'"
                  class="dropdown-item"
                  :class="{ active: check_active('Announce') }"
                  ><i
                    class="bi bi-megaphone-fill"
                    style="padding-right: 5px"
                  ></i
                  >Announce</router-link
                >
              </li>
              <li>
                <router-link
                  :to="'/admin/config'"
                  class="dropdown-item"
                  :class="{ active: check_active('Config') }"
                  ><i class="bi bi-wrench" style="padding-right: 5px"></i
                  >Config</router-link
                >
              </li>
              <li>
                <router-link
                  :to="'/admin/judgeserver'"
                  class="dropdown-item"
                  :class="{ active: check_active('Judge Server') }"
                  ><i class="bi bi-server" style="padding-right: 5px"></i>Judge
                  Server</router-link
                >
              </li>
              <li>
                <router-link
                  :to="'/admin/prunetestcase'"
                  class="dropdown-item"
                  :class="{ active: check_active('Prune Testcase') }"
                  ><i class="bi bi-safe-fill" style="padding-right: 5px"></i
                  >Prune testcase</router-link
                >
              </li>
            </ul>
          </li>
          <li class="nav-item" v-if="profile.user.problem_permission != 'None'">
            <router-link
              :to="'/admin/problem'"
              class="nav-link"
              :class="{ active: check_active('Problem') }"
              ><i class="bi bi-grid-3x3-gap-fill" style="padding-right: 5px"></i
              >Problem</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/admin/contest'"
              class="nav-link"
              :class="{ active: check_active('ContestList') }"
              ><i class="bi bi-trophy-fill" style="padding-right: 5px"></i
              >Contest</router-link
            >
          </li>
        </ul>
      </div> -->
      <div class="flex-lg-grow-1">
        <h3 class="d-flex">
          <div @click="offCanvasRef.toggle()" class="d-block d-lg-none mx-2">
            <i class="bi bi-list" style="cursor: pointer"></i>
          </div>
          {{ seeroute }}
        </h3>
        <br />
        <router-view />
      </div>
    </div>
    <div class="offcanvas offcanvas-start" tabindex="-1" ref="offCanvas">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasExampleLabel">Admin menu</h5>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body p-0">
        <ul class="list-group list-group-flush">
          <router-link
            to="/admin"
            class="list-group-item"
            :class="{ active: check_active('DashBoard') }"
          >
            <i class="bi bi-palette-fill" style="padding-right: 5px"></i>
            Dashboard
          </router-link>
          <template v-if="profile.user.admin_type == 'Super Admin'">
            <router-link
              :to="'/admin/users'"
              class="list-group-item"
              :class="{ active: check_active('Users') }"
            >
              <i class="bi bi-people-fill" style="padding-right: 5px"></i>
              Users
            </router-link>
            <router-link
              :to="'/admin/announce'"
              class="list-group-item"
              :class="{ active: check_active('Announce') }"
            >
              <i class="bi bi-megaphone-fill" style="padding-right: 5px"></i>
              Announce
            </router-link>
            <router-link
              :to="'/admin/config'"
              class="list-group-item"
              :class="{ active: check_active('Config') }"
            >
              <i class="bi bi-wrench" style="padding-right: 5px"></i>
              Config
            </router-link>
            <router-link
              :to="'/admin/judgeserver'"
              class="list-group-item"
              :class="{ active: check_active('Judge Server') }"
            >
              <i class="bi bi-server" style="padding-right: 5px"></i>
              Server
            </router-link>
            <router-link
              :to="'/admin/prunetestcase'"
              class="list-group-item"
              :class="{ active: check_active('Prune Testcase') }"
            >
              <i class="bi bi-safe-fill" style="padding-right: 5px"></i>
              Prune Testcase
            </router-link>
          </template>
          <router-link
            to="/admin/problem"
            class="list-group-item"
            :class="{ active: check_active('Problem') }"
          >
            <i class="bi bi-grid-3x3-gap-fill" style="padding-right: 5px"></i>
            Problem
          </router-link>
          <router-link
            to="/admin/contest"
            class="list-group-item"
            :class="{ active: check_active('ContestList') }"
          >
            <i class="bi bi-trophy-fill" style="padding-right: 5px"></i>
            Contest
          </router-link>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Offcanvas from "bootstrap/js/dist/offcanvas.js";
export default {
  name: "Admin",
  data() {
    return {
      offCanvasRef: null,
    };
  },
  computed: {
    profile() {
      return this.$store.state.profile.data;
    },
  },
  created() {
    this.seeroute = this.$route.meta.admin;
    if (this.profile == null) {
      this.$message.error({
        message: "Please login first",
        duration: 1500,
        zIndex: 1000000,
      });
      this.$router.push({ name: "Home" });
    } else if (
      this.profile.user.admin_type != "Admin" &&
      this.profile.user.admin_type != "Super Admin"
    ) {
      this.$message.error({
        message: "Please login first",
        duration: 1500,
        zIndex: 1000000,
      });
      this.$router.push({ name: "Home" });
    }
  },
  mounted() {
    this.offCanvasRef = new Offcanvas(this.$refs.offCanvas);
  },
  methods: {
    check_active(name) {
      if (this.seeroute == name) {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route(to) {
      this.seeroute = to.meta.admin;
    },
  },
};
</script>

<style>
.btn-toggle {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  background-color: transparent;
  border: 0;
}
.btn-toggle:hover,
.btn-toggle:focus {
  color: rgba(0, 0, 0, 1);
}

.btn-toggle::before {
  width: 1.25em;
  line-height: 0;
  content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
  transition: transform 0.35s ease;
  transform-origin: 0.5em 50%;
}

.btn-toggle[aria-expanded="true"]::before {
  color: rgba(255, 255, 255, 0.85);
  transform: rotate(90deg);
}

.btn-toggle-nav a {
  display: inline-flex;
  padding: 0.1875rem 0.5rem;
  margin-top: 0.125rem;
  margin-left: 1.25rem;
  text-decoration: none;
}
.btn-toggle-nav a:hover,
.btn-toggle-nav a:focus {
  color: rgba(0, 0, 0, 1);
}

.btn-toggle-nav a.active {
  color: rgba(255, 255, 255, 0.85);
  background-color: #4285f4;
}

.btn-nav a {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  background-color: transparent;
  border: 0;
}

.btn-nav a:hover,
.btn-nav a:focus {
  color: rgba(0, 0, 0, 1);
}

.btn-nav a.active {
  color: rgba(255, 255, 255, 0.85);
  background-color: #4285f4;
}
</style>
