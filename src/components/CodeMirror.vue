<template>
  <div>
    <div class="row">
      <div class="d-flex justify-content-between mb-3">
        <select class="form-select w-50" v-model="code_language">
          <option
            :value="language"
            v-for="language in problem.data.languages"
            :key="language"
          >
            {{ language }}
          </option>
        </select>
        <div>
          <button
            type="button"
            class="btn btn-light border text-black"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Upload file"
            @click="onUploadFile"
          >
            <i class="bi bi-cloud-arrow-up"></i>
          </button>
          &nbsp;
          <button
            type="button"
            class="btn btn-light border text-black"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Reset"
            @click="reset"
          >
            <i class="bi bi-arrow-repeat"></i>
          </button>
        </div>
      </div>
    </div>
    <codemirror v-model="code" :options="cm_options" />
    <div class="p-2">
      <div>
        <span v-if="status_indicater">
          <span
            role="button"
            @click="
              $router.push({
                name: 'Submission',
                params: { submission_id: submission_id_pass },
              })
            "
            class="fs-4"
            v-html="status_indicater"
            v-if="submission_id_pass != '' && on_submit == false"
          />
          <span class="fs-4" v-html="status_indicater" v-else />
        </span>
        <button
          class="btn btn-warning float-end"
          :class="{ disabled: on_submit }"
          type="button"
          @click="submit"
        >
          Submit
        </button>
      </div>
    </div>
    <input
      type="file"
      id="file-uploader"
      style="display: none"
      @change="onUploadFileDone"
    />
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/go/go.js";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/rust/rust.js";
import "codemirror/theme/solarized.css";
import storage from "@/util/storage.js";

import Tooltip from "bootstrap/js/dist/tooltip.js";

export default {
  name: "code_space",
  props: {
    problem: Object,
    type: String,
  },
  components: {
    codemirror,
  },
  data() {
    return {
      code: "",
      code_language: "",
      on_submit: false,
      status_indicater: "",
      submission_id_pass: "",
      ticker: null,
      cm_options: {
        theme: "solarized",
        lineNumbers: true,
        mode: "",
        tabSize: 4,
      },
      current_route: null,
    };
  },
  created() {
    this.current_route = this.$route;
    let problemCode = storage.get(
      this.buildProblemCodeKey(this.$route.params.pid, this.$route.params.id)
    );
    if (problemCode) {
      this.code = problemCode.code;
      this.code_language = problemCode.language;
    }
    if (this.problem.data.my_status == 0) {
      this.status_indicater = '<span class="badge bg-success">Solved</span>';
    }

    if (this.code != "") {
      return;
    }

    this.code_language = this.problem.data.languages[0];
    if (this.problem.data.template[this.code_language]) {
      this.code = this.problem.data.template[this.code_language];
    }
  },
  mounted() {
    Array.from(
      document.querySelectorAll('button[data-bs-toggle="tooltip"]')
    ).forEach((tooltipNode) => new Tooltip(tooltipNode));
  },
  beforeDestroy() {
    storage.set(
      this.buildProblemCodeKey(
        this.current_route.params.pid,
        this.current_route.params.id
      ),
      {
        code: this.code,
        language: this.code_language,
      }
    );
  },
  methods: {
    submit() {
      if (this.code == "" || this.code == undefined) {
        this.$error("Code can not be empty");
        return;
      }
      this.on_submit = true;
      this.status_indicater = "";
      let param = {
        code: this.code,
        language: this.code_language,
        problem_id: this.problem.data.id,
      };
      if (this.type == "contest") {
        param.contest_id = this.problem.data.contest;
      }
      this.$http
        .post(window.location.origin + "/api/submission", param)
        .then((res) => {
          if (res.data.error) {
            this.status_indicater =
              '<span class="badge bg-danger">' + res.data.data + "</span>";
            this.on_submit = false;
          } else {
            let vm = this;
            this.submission_id_pass = res.data.data.submission_id;
            this.status_indicater =
              '<span class="badge bg-' +
              this.$store.state.status_list[9].type +
              '">' +
              this.$store.state.status_list[9].name +
              "</span>";
            this.ticker = window.setInterval(function () {
              vm.get_submit_status(res.data.data.submission_id);
            }, 1000);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
    get_submit_status(id) {
      this.$http
        .get(window.location.origin + "/api/submission?id=" + id)
        .then((response) => {
          this.status_indicater =
            '<span class="badge bg-' +
            this.$store.state.status_list[response.data.data.result].type +
            '">' +
            this.$store.state.status_list[response.data.data.result].name +
            "</span>";
          if (
            response.data.data.result != 7 &&
            response.data.data.result != 9
          ) {
            window.clearInterval(this.ticker);
            this.$http
              .get(window.location.origin + "/api/profile")
              .then((response) => {
                this.$store.commit("get_profile", response.data);
                this.on_submit = false;
              });
          }
        });
    },
    get_mime(language) {
      const languageDetail = this.$store.state.languages.data.languages.find(lang => lang.name === language);
      this.cm_options.mode = languageDetail ? languageDetail.content_type : "text";
    },
    buildProblemCodeKey(problemID, contestID = null) {
      if (contestID) {
        return `problemCode_${contestID}_${problemID}`;
      }
      return `problemCode_NaN_${problemID}`;
    },
    reset() {
      this.code_language = this.problem.data.languages[0];
      this.code = "";
      if (this.problem.data.template[this.code_language]) {
        this.code = this.problem.data.template[this.code_language];
      }
    },
    change_language(lan) {
      this.code_language = lan;
    },
    onUploadFile() {
      document.getElementById("file-uploader").click();
    },
    onUploadFileDone() {
      let f = document.getElementById("file-uploader").files[0];
      let fileReader = new window.FileReader();
      let self = this;
      fileReader.onload = function (e) {
        var text = e.target.result;
        self.code = text;
        document.getElementById("file-uploader").value = "";
      };
      fileReader.readAsText(f, "UTF-8");
    },
  },
  watch: {
    code_language(val) {
      this.get_mime(val);
    },
  },
};
</script>
