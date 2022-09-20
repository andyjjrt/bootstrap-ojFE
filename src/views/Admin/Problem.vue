<template>
  <div>
    <div
      class="modal fade"
      id="ProblemModal"
      tabindex="-1"
      aria-labelledby="ProblemModalLabel"
      aria-hidden="true"
      ref="problem_modal"
    >
      <div
        class="modal-dialog modal-xl modal-fullscreen modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ProblemModalLabel">Problem</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body" v-if="languages">
            <div class="row g-3">
              <div class="col-sm-3">
                <label class="form-label">Display ID</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="open_problem._id"
                />
              </div>
              <div class="col-sm-9">
                <label class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="open_problem.title"
                />
              </div>
              <div class="col-sm-12">
                <label class="form-label">Description</label>
                <v-md-editor
                  v-model="open_problem.description"
                  :disabled-menus="[]"
                  :toolbar="toolbar"
                  height="400px"
                  @upload-image="handleUploadImage"
                  left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                />
              </div>
              <div class="col-sm-12">
                <label class="form-label">Input Description</label>
                <v-md-editor
                  v-model="open_problem.input_description"
                  :disabled-menus="[]"
                  :toolbar="toolbar"
                  height="400px"
                  @upload-image="handleUploadImage"
                  left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                />
              </div>
              <div class="col-sm-12">
                <label class="form-label">Output Description</label>
                <v-md-editor
                  v-model="open_problem.output_description"
                  :disabled-menus="[]"
                  :toolbar="toolbar"
                  height="400px"
                  @upload-image="handleUploadImage"
                  left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Time Limit(ms)</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="open_problem.time_limit"
                />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Memory Limit(MB)</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="open_problem.memory_limit"
                />
              </div>
              <div class="col-sm-4">
                <label class="form-label">Difficulty</label>
                <select class="form-select" v-model="open_problem.difficulty">
                  <option value="Low">Low</option>
                  <option value="Mid">Mid</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div class="col-sm-2">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="Problem_visible"
                    v-model="open_problem.visible"
                  />
                  <label class="form-check-label" for="Problem_visible"
                    >Visible</label
                  >
                </div>
              </div>
              <div class="col-sm-2">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="Problem_share"
                    v-model="open_problem.share_submission"
                  />
                  <label class="form-check-label" for="Problem_share"
                    >Share</label
                  >
                </div>
              </div>
              <div class="col-sm-8">
                <label class="form-label">Languages</label>
                <div>
                  <div
                    class="form-check form-check-inline"
                    v-for="lang in languages.data.languages"
                    :key="lang.name"
                  >
                    <input
                      class="form-check-input"
                      type="checkbox"
                      :value="lang.name"
                      :id="lang.name"
                      v-model="open_problem.languages"
                      @change="change_problem_language"
                    />
                    <label class="form-check-label" :for="lang.name">
                      {{ lang.name }}
                    </label>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <label class="form-label">New Tag</label>
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    list="tagOptions"
                    placeholder="New Tag"
                    v-model="open_problem_variables.tmp_tag"
                  />
                  <datalist id="tagOptions" v-if="tags">
                    <option
                      :value="tag.name"
                      v-for="tag in tags.data"
                      :key="tag.id"
                    />
                  </datalist>
                  <button
                    class="btn btn-outline-primary"
                    type="button"
                    @click="create_tag"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div class="col-sm-8">
                <label class="form-label">Tags</label>
                <div class="d-flex flex-wrap">
                  <div
                    v-for="tag in open_problem.tags"
                    :key="tag"
                    style="padding-right: 2px"
                  >
                    <span class="badge bg-success"
                      >{{ tag
                      }}<button
                        type="button"
                        class="btn-close btn-close-white"
                        aria-label="Close"
                        @click="
                          open_problem.tags.splice(
                            open_problem.tags.indexOf(tag),
                            1
                          )
                        "
                      ></button
                    ></span>
                  </div>
                </div>
              </div>
              <div class="col-sm-12">
                <div
                  v-for="sample in open_problem.samples.length"
                  :key="sample.input"
                >
                  <div class="card card-body">
                    <div class="d-flex justify-content-between">
                      <h6 class="fw-bold">Sample{{ sample }}</h6>
                      <button
                        class="btn btn-warning"
                        @click="open_problem.samples.splice(sample - 1, 1)"
                      >
                        Delete
                      </button>
                    </div>
                    <div class="row">
                      <div class="col">
                        <label class="form-label">Input sample</label>
                        <textarea
                          class="form-control font-monospace"
                          v-model="open_problem.samples[sample - 1].input"
                          rows="5"
                        />
                      </div>
                      <div class="col">
                        <label class="form-label">Output sample</label>
                        <textarea
                          class="form-control font-monospace"
                          v-model="open_problem.samples[sample - 1].output"
                          rows="5"
                        />
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
                <div class="d-grid gap-2">
                  <button
                    class="btn btn-primary"
                    type="button"
                    @click="
                      open_problem.samples.push({ input: '', output: '' })
                    "
                  >
                    Add Sample
                  </button>
                </div>
              </div>
              <div class="col-sm-12">
                <label class="form-label">Hint</label>
                <v-md-editor
                  v-model="open_problem.hint"
                  :disabled-menus="[]"
                  :toolbar="toolbar"
                  height="400px"
                  @upload-image="handleUploadImage"
                  left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                />
              </div>
              <div class="col-sm-12">
                <label class="form-label">Code Templates</label>
                <div
                  v-for="(v, k) in open_problem.template"
                  :key="'template' + k"
                >
                  <template v-if="v.vis">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        v-model="v.checked"
                        :id="'template' + k"
                      />
                      <label class="form-check-label" :for="'template' + k">
                        {{ k }}
                      </label>
                    </div>
                    <codemirror
                      v-model="v.code"
                      :options="v.option"
                      v-if="v.checked"
                    />
                  </template>
                </div>
              </div>
              <div class="col-sm-12">
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="spjswitch"
                    v-model="open_problem.spj"
                    @click="switch_spj"
                  />
                  <label class="form-check-label" for="spjswitch"
                    >Use special judge</label
                  >
                </div>
              </div>
              <div class="col-sm-12" v-if="open_problem.spj">
                <div class="card">
                  <div class="card-header">
                    <div class="d-flex justify-content-between">
                      <div>
                        <div
                          class="form-check form-check-inline"
                          v-for="i in languages.data.spj_languages.length"
                          :key="i"
                        >
                          <input
                            class="form-check-input"
                            type="radio"
                            :id="'inlineRadio' + i"
                            :value="languages.data.spj_languages[i - 1].name"
                            v-model="open_problem.spj_language"
                          />
                          <label
                            class="form-check-label"
                            :for="'inlineRadio' + i"
                            >{{
                              languages.data.spj_languages[i - 1].name
                            }}</label
                          >
                        </div>
                      </div>
                      <button
                        class="btn btn-primary btn-sm"
                        @click="compile_spj"
                      >
                        <i class="bi bi-command"></i> Compile
                      </button>
                    </div>
                  </div>
                  <div class="card-body">
                    <template v-if="open_problem_variables.spj_response">
                      <div
                        class="alert alert-danger"
                        role="alert"
                        v-if="open_problem_variables.spj_response.error"
                      >
                        {{ open_problem_variables.spj_response.data }}
                      </div>
                    </template>
                    <codemirror
                      :options="open_problem_spj[open_problem.spj_language].opt"
                      v-model="open_problem.spj_code"
                    />
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <label class="form-label">Type</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="type_acm"
                      value="ACM"
                      v-model="open_problem.rule_type"
                      :disabled="
                        this.$route.params.manage_contest_id != undefined
                      "
                    />
                    <label class="form-check-label" for="type_acm">ACM</label>
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="type_oi"
                      value="OI"
                      v-model="open_problem.rule_type"
                      :disabled="
                        this.$route.params.manage_contest_id != undefined
                      "
                    />
                    <label class="form-check-label" for="type_oi">OI</label>
                  </div>
                </div>
              </div>
              <div class="col-sm-4">
                <label class="form-label">IO Mode</label>
                <div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="mode_std"
                      value="Standard IO"
                      v-model="open_problem.io_mode.io_mode"
                    />
                    <label class="form-check-label" for="mode_std"
                      >Standard IO</label
                    >
                  </div>
                  <div class="form-check form-check-inline">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="mode_file"
                      value="File IO"
                      v-model="open_problem.io_mode.io_mode"
                    />
                    <label class="form-check-label" for="mode_file"
                      >File IO</label
                    >
                  </div>
                </div>
              </div>
              <div class="col-sm-2">
                <div v-if="open_problem.io_mode.io_mode == 'File IO'">
                  <label class="form-label">Input file</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="open_problem.io_mode.input"
                  />
                </div>
              </div>
              <div class="col-sm-2">
                <div v-if="open_problem.io_mode.io_mode == 'File IO'">
                  <label class="form-label">Output file</label>
                  <input
                    type="text"
                    class="form-control"
                    v-model="open_problem.io_mode.output"
                  />
                </div>
              </div>
              <div class="col-sm-12">
                <label class="btn btn-primary">
                  <input
                    style="display: none"
                    type="file"
                    @change="upload_event"
                    :disabled="upload_testcase_btn_loading"
                  />
                  Upload Testcase
                </label>
              </div>
              <div class="col-sm-12">
                <table class="table">
                  <thead>
                    <tr>
                      <th scope="col">Input</th>
                      <th scope="col">Output</th>
                      <th scope="col">Score</th>
                    </tr>
                  </thead>
                  <tbody v-if="open_problem.test_case_id == ''">
                    <tr>
                      <td colspan="3" class="text-center">No Data</td>
                    </tr>
                  </tbody>
                  <tbody v-else>
                    <tr
                      v-for="testcase in open_problem.test_case_score"
                      :key="testcase.input_name"
                    >
                      <td class="col-3">{{ testcase.input_name }}</td>
                      <td class="col-3">{{ testcase.output_name }}</td>
                      <td class="col-3">
                        <input
                          class="form-control form-control-sm"
                          type="text"
                          v-model="testcase.score"
                          :disabled="open_problem.rule_type == 'ACM'"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="col-sm-12">
                <label class="form-label">Source</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="open_problem.source"
                />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-primary" @click="save">Save</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="ProblemdeleteModal"
      tabindex="-1"
      aria-labelledby="ProblemdeleteModalLabel"
      aria-hidden="true"
      ref="delete_modal"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ProblemdeleteModalLabel">Confirm</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete this problem?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" data-bs-dismiss="modal">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" @click="delete_id">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="AddPublicProblemModal"
      tabindex="-1"
      aria-labelledby="AddPublicProblemModalLabel"
      aria-hidden="true"
      ref="add_public_modal"
    >
      <div class="modal-dialog modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="AddPublicProblemModalLabel">
              Add Problem from Public
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <input
              class="form-control"
              type="text"
              placeholder="Keyword"
              v-model="add_from_public_list.keyword"
            />
          </div>
          <div class="modal-body" style="max-height: 280px">
            <table
              class="table text-nowrap table-hover"
              v-if="contest.public_problems"
            >
              <thead>
                <tr>
                  <th class="col-4">#</th>
                  <th class="col-4">Display ID</th>
                  <th class="col-4">Title</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in contest.public_problems.data.results"
                  :key="p.id"
                  role="button"
                  @click="contest.select_import = p"
                  :class="{ 'table-primary': contest.select_import == p }"
                  class="text-black"
                >
                  <td class="col-4">{{ p.id }}</td>
                  <td class="col-4">{{ p._id }}</td>
                  <td class="col-4">{{ p.title }}</td>
                </tr>
                <tr v-if="contest.public_problems.data.results.length == 0">
                  <td colspan="7" class="text-center">No Data</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-body">
            <Pagination
              @nav="make_public_topage"
              :total="add_from_public_list.total"
              :page="add_from_public_list.page"
              :perpage="10"
              :dress_class="'float-end mb-3'"
            />
            <div v-if="contest.select_import">
              <div class="mb-3">
                <label class="form-label"
                  >Display ID for the contest problem</label
                >
                <input
                  type="text"
                  class="form-control"
                  placeholder="Display ID"
                  v-model="contest.display_id"
                />
              </div>
              <button
                type="button"
                class="btn btn-primary float-end"
                @click="add_problem_from_public"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="MakePublicProblemModal"
      tabindex="-1"
      aria-labelledby="MakePublicProblemModalLabel"
      aria-hidden="true"
      ref="make_public_modal"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="MakePublicProblemModalLabel">
              Make Problem Public
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div>
              <div class="mb-3">
                <label class="form-label">Display ID for the problem</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Display ID"
                  v-model="make_public_problem.display_id"
                />
              </div>
              <button
                type="button"
                class="btn btn-primary float-end"
                @click="make_problem_public"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="card card-body">
      <div class="d-flex justify-content-between">
        <h4>Problem</h4>
        <input
          class="form-control w-50"
          type="text"
          placeholder="Keyword"
          v-model="keyword"
        />
      </div>
      <div class="table-responsive" v-if="problems">
        <table class="table text-nowrap">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Display ID</th>
              <th scope="col">Title</th>
              <th scope="col">Author</th>
              <th scope="col">Create Time</th>
              <th scope="col">Visiable</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="problem in problems.data.results" :key="problem.id">
              <td>{{ problem.id }}</td>
              <td>{{ problem._id }}</td>
              <td>{{ problem.title }}</td>
              <td>{{ problem.created_by.username }}</td>
              <td>{{ new Date(problem.create_time).toLocaleString() }}</td>
              <td>
                <div class="form-check form-switch">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    v-model="problem.visible"
                    @change="visible(problem)"
                  />
                </div>
              </td>
              <td>
                <span
                  data-bs-toggle="modal"
                  data-bs-target="#MakePublicProblemModal"
                >
                  <button
                    class="btn btn-sm btn-outline-dark"
                    @click="make_public_problem.problem = problem"
                    v-if="$route.params.manage_contest_id != undefined"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Make Public"
                  >
                    <i class="bi bi-upload"></i>
                  </button>
                </span>
                &nbsp;
                <span data-bs-toggle="modal" data-bs-target="#ProblemModal">
                  <button
                    class="btn btn-sm btn-outline-dark"
                    @click="edit(problem)"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Edit"
                  >
                    <i class="bi bi-pencil-square"></i>
                  </button>
                </span>
                &nbsp;
                <button
                  class="btn btn-sm btn-outline-primary"
                  @click="downloadTestCase(problem.id)"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Download testcase"
                >
                  <i class="bi bi-cloud-arrow-down"></i>
                </button>
                &nbsp;
                <span
                  data-bs-toggle="modal"
                  data-bs-target="#ProblemdeleteModal"
                >
                  <button
                    class="btn btn-sm btn-danger"
                    @click="open_problem = problem"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Delete"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </span>
              </td>
            </tr>
            <tr v-if="problems.data.results.length == 0">
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
        <div class="col-md mb-3">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#ProblemModal"
            @click="create_new"
          >
            <i class="bi bi-plus"></i> Create</button
          >&nbsp;
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#AddPublicProblemModal"
            @click="create_new"
            v-if="$route.params.manage_contest_id != undefined"
          >
            <i class="bi bi-plus"></i> Add Public Problem
          </button>
        </div>
        <div class="col-md mb-3">
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
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/python/python.js";
import "codemirror/mode/go/go.js";
import "codemirror/theme/solarized.css";

import Tooltip from "bootstrap/js/dist/tooltip.js";
import Modal from "bootstrap/js/dist/modal.js";

import Pagination from "@/components/Pagination.vue";

export default {
  name: "EditProblem",
  data() {
    return {
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
      problems: null,
      contest: {
        public_problems: null,
        select_import: null,
        display_id: "",
      },
      make_public_problem: {
        display_id: "",
        problem: null,
      },
      total: 0,
      open_problem: {
        title: "",
        _id: "",
        description: "",
        input_description: "",
        output_description: "",
        time_limit: "1000",
        memory_limit: "256",
        difficulty: "Low",
        share_submission: false,
        visible: true,
        languages: [],
        tags: [],
        samples: [{ input: "", output: "" }],
        hint: "",
        template: {},
        spj: false,
        spj_language: "",
        spj_code: "",
        spj_compile_ok: false,
        rule_type: "ACM",
        io_mode: {
          io_mode: "Standard IO",
          input: "input.txt",
          output: "output.txt",
        },
        test_case_id: "",
        test_case_score: [],
        source: "",
      },
      open_problem_variables: {
        tmp_tag: "",
        templates: [],
        options: [],
        testCaseUploaded: false,
        spj_response: null,
      },
      open_problem_spj: {},
      mode: "create",
      ProblemModal: null,
      DeleteModal: null,
      AddPublicProblemModal: null,
      MakePublicProblemModal: null,
      page: 1,
      url: "/api/admin/problem",
      keyword: "",
      tags: null,
      add_from_public_list: {
        page: 1,
        total: 0,
        keyword: "",
      },
      upload_testcase_btn_loading: false,
    };
  },
  props: {
    contest_rule: String,
  },
  components: {
    codemirror,
    Pagination,
  },
  created() {
    if (this.$route.params.manage_contest_id != undefined) {
      this.url = "/api/admin/contest/problem";
    }
    this.$http
      .get(window.location.origin + "/api/problem/tags")
      .then((response) => {
        this.tags = response.data;
      });
    this.init();
  },
  mounted() {
    this.ProblemModal = new Modal(this.$refs.problem_modal);
    this.DeleteModal = new Modal(this.$refs.delete_modal);
    this.AddPublicProblemModal = new Modal(this.$refs.add_public_modal);
    this.MakePublicProblemModal = new Modal(this.$refs.make_public_modal);
    for (let i in this.languages.data.spj_languages) {
      this.open_problem_spj[this.languages.data.spj_languages[i].name] = {
        opt: {
          theme: "solarized",
          lineNumbers: true,
          mode: this.languages.data.spj_languages[i].content_type,
          tabSize: 4,
        },
        name: this.languages.data.spj_languages[i].name,
      };
    }
    if (this.$route.query.problem_id != undefined) {
      this.$http
        .get(
          window.location.origin +
            this.url +
            "?id=" +
            this.$route.query.problem_id
        )
        .then((response) => {
          if (response.data.error) {
            this.$error(response.data.data);
          } else {
            this.edit(response.data.data);
            this.ProblemModal.toggle();
          }
        });
    }
  },
  methods: {
    init() {
      let offset = (this.page - 1) * 10;
      let tmp = "?keyword=" + this.keyword + "&offset=" + offset + "&limit=10";
      if (this.$route.params.manage_contest_id != undefined) {
        tmp += "&contest_id=" + this.$route.params.manage_contest_id;
        this.make_public_list_init();
      }
      this.$http
        .get(window.location.origin + this.url + tmp)
        .then((response) => {
          this.problems = response.data;
          this.total = response.data.data.total;
        })
        .then(() => {
          Array.from(
            document.querySelectorAll('button[data-bs-toggle="tooltip"]')
          ).forEach((tooltipNode) => new Tooltip(tooltipNode));
        });
    },
    make_public_list_init() {
      let offset = (this.add_from_public_list.page - 1) * 10;
      this.$http
        .get(
          window.location.origin +
            "/api/admin/problem?rule_type=" +
            this.contest_rule +
            "&limit=10&offset=" +
            offset +
            "&keyword=" +
            this.add_from_public_list.keyword
        )
        .then((response) => {
          this.contest.public_problems = response.data;
          this.add_from_public_list.total = response.data.data.total;
        });
    },
    make_public_topage(page) {
      this.add_from_public_list.page = page;
      this.make_public_list_init();
    },
    reset_problem() {
      this.open_problem = {
        title: "",
        _id: "",
        description: "",
        input_description: "",
        output_description: "",
        time_limit: "1000",
        memory_limit: "256",
        difficulty: "Low",
        share_submission: false,
        visible: true,
        languages: [],
        tags: [],
        samples: [{ input: "", output: "" }],
        hint: "",
        template: {},
        spj: false,
        spj_language: "",
        spj_code: "",
        spj_compile_ok: false,
        rule_type: "ACM",
        io_mode: {
          io_mode: "Standard IO",
          input: "input.txt",
          output: "output.txt",
        },
        test_case_id: "",
        test_case_score: [],
        source: "",
      };
      this.open_problem_variables.tmp_tag = "";
      this.open_problem_variables.testCaseUploaded = false;
    },
    edit(problem) {
      this.open_problem = JSON.parse(JSON.stringify(problem));
      if (this.$route.params.manage_contest_id != undefined) {
        this.open_problem.rule_type = this.contest_rule;
      }
      if (this.open_problem.spj_language == null) {
        this.open_problem.spj_language =
          this.languages.data.spj_languages[0].name;
      }
      this.problem_language();
      this.change_problem_language();
      this.open_problem_variables.testCaseUploaded = true;
      this.mode = "edit";
      this.open_problem.description = decodeURI(this.open_problem?.description);
      this.open_problem.input_description = decodeURI(
        this.open_problem?.input_description
      );
      this.open_problem.output_description = decodeURI(
        this.open_problem?.output_description
      );
      this.open_problem.hint = decodeURI(this.open_problem?.hint);
    },
    create_new() {
      this.reset_problem();
      if (this.$route.params.manage_contest_id != undefined) {
        this.open_problem.rule_type = this.contest_rule;
      }
      for (let item in this.languages.data.languages) {
        this.open_problem.languages.push(
          this.languages.data.languages[item].name
        );
      }
      this.problem_language();
      this.change_problem_language();
      this.open_problem.spj_language =
        this.languages.data.spj_languages[0].name;
      this.mode = "create";
    },
    save() {
      let temp = {};
      for (let lan in this.open_problem.template) {
        if (this.open_problem.template[lan].checked) {
          temp[lan] = this.open_problem.template[lan].code;
        }
      }
      if (this.mode != "vis")
        this.open_problem.template = JSON.parse(JSON.stringify(temp));
      if (this.$route.params.manage_contest_id != undefined) {
        this.open_problem.contest_id = this.$route.params.manage_contest_id;
      }

      let params = JSON.parse(JSON.stringify(this.open_problem));
      [
        "description",
        "input_description",
        "output_description",
        "hint",
      ].forEach((key) => {
        params[key] = encodeURI(params[key]);
      });

      if (this.mode == "edit" || this.mode == "vis") {
        this.$http
          .put(window.location.origin + this.url, params)
          .then((response) => {
            if (!response.data.error) {
              if (this.mode == "edit") {
                this.ProblemModal.toggle();
              }
              this.$success("Succeed");
              this.init();
            } else {
              this.$error(response.data.data);
            }
          });
      } else {
        this.$http
          .post(window.location.origin + this.url, params)
          .then((response) => {
            if (!response.data.error) {
              this.ProblemModal.toggle();
              this.$success("Succeed");
              this.init();
            } else {
              this.$error(response.data.data);
            }
          });
      }
    },
    visible(problem) {
      [
        "description",
        "input_description",
        "output_description",
        "hint",
      ].forEach((key) => {
        problem[key] = decodeURI(problem[key]);
      });
      this.open_problem = problem;
      this.mode = "vis";
      this.save();
    },
    delete_id() {
      this.$http
        .delete(
          window.location.origin + this.url + "?id=" + this.open_problem.id
        )
        .then((response) => {
          if (!response.data.error) {
            this.DeleteModal.toggle();
            this.$success("Succeed");
            this.init();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    to_page(page) {
      this.page = page;
      this.init();
    },
    create_tag() {
      if (this.open_problem_variables.tmp_tag == "") {
        this.$error("Please give tag name.");
        return;
      }
      if (
        this.open_problem.tags.indexOf(this.open_problem_variables.tmp_tag) !=
        -1
      ) {
        this.$.error("Duplicated tag");
        return;
      }
      this.$http
        .get(
          window.location.origin +
            "/api/problem/tags?keyword=" +
            this.open_problem_variables.tmp_tag
        )
        .then(() => {
          this.open_problem.tags.push(this.open_problem_variables.tmp_tag);
          this.open_problem_variables.tmp_tag = "";
        });
    },
    upload_event(e) {
      this.upload_testcase_btn_loading = true;
      let formData = new FormData();
      formData.append("file", e.target.files[0]);
      formData.append("spj", this.open_problem.spj);
      this.$http
        .post(window.location.origin + "/api/admin/test_case", formData)
        .then((response) => {
          if (response.data.error) {
            this.$error(response.data.data);
            this.upload_testcase_btn_loading = false;
            return;
          }
          this.$success(response.data.data.id);
          this.open_problem.test_case_id = response.data.data.id;
          let fileList = response.data.data.info;
          for (let file in fileList) {
            fileList[file].score = (100 / fileList.length).toFixed(0);
            if (!fileList[file].output_name && this.open_problem.spj) {
              fileList[file].output_name = "-";
            }
          }
          this.open_problem.test_case_score = fileList;
          this.open_problem_variables.testCaseUploaded = true;
          e.target.value = "";
          this.upload_testcase_btn_loading = false;
        });
    },
    problem_language() {
      let data = {};
      // use deep copy to avoid infinite loop
      for (let i in this.languages.data.languages) {
        //let langConfig = this.languages.data.languages.find(lang => {
        //    return lang.name === this.open_problem.languages[i]
        //})
        let item = this.languages.data.languages[i].name;
        let langConfig = this.languages.data.languages[i];
        //let item = langConfig.name
        let opt = {
          theme: "solarized",
          lineNumbers: true,
          mode: langConfig.content_type,
          tabSize: 4,
        };
        if (this.open_problem.template[item] === undefined) {
          data[item] = {
            checked: false,
            vis: true,
            code: langConfig.config.template,
            option: opt,
            name: item,
          };
        } else {
          data[item] = {
            checked: true,
            vis: true,
            code: this.open_problem.template[item],
            option: opt,
            name: item,
          };
        }
      }
      this.open_problem.template = JSON.parse(JSON.stringify(data));
    },
    change_problem_language() {
      for (let i in this.open_problem.template) {
        let exist = this.open_problem.languages.find((lang) => {
          return lang === this.open_problem.template[i].name;
        });
        if (exist) {
          this.open_problem.template[i].vis = true;
        } else {
          this.open_problem.template[i].vis = false;
          this.open_problem.template[i].checked = false;
        }
      }
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
    downloadTestCase(problemID) {
      let url = "/api/admin/test_case?problem_id=" + problemID;
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
    add_problem_from_public() {
      let param = {
        contest_id: this.$route.params.manage_contest_id,
        display_id: this.contest.display_id,
        problem_id: this.contest.select_import.id,
      };
      this.$http
        .post(
          window.location.origin + "/api/admin/contest/add_problem_from_public",
          param
        )
        .then((response) => {
          if (!response.data.error) {
            this.AddPublicProblemModal.toggle();
            this.contest.select_import = null;
            this.contest.display_id = "";
            this.$success("Succeed");
            this.init();
          } else {
            this.$error(response.data.data);
          }
        });
    },
    make_problem_public() {
      let param = {
        id: this.make_public_problem.problem.id,
        display_id: this.make_public_problem.display_id,
      };
      this.$http
        .post(
          window.location.origin + "/api/admin/contest_problem/make_public",
          param
        )
        .then((response) => {
          if (!response.data.error) {
            this.$success("Succeed");
            this.init();
          } else {
            this.$error(response.data.data);
          }
          this.MakePublicProblemModal.toggle();
          this.make_public_problem.display_id = "";
        });
    },
    compile_spj() {
      this.open_problem_variables.spj_response = null;
      this.$http
        .post(window.location.origin + "/api/admin/compile_spj", {
          id: this.open_problem.id,
          spj_code: this.open_problem.spj_code,
          spj_language: this.open_problem.spj_language,
        })
        .then((response) => {
          this.open_problem_variables.spj_response = response.data;
          if (!response.data.error) {
            this.$success("Compile Succeed");
            this.open_problem.spj_compile_ok = true;
          }
        });
    },
    reset_testcase() {
      this.open_problem_variables.testCaseUploaded = false;
      (this.open_problem.test_case_id = ""),
        (this.open_problem.test_case_score = []);
    },
    switch_spj() {
      if (this.open_problem_variables.testCaseUploaded) {
        this.$message.warning({
          message: "You need to re-upload testcases",
          duration: 2500,
          zIndex: 1000000,
        });
        this.reset_testcase();
        this.open_problem.spj = !this.open_problem.spj;
      } else {
        this.open_problem.spj = !this.open_problem.spj;
      }
    },
  },
  computed: {
    languages() {
      return this.$store.state.languages;
    },
  },
  watch: {
    keyword() {
      this.page = 1;
      this.init();
    },
    "add_from_public_list.keyword"() {
      this.add_from_public_list.page = 1;
      this.make_public_list_init();
    },
    "open_problem.spj_code"() {
      this.open_problem.spj_compile_ok = false;
    },
  },
  beforeRouteLeave(to, from, next) {
    this.ProblemModal.hide();
    this.DeleteModal.hide();
    this.AddPublicProblemModal.hide();
    this.MakePublicProblemModal.hide();
    next();
  },
  beforeDestroy() {
    this.ProblemModal.hide();
    this.DeleteModal.hide();
    this.AddPublicProblemModal.hide();
    this.MakePublicProblemModal.hide();
  },
};
</script>
