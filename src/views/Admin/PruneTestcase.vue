<template>
  <div>
    <div class="card card-body">
      <h4>Prune Testcase</h4>
      <small class="mb-3 text-muted"
        >These test cases are not owned by any problem, you can clean them
        safely.</small
      >
      <div class="table-responsive">
        <table class="table text-nowrap" v-if="testcase">
          <thead>
            <tr>
              <th scope="col">Create Time</th>
              <th scope="col">Testcase ID</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in testcase.data" :key="i.id">
              <td>{{ new Date(i.create_time * 1000).toLocaleString() }}</td>
              <td>{{ i.id }}</td>
              <td>
                <button class="btn btn-sm btn-danger" @click="delete_id(i.id)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="testcase.data.length == 0">
              <td colspan="3" class="text-center">No Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="testcase">
        <button
          v-if="testcase.data.length != 0"
          class="btn btn-warning"
          @click="delete_all"
        >
          <i class="bi bi-trash"></i> Delete All
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PruneTestcase",
  data() {
    return {
      testcase: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$http
        .get(window.location.origin + "/api/admin/prune_test_case")
        .then((response) => {
          this.testcase = response.data;
        });
    },
    delete_id(id) {
      this.$http
        .delete(window.location.origin + "/api/admin/prune_test_case?id=" + id)
        .then(() => {
          this.init();
        });
    },
    delete_all() {
      this.$http
        .delete(window.location.origin + "/api/admin/prune_test_case")
        .then(() => {
          this.init();
        });
    },
  },
};
</script>

<style></style>
