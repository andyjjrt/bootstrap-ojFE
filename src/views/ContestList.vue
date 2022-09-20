<template>
  <div class="container-fluid">
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-sm-8">
            <div class="d-flex justify-content-between">
              <div class="card-title fs-4">Contests</div>
              <div class="d-flex">
                <span class="px-1">
                  <div class="dropdown">
                    <button
                      class="btn btn-light text-dark border dropdown-toggle btn-sm"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {{ rule_type == "" ? "Rule" : rule_type }}
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_rule_type('')"
                          >All</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_rule_type('OI')"
                          >OI</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_rule_type('ACM')"
                          >ACM</a
                        >
                      </li>
                    </ul>
                  </div>
                </span>
                <span class="px-1">
                  <div class="dropdown">
                    <button
                      class="btn btn-light text-dark border dropdown-toggle btn-sm"
                      type="button"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {{
                        status == ""
                          ? "Status"
                          : status == "1"
                          ? "Not Started"
                          : status == "-1"
                          ? "Ended"
                          : status == "0"
                          ? "Underway"
                          : "Null"
                      }}
                    </button>
                    <ul
                      class="dropdown-menu"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_status('')"
                          >All</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_status('1')"
                          >Not Started</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_status('-1')"
                          >Ended</a
                        >
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          role="button"
                          @click="query_status('0')"
                          >Underway</a
                        >
                      </li>
                    </ul>
                  </div>
                </span>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <form action="#" @submit.prevent="to_page(1)" class="mb-3">
              <input
                class="form-control form-control-sm"
                type="text"
                placeholder="Keyword"
                v-model="keyword"
              />
            </form>
          </div>
        </div>
        <div v-if="contests">
          <ul class="list-group list-group-flush">
            <div
              v-for="contest in contests.data.results"
              :key="contest.id"
              class="d-flex align-items-center list-group-item"
            >
              <div class="flex-shrink-0">
                <img
                  height="40"
                  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTVDMzVBQTRBNjYzMTFFNEIxQzhCNjUwRDA0MEJFRDkiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTVDMzVBQTVBNjYzMTFFNEIxQzhCNjUwRDA0MEJFRDkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNUMzNUFBMkE2NjMxMUU0QjFDOEI2NTBEMDQwQkVEOSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNUMzNUFBM0E2NjMxMUU0QjFDOEI2NTBEMDQwQkVEOSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pi2kbbcAAAZuSURBVHja7FtvaBxF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"
                />
              </div>
              <div
                role="button"
                class="flex-grow-1 ms-3 d-flex justify-content-between p-1"
                @click="
                  $router.push({ name: 'Contest', params: { id: contest.id } })
                "
              >
                <span
                  >{{ contest.title }}
                  <i
                    class="bi bi-shield-lock"
                    v-if="contest.contest_type == 'Password Protected'"
                  ></i
                  ><small class="d-none d-sm-block"
                    >{{ get_time(contest.start_time) }}~{{
                      get_time(contest.end_time)
                    }}
                    <span
                      style="margin-left: 3px"
                      class="badge rounded-pill bg-info"
                      >{{ contest.rule_type }}</span
                    ></small
                  ></span
                >
                <div
                  v-html="check_time(contest.start_time, contest.end_time)"
                ></div>
              </div>
            </div>
            <div
              class="d-flex align-items-center list-group-item"
              v-if="contests.data.results.length == 0"
            >
              <p height="40" class="fs-5">No Contests</p>
            </div>
          </ul>
        </div>
        <div class="d-flex justify-content-center" v-else>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <Pagination
        @nav="to_page"
        :total="total"
        :page="page"
        :perpage="10"
        :dress_class="'card-body border-top'"
      />
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
export default {
  name: "Home",
  data() {
    return {
      contests: null,
      page: 1,
      total: 0,
      keyword: "",
      rule_type: "",
      status: "",
    };
  },
  created() {
    this.init();
  },
  components: {
    Pagination,
  },
  methods: {
    get_time(isoString) {
      return new Date(isoString).toLocaleString();
    },
    init() {
      this.page = this.$route.query.page;
      this.page == undefined
        ? (this.page = 1)
        : (this.page = parseInt(this.$route.query.page));

      this.keyword = this.$route.query.keyword;
      this.keyword == undefined
        ? (this.keyword = "")
        : (this.keyword = this.$route.query.keyword);

      this.rule_type = this.$route.query.rule_type;
      this.rule_type == undefined
        ? (this.rule_type = "")
        : (this.rule_type = this.$route.query.rule_type);

      this.status = this.$route.query.status;
      this.status == undefined
        ? (this.status = "")
        : (this.status = this.$route.query.status);

      let offset = (this.page - 1) * 10;
      this.$http
        .get(
          window.location.origin +
            "/api/contests?offset=" +
            offset +
            "&limit=10&keyword=" +
            this.keyword +
            "&rule_type=" +
            this.rule_type +
            "&status=" +
            this.status
        )
        .then((response) => {
          this.contests = response.data;
          this.total = response.data.data.total;
        });
    },
    check_time(start, end) {
      let time_now = new Date();
      if (time_now < new Date(start)) {
        return '<span class="badge bg-warning">Not Started</span>';
      } else if (time_now > new Date(end)) {
        return '<span class="badge bg-danger">Ended</span>';
      }
      return '<span class="badge bg-success">Underway</span>';
    },
    to_page(page) {
      let que = {};
      que.page = page;
      que.status = this.status ? this.status : undefined;
      que.keyword = this.keyword ? this.keyword : undefined;
      que.rule_type = this.rule_type ? this.rule_type : undefined;
      this.$router.push({ name: "ContestList", query: que });
      this.init();
    },
    query_rule_type(rule_type) {
      this.rule_type = rule_type;
      this.to_page(1);
    },
    query_status(status) {
      this.status = status;
      this.to_page(1);
    },
  },
};
</script>

<style scoped>
.md-display {
  display: none;
}
@media (min-width: 768px) {
  .md-display {
    display: block;
  }
}
</style>
