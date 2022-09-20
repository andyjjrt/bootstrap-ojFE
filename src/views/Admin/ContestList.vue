<template>
  <div>
    <div
      class="modal fade"
      id="NewContestModal"
      tabindex="-1"
      aria-labelledby="NewContestModalLabel"
      aria-hidden="true"
      ref="newcontest_modal"
    >
      <div
        class="modal-dialog modal-xl modal-fullscreen modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="NewContestModalLabel">New Contest</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-sm-12">
                <label class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="new_contest.title"
                />
              </div>
              <div class="col-sm-12">
                <label class="form-label">Description</label>
                <v-md-editor
                  v-model="new_contest.description"
                  :disabled-menus="[]"
                  :toolbar="toolbar"
                  height="400px"
                  @upload-image="handleUploadImage"
                  left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                />
              </div>
              <div class="col-sm-4">
                <DatePicker
                  v-model="new_contest.start_time"
                  mode="dateTime"
                  :popover="DatePicker_popover"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <label class="form-label">Start Time</label>
                    <input
                      class="form-control"
                      :value="inputValue"
                      v-on="inputEvents"
                    />
                  </template>
                </DatePicker>
              </div>
              <div class="col-sm-4">
                <DatePicker
                  v-model="new_contest.end_time"
                  mode="dateTime"
                  :popover="DatePicker_popover"
                >
                  <template v-slot="{ inputValue, inputEvents }">
                    <label class="form-label">End Time</label>
                    <input
                      class="form-control"
                      :value="inputValue"
                      v-on="inputEvents"
                    />
                  </template>
                </DatePicker>
              </div>
              <div class="col-sm-4">
                <label class="form-label">Password</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="new_contest.password"
                />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Contest Rule Type</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="rule_acm"
                      value="ACM"
                      v-model="new_contest.rule_type"
                    />
                    <label class="form-check-label" for="rule_acm">ACM</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="rule_oi"
                      value="OI"
                      v-model="new_contest.rule_type"
                    />
                    <label class="form-check-label" for="rule_oi">OI</label>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <label class="form-label"></label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="ContestRTR"
                    v-model="new_contest.real_time_rank"
                  />
                  <label class="form-check-label" for="ContestRTR"
                    >Real Time Rank</label
                  >
                </div>
              </div>
              <div class="col-sm-4">
                <label class="form-label"></label>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="Contest_visible"
                    v-model="new_contest.visible"
                  />
                  <label class="form-check-label" for="Contest_visible"
                    >Visible</label
                  >
                </div>
              </div>
              <div class="col-sm-6">
                <label class="form-label">Allowed IP Ranges</label>
                <div class="input-group mb-3">
                  <input
                    type="text"
                    class="form-control"
                    placeholder="IP"
                    v-model="add_ip"
                  />
                  <button
                    class="btn btn-outline-secondary"
                    type="button"
                    @click="addip"
                  >
                    Button
                  </button>
                </div>
              </div>
              <div class="col-sm-6">
                <p
                  v-for="(ips, i) in new_contest.allowed_ip_ranges"
                  :key="i"
                ></p>
                <div
                  class="alert alert-success alert-dismissible fade show"
                  role="alert"
                  v-for="ips in new_contest.allowed_ip_ranges"
                  :key="ips"
                >
                  {{ ips }}
                  <button
                    type="button"
                    class="btn-close"
                    aria-label="Close"
                    @click="
                      new_contest.allowed_ip_ranges.splice(
                        new_contest.allowed_ip_ranges.indexOf(ips),
                        1
                      )
                    "
                  ></button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="save_contest">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="DownloadModal"
      tabindex="-1"
      aria-labelledby="DownloadModalLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="DownloadModalLabel">
              Download Contest Submissions
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="form-check form-switch">
              <input
                class="form-check-input"
                type="checkbox"
                id="download_submissions"
                v-model="download.admin"
              />
              <label class="form-check-label" for="download_submissions"
                >Exclude admin submissions</label
              >
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-dismiss="modal"
              @click="dl_submission"
            >
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-body">
      <div class="d-flex justify-content-between">
        <h4>Contest List</h4>
        <input
          class="form-control w-50"
          type="text"
          placeholder="Keyword"
          v-model="keyword"
        />
      </div>
      <div class="table-responsive" v-if="contests">
        <table class="table text-nowrap">
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Title</th>
              <th scope="col">Rule Type</th>
              <th scope="col">Contest Type</th>
              <th scope="col">Status</th>
              <th scope="col">Visiable</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="i in contests.data.results" :key="i.id">
              <td>{{ i.id }}</td>
              <td>{{ i.title }}</td>
              <td>
                <span class="badge bg-info">{{ i.rule_type }}</span>
              </td>
              <td><div v-html="contest_type_tag(i.contest_type)" /></td>
              <td><div v-html="status_tag(i.status)" /></td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    v-model="i.visible"
                    @change="visible(i)"
                  />
                </div>
              </td>
              <td>
                <span data-bs-toggle="modal" data-bs-target="#DownloadModal">
                  <button
                    class="btn btn-sm btn-outline-dark"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Download submissions"
                    @click="download.id = i.id"
                  >
                    <i class="bi bi-download"></i>
                  </button>
                </span>
                &nbsp;
                <button
                  class="btn btn-sm btn-outline-dark"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Edit"
                  @click="goto(i.id)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>
              </td>
            </tr>
            <tr v-if="contests.data.results.length == 0">
              <td colspan="7" class="text-center">No Data</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="d-flex justify-content-center pt-4" v-else>
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <br />
      <div class="row">
        <div class="col-sm mb-3">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#NewContestModal"
          >
            <i class="bi bi-plus"></i> Create
          </button>
        </div>
        <div class="col-sm mb-3">
          <Pagination
            @nav="to_page"
            :total="total"
            :page="page"
            :perpage="10"
            :dress_class="'float-end'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DatePicker from "v-calendar/lib/components/date-picker.umd";
import Modal from "bootstrap/js/dist/modal.js";
import Tooltip from "bootstrap/js/dist/tooltip.js";

import Pagination from "@/components/Pagination.vue";

export default {
  name: "ContestList",
  data() {
    return {
      NewContestModal: null,
      contests: null,
      total: null,
      new_contest: {
        title: "",
        description: "",
        rule_type: "ACM",
        start_time: new Date(),
        end_time: new Date(),
        password: "",
        real_time_rank: true,
        visible: true,
        allowed_ip_ranges: [],
      },
      toolbar: {
        Katex: {
          title: "Katex",
          icon: "v-md-icon-code",
          action(editor) {
            editor.insert(function (selected) {
              const prefix = "$";
              const suffix = "$";
              const placeholder = "Katex";
              const content = selected || placeholder;

              return {
                text: `${prefix}${content}${suffix}`,
                selected: content,
              };
            });
          },
        },
      },
      DatePicker_popover: {
        placement: "top",
      },
      add_ip: "",
      page: 1,
      keyword: "",
      download: {
        id: "",
        admin: true,
      },
    };
  },
  mounted() {
    this.NewContestModal = new Modal(this.$refs.newcontest_modal);
    this.init();
  },
  components: {
    DatePicker,
    Pagination,
  },
  methods: {
    init() {
      let offset = (this.page - 1) * 10;
      this.$http
        .get(
          window.location.origin +
            "/api/admin/contest?keyword=" +
            this.keyword +
            "&offset=" +
            offset +
            "&limit=10"
        )
        .then((response) => {
          this.contests = response.data;
          this.total = response.data.data.total;
        })
        .then(() => {
          Array.from(
            document.querySelectorAll('button[data-bs-toggle="tooltip"]')
          ).forEach((tooltipNode) => new Tooltip(tooltipNode));
        });
    },
    to_page(page) {
      this.page = page;
      this.init();
    },
    handleUploadImage(event, insertImage, files) {
      // Get the files and upload them to the file server, then insert the corresponding content into the editor
      let formData = new FormData();
      formData.append("original_filename", files[0].name);
      formData.append("image", files[0]);
      this.$http
        .post(window.location.origin + "/api/admin/upload_image", formData)
        .then((response) => {
          if (response.data.success) {
            insertImage({
              url: response.data.file_path,
              desc: files[0].name,
              width: "auto",
              height: "auto",
            });
          }
        });
      // Here is just an example
    },
    save_contest() {
      if (this.new_contest.password == "") {
        this.new_contest.contest_type = "Public";
      } else {
        this.new_contest.contest_type = "Password Protected";
      }
      this.new_contest.start_time = new Date(
        this.new_contest.start_time
      ).toISOString();
      this.new_contest.end_time = new Date(
        this.new_contest.end_time
      ).toISOString();
      this.$http
        .post(window.location.origin + "/api/admin/contest", this.new_contest)
        .then((response) => {
          if (!response.data.error) {
            this.NewContestModal.toggle();
            this.$success("Succeed");
            this.init();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    addip() {
      if (this.add_ip == "") {
        this.$error("Please enter IP");
        return;
      }
      if (this.new_contest.allowed_ip_ranges.indexOf(this.add_ip) != -1) {
        this.$error("Duplicated IP");
        return;
      }
      this.new_contest.allowed_ip_ranges.push(this.add_ip);
      this.add_ip = "";
    },
    visible(con) {
      this.$http
        .put(window.location.origin + "/api/admin/contest", con)
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.init();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    goto(id) {
      this.$router.push({ path: "/admin/contest/" + id });
    },
    contest_type_tag(type) {
      if (type == "Public") {
        return '<span class="badge bg-success">Public</span>';
      } else if (type == "Password Protected") {
        return '<span class="badge bg-primary">	Password Protected</span>';
      }
    },
    status_tag(status) {
      if (status == 1) {
        return '<span class="badge bg-warning">Not Started</span>';
      } else if (status == -1) {
        return '<span class="badge bg-danger">Ended</span>';
      }
      return '<span class="badge bg-success">Underway</span>';
    },
    dl_submission() {
      let url =
        "/api/admin/download_submissions?contest_id=" +
        this.download.id +
        "&exclude_admin=";
      if (this.download.admin) {
        url += 1;
      } else {
        url += 0;
      }
      // eslint-disable-next-line no-unused-vars
      new Promise((resolve, reject) => {
        this.$http
          .get(url, { responseType: "blob" })
          .then((resp) => {
            let headers = resp.headers;
            if (headers["content-type"].indexOf("json") !== -1) {
              let fr = new window.FileReader();
              if (resp.data.error) {
                this.$error(resp.data.error);
              } else {
                this.$error("Invalid file format");
              }
              fr.onload = (event) => {
                let data = JSON.parse(event.target.result);
                if (data.error) {
                  this.$error(data.data);
                } else {
                  this.$error("Invalid file format");
                }
              };
              let b = new window.Blob([resp.data], {
                type: "application/json",
              });
              fr.readAsText(b);
              return;
            }
            let link = document.createElement("a");
            link.href = window.URL.createObjectURL(
              new window.Blob([resp.data], { type: headers["content-type"] })
            );
            link.download = (headers["content-disposition"] || "").split(
              "filename="
            )[1];
            document.body.appendChild(link);
            link.click();
            link.remove();
            resolve();
          })
          .catch(() => {});
      });
    },
  },
  watch: {
    keyword() {
      this.page = 1;
      this.init();
    },
  },
  beforeRouteLeave(to, from, next) {
    this.NewContestModal.hide();
    Array.from(document.querySelectorAll("div.tooltip")).forEach(
      (tooltipNode) => {
        tooltipNode.remove();
      }
    );
    next();
  },
};
</script>

<style></style>
