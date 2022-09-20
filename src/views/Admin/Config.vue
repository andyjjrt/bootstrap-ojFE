<template>
  <div>
    <div class="card card-body">
      <h4 class="mb-3">SMTP Config</h4>
      <div class="row" v-if="smtp">
        <div class="col-sm-6 mb-3">
          <label class="form-label">Server</label>
          <input
            type="text"
            class="form-control"
            placeholder="Server"
            v-model="smtp.data.server"
          />
        </div>
        <div class="col-sm-6 mb-3">
          <label class="form-label">Port</label>
          <input
            type="text"
            class="form-control"
            placeholder="Port"
            v-model="smtp.data.port"
          />
        </div>
        <div class="col-sm-6 mb-3">
          <label class="form-label">Email</label>
          <input
            type="text"
            class="form-control"
            placeholder="Email"
            v-model="smtp.data.email"
          />
        </div>
        <div class="col-sm-6 mb-3">
          <label class="form-label">Password</label>
          <input
            type="text"
            class="form-control"
            placeholder="Password"
            v-model="smtp.data.password"
          />
        </div>
        <div class="col-sm-12 mb-3">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="tls"
              v-model="smtp.data.tls"
            />
            <label class="form-check-label" for="tls">TLS</label>
          </div>
          <br />
        </div>
        <div class="col-sm-9 mb-3">
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              placeholder="Email"
              v-model="test_smtp.email"
            />
            <button
              class="btn btn-warning"
              type="button"
              @click="t_smtp"
              :disabled="test_smtp.disabled"
            >
              Send Test Email
            </button>
          </div>
        </div>
        <div class="col-sm-3 mb-3 d-flex justify-content-end">
          <button class="btn btn-primary" type="button" @click="save_smtp">
            Save
          </button>
        </div>
      </div>
    </div>
    <br />
    <div class="card card-body">
      <h4 class="mb-3">Website Config</h4>
      <div class="row" v-if="website">
        <div class="col-sm-4 mb-3">
          <label class="form-label">Base URL</label>
          <input
            type="text"
            class="form-control"
            placeholder="Base URL"
            v-model="website.data.website_base_url"
          />
        </div>
        <div class="col-sm-4 mb-3">
          <label class="form-label">Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Name"
            v-model="website.data.website_name"
          />
        </div>
        <div class="col-sm-4 mb-3">
          <label class="form-label">Short Name</label>
          <input
            type="text"
            class="form-control"
            placeholder="Short Name"
            v-model="website.data.website_name_shortcut"
          />
        </div>
        <div class="col-sm-12 mb-3">
          <label class="form-label">Footer</label>
          <textarea
            class="form-control"
            rows="3"
            placeholder="Footer"
            v-model="website.data.website_footer"
          ></textarea>
        </div>
        <div class="col-sm-6 mb-3">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="allow_reg"
              v-model="website.data.allow_register"
            />
            <label class="form-check-label" for="allow_reg"
              >Allow Register</label
            >
          </div>
        </div>
        <div class="col-sm-6 mb-3">
          <div class="form-check form-switch">
            <input
              class="form-check-input"
              type="checkbox"
              id="sub_show_all"
              v-model="website.data.submission_list_show_all"
            />
            <label class="form-check-label" for="sub_show_all"
              >Submission List Show All</label
            >
          </div>
        </div>
        <div class="col-sm-12 mb-3 d-flex justify-content-end">
          <button class="btn btn-primary" type="button" @click="save_website">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Config",
  data() {
    return {
      smtp: null,
      website: null,
      test_smtp: {
        email: "",
        disabled: false,
      },
    };
  },
  created() {
    this.init_smtp();
    this.init_website();
  },
  methods: {
    init_smtp() {
      this.$http
        .get(window.location.origin + "/api/admin/smtp")
        .then((response) => {
          this.smtp = response.data;
          this.smtp.data.password = "";
        });
    },
    init_website() {
      this.$http
        .get(window.location.origin + "/api/admin/website")
        .then((response) => {
          this.website = response.data;
        });
    },
    save_smtp() {
      this.$http
        .post(window.location.origin + "/api/admin/smtp", this.smtp.data)
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.init_smtp();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    save_website() {
      this.$http
        .post(window.location.origin + "/api/admin/website", this.website.data)
        .then((response) => {
          if (!response.data.error) {
            this.$http
              .get(window.location.origin + "/api/website")
              .then((response) => {
                this.$store.commit("get_site", response.data);
                window.document.title =
                  this.$store.state.site.data.website_name_shortcut +
                  " | " +
                  this.$route.name;
              });
            this.$success("Succeed");
            this.init_website();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    t_smtp() {
      this.test_smtp.disabled = true;
      this.$http
        .post(window.location.origin + "/api/admin/smtp_test", {
          email: this.test_smtp.email,
        })
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.init_smtp();
          } else {
            this.$error(response.data.data);
          }
          this.test_smtp.disabled = false;
        });
    },
  },
};
</script>

<style></style>
