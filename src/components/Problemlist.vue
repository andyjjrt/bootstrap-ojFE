<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div class="row">
          <div class="col-sm-8 d-flex justify-content-between">
            <div class="card-title fs-4">Problems</div>
            <div class="dropdown" v-if="$route.params.id == undefined">
              <button
                class="btn btn-light text-dark border dropdown-toggle btn-sm"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {{ difficulty == "" ? "Difficulty" : difficulty }}
              </button>
              <ul
                class="dropdown-menu dropdown-menu-end"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a
                    class="dropdown-item"
                    role="button"
                    @click="query_difficulty('')"
                    >All</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    role="button"
                    @click="query_difficulty('Low')"
                    >Low</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    role="button"
                    @click="query_difficulty('Mid')"
                    >Mid</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    role="button"
                    @click="query_difficulty('High')"
                    >High</a
                  >
                </li>
              </ul>
            </div>
          </div>
          <div class="col-sm-4" v-if="$route.params.id == undefined">
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
        <template v-if="problems">
          <div class="table-responsive" v-if="!problems.error">
            <table class="table text-nowrap">
              <thead>
                <tr class="d-flex">
                  <th
                    scope="col"
                    class="col-2 d-none d-sm-block"
                    style="border-left: 5px #ffffff solid"
                  >
                    #
                  </th>
                  <th scope="col" class="col-6 d-none d-sm-block">Problem</th>
                  <th scope="col" class="col-2 d-none d-sm-block">Level</th>
                  <th scope="col" class="col-2 d-none d-sm-block">AC rate</th>
                  <th
                    scope="col"
                    class="col d-block d-sm-none"
                    style="border-left: 5px #ffffff solid"
                  >
                    <span>Problem</span>
                    <span class="float-end">Level</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="d-flex"
                  role="button"
                  v-for="problem in problems.data"
                  :key="problem.id"
                  @click="go_problem(problem._id)"
                >
                  <td class="text-truncate col-2 d-none d-sm-block">
                    {{ problem._id }}
                  </td>
                  <td class="text-truncate col-6 d-none d-sm-block">
                    <span v-html="solved(problem)"></span> {{ problem.title }}
                  </td>
                  <td
                    class="col-2 d-none d-sm-block"
                    v-html="difficulty_tag(problem.difficulty)"
                  ></td>
                  <td class="col-2 d-none d-sm-block">
                    {{
                      ac_rate(
                        problem.accepted_number,
                        problem.submission_number
                      )
                    }}
                  </td>
                  <td class="col-12 d-block d-sm-none">
                    <span class="text-truncate"
                      ><span v-html="solved(problem)"></span>
                      {{ problem.title }}</span
                    >
                    <span
                      class="float-end"
                      v-html="difficulty_tag(problem.difficulty)"
                    ></span>
                  </td>
                </tr>
                <tr v-if="problems.data.length == 0">
                  <td colspan="4" class="text-center">No Data</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <div class="alert alert-danger" role="alert">
              {{ problems.data }}
            </div>
          </div>
        </template>
        <div class="d-flex justify-content-center" v-else>
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <template v-if="$route.params.id == undefined && problems">
        <Pagination
          @nav="to_page"
          :total="total"
          :page="page"
          :perpage="20"
          :dress_class="'card-body border-top'"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
export default {
  name: "ProblemList",
  props: {
    select_tag: String,
  },
  data() {
    return {
      problems: null,
      total: 0,
      page: 1,
      url: "/api/problem",
      tag: "",
      difficulty: "",
      keyword: "",
    };
  },
  components: {
    Pagination,
  },
  created() {
    this.get_problem();
  },
  methods: {
    get_problem() {
      if (this.problems) {
        window.scrollTo(0, 0);
      }
      this.problems = null;

      this.page = this.$route.query.page;
      this.page == undefined
        ? (this.page = 1)
        : (this.page = parseInt(this.$route.query.page));

      this.tag = this.$route.query.tag;
      this.tag == undefined
        ? (this.tag = "")
        : (this.tag = this.$route.query.tag);

      this.keyword = this.$route.query.keyword;
      this.keyword == undefined
        ? (this.keyword = "")
        : (this.keyword = this.$route.query.keyword);

      this.difficulty = this.$route.query.difficulty;
      this.difficulty == undefined
        ? (this.difficulty = "")
        : (this.difficulty = this.$route.query.difficulty);

      let tmp = "?";
      if (this.$route.params.id != undefined) {
        this.url = "/api/contest/problem";
        tmp += "contest_id=" + this.$route.params.id;
      } else {
        tmp +=
          "offset=" +
          (this.page - 1) * 20 +
          "&limit=20&tag=" +
          this.tag +
          "&keyword=" +
          this.keyword +
          "&difficulty=" +
          this.difficulty;
      }
      this.$http
        .get(window.location.origin + this.url + tmp)
        .then((response) => {
          this.problems = response.data;
          if (this.$route.params.id == undefined) {
            this.total = response.data.data.total;
            this.problems.data = this.problems.data.results;
          }
        });
    },
    to_page(page) {
      if (this.$route.params.id == undefined) {
        let que = {};
        que.page = page;
        que.tag = this.tag ? this.tag : undefined;
        que.keyword = this.keyword ? this.keyword : undefined;
        que.difficulty = this.difficulty ? this.difficulty : undefined;
        this.$router.push({ path: "problem", query: que });
      }
      this.page = page;
      this.get_problem();
    },
    difficulty_tag(difficulty) {
      if (difficulty == "High") {
        return '<span class="badge bg-warning">High</span>';
      } else if (difficulty == "Mid") {
        return '<span class="badge bg-primary">Mid</span>';
      }
      return '<span class="badge bg-success">Low</span>';
    },
    ac_rate(ac, total) {
      if (total == 0) {
        return "0.00%";
      } else if (ac > total) {
        return "100%";
      }
      return ((parseInt(ac) * 100) / parseInt(total)).toFixed(2) + "%";
    },
    select_tag_func(name) {
      if (this.select_tag == name) {
        this.select_tag = "";
      } else {
        this.select_tag = name;
      }
      this.$router.replace({ path: "problem", query: { page: 1 } });
      this.get_problem();
    },
    go_problem(id) {
      if (this.$route.params.id == undefined) {
        this.$router.push({ name: "Problem", params: { pid: id } });
      } else {
        this.$router.push({ name: "Contest_Problem", params: { pid: id } });
      }
    },
    solved(problem) {
      if (problem.my_status || problem.my_status == 0) {
        if (problem.my_status == 0) {
          return '<i class="bi bi-check-square text-success"></i>';
        } else {
          return '<i class="bi bi-x-square text-danger"></i>';
        }
      }
      if (this.$store.state.profile.data) {
        if (this.$store.state.profile.data.acm_problems_status.problems) {
          if (
            this.$store.state.profile.data.acm_problems_status.problems[
              problem.id
            ]
          ) {
            if (
              this.$store.state.profile.data.acm_problems_status.problems[
                problem.id
              ].status == 0
            ) {
              return '<i class="bi bi-check-square text-success"></i>';
            } else {
              return '<i class="bi bi-x-square text-danger"></i>';
            }
          }
        }
        if (this.$store.state.profile.data.oi_problems_status.problems) {
          if (
            this.$store.state.profile.data.oi_problems_status.problems[
              problem.id
            ]
          ) {
            if (
              this.$store.state.profile.data.oi_problems_status.problems[
                problem.id
              ].status == 0
            ) {
              return '<i class="bi bi-check-square text-success"></i>';
            } else {
              return '<i class="bi bi-x-square text-danger"></i>';
            }
          }
        }
      }
      return '<i class="bi bi-square text-white"></i>';
    },
    query_difficulty(difficulty) {
      this.difficulty = difficulty;
      this.to_page(1);
    },
  },
  watch: {
    select_tag() {
      this.get_problem();
    },
  },
};
</script>

<style scoped></style>
