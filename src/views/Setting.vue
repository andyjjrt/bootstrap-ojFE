<template>
  <div class="container">
    <div class="card card-body">
      <div v-if="profile">
        <div class="d-flex flex-wrap">
          <div class="p-2">
            <img
              :src="custom_avatar($store.state.profile.data.avatar)"
              width="125"
              class="rounded-circle"
              v-if="$store.state.profile.data.avatar"
            />
            <img
              :src="default_avatar"
              width="125"
              class="rounded-circle"
              v-else
            />
          </div>
          <div class="p-2">
            <h3>{{ $store.state.profile.data.user.username }}</h3>
            <p>
              Last login:
              {{
                new Date(
                  $store.state.profile.data.user.last_login
                ).toLocaleString()
              }}
            </p>
          </div>
        </div>
        <br />
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <router-link
              :to="'/setting'"
              class="nav-link"
              :class="{ active: check_active('Profile') }"
              >Profile</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/setting/account'"
              class="nav-link"
              :class="{ active: check_active('Account') }"
              >Account</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :to="'/setting/security'"
              class="nav-link"
              :class="{ active: check_active('Security') }"
              >Security</router-link
            >
          </li>
        </ul>
        <br />
        <transition name="component-fade" mode="out-in">
          <router-view />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Setting",
  data() {
    return {
      profile: null,
    };
  },
  created() {
    this.sec_route = this.$route.meta.setting;
    this.profile = this.$store.state.profile;
    if (this.profile.data == null) {
      this.$message.error({
        message: "Please Login First",
        duration: 1500,
        zIndex: 1000000,
      });
      this.$router.push({ name: "Home" });
      return;
    }
  },
  methods: {
    custom_avatar(src) {
      return window.location.origin + src;
    },
    default_avatar() {
      return window.location.origin + "/public/avatar/default.png";
    },
    check_active(name) {
      if (this.sec_route == name) {
        return true;
      }
      return false;
    },
  },
  watch: {
    $route(to) {
      this.sec_route = to.meta.setting;
    },
  },
};
</script>

<style></style>
