<template>
  <div>
    <div
      class="modal fade"
      id="ServerdeleteModal"
      tabindex="-1"
      aria-labelledby="ServerdeleteModalLabel"
      aria-hidden="true"
      ref="server_delete_modal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ServerdeleteModalLabel">Confirm</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            If you delete this judge server, it can't be used until next
            heartbeat.
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-danger"
              data-bs-dismiss="modal"
              @click="delete_server"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-body">
      <h4>Judge Server Token</h4>
      <p v-if="server" class="p-2 font-monospace">{{ server.data.token }}</p>
    </div>
    <br />
    <div class="card card-body">
      <h4 class="p-2">Judge Server</h4>
      <div class="table-responsive">
        <table class="table text-nowrap table-bordered" v-if="server">
          <thead>
            <tr>
              <th scope="col">Status</th>
              <th scope="col">Host Name</th>
              <th scope="col">Task Number</th>
              <th scope="col">CPU Core</th>
              <th scope="col">CPU Usage</th>
              <th scope="col">Memory Usage</th>
              <th scope="col">Disabled</th>
              <th scope="col">Option</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="i in server.data.servers">
              <tr :key="i.id">
                <td v-html="status_badge(i.status)"></td>
                <td>{{ i.hostname }}</td>
                <td>{{ i.task_number }}</td>
                <td>{{ i.cpu_core }}</td>
                <td>{{ i.cpu_usage }}%</td>
                <td>{{ i.memory_usage }}%</td>
                <td>
                  <div class="form-check form-switch">
                    <input
                      class="form-check-input"
                      type="checkbox"
                      id="flexSwitchCheckDefault"
                      v-model="i.is_disabled"
                      @change="disable(i.is_disabled, i.id)"
                    />
                  </div>
                </td>
                <td>
                  <button
                    class="btn btn-sm btn-danger"
                    data-bs-toggle="modal"
                    data-bs-target="#ServerdeleteModal"
                    @click="delete_host = i.hostname"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr :key="i.ip">
                <td colspan="8" class="p-3">
                  <p>
                    IP: <span class="badge bg-success">{{ i.ip }}</span> Judger
                    version:
                    <span class="badge bg-success">{{ i.judger_version }}</span>
                  </p>
                  <p>
                    Service URL:
                    <span class="font-monospace">{{ i.service_url }}</span>
                  </p>
                  <p>
                    Last heartbeat:
                    {{ new Date(i.last_heartbeat).toLocaleString() }}
                  </p>
                  <p>
                    Create time: {{ new Date(i.create_time).toLocaleString() }}
                  </p>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "JudgeServer",
  data() {
    return {
      server: null,
      refresh_item: null,
      delete_host: "",
    };
  },
  created() {
    this.refresh_server();
    let vm = this;
    this.refresh_item = window.setInterval(function () {
      vm.refresh_server();
    }, 5000);
  },
  methods: {
    refresh_server() {
      this.$http
        .get(window.location.origin + "/api/admin/judge_server")
        .then((response) => {
          this.server = response.data;
        });
    },
    disable(status, id) {
      this.$http
        .put(window.location.origin + "/api/admin/judge_server", {
          id: id,
          is_disabled: status,
        })
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.refresh_server();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    delete_server() {
      this.$http
        .delete(
          window.location.origin +
            "/api/admin/judge_server?hostname=" +
            this.delete_host
        )
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.refresh_server();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    status_badge(status) {
      if (status == "normal") {
        return '<span class="badge bg-success">Normal</span>';
      } else {
        return '<span class="badge bg-danger">Abnormal</span>';
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    window.clearInterval(this.refresh_item);
    next();
  },
};
</script>

<style></style>
