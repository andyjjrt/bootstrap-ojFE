<template>
    <div>
        <div class="modal fade" id="ProblemModal" tabindex="-1" aria-labelledby="ProblemModalLabel" aria-hidden="true" ref="problem_modal">
            <div class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ProblemModalLabel">Problem</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="languages">
                        <div class="row g-3">
                            <div class="col-sm-3">
                                <label class="form-label">Display ID</label>
                                <input type="text" class="form-control" v-model="open_problem._id" >
                            </div>
                            <div class="col-sm-9">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" v-model="open_problem.title" >
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
                                <input type="text" class="form-control" v-model="open_problem.time_limit" >
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">Memory Limit(MB)</label>
                                <input type="text" class="form-control" v-model="open_problem.memory_limit" >
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
                                    <input class="form-check-input" type="checkbox" id="Problem_visible" v-model="open_problem.visible">
                                    <label class="form-check-label" for="Problem_visible">Visible</label>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="Problem_share" v-model="open_problem.share_submission">
                                    <label class="form-check-label" for="Problem_share">Share</label>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <label class="form-label">Languages</label>
                                <div>
                                    <div class="form-check form-check-inline"  v-for="lang in languages.data.languages" :key="lang.name">
                                        <input class="form-check-input" type="checkbox" :value="lang.name" :id="lang.name" v-model="open_problem.languages">
                                        <label class="form-check-label" :for="lang.name">
                                            {{lang.name}}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">New Tag</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" placeholder="New Tag" v-model="open_problem_variables.tmp_tag">
                                    <button class="btn btn-outline-primary" type="button" @click="create_tag">Add</button>
                                </div>
                            </div>
                            <div class="col-sm-8">
                                <label class="form-label">Tags</label>
                                <div class="d-flex flex-wrap">
                                    <div v-for="tag in open_problem.tags" :key="tag" style="padding-right: 2px"><span class="badge bg-success">{{tag}}<button type="button" class="btn-close btn-close-white" aria-label="Close" @click="open_problem.tags.splice(open_problem.tags.indexOf(tag), 1);"></button></span></div>
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <div v-for="sample in open_problem.samples.length" :key="sample.input">
                                    <div class="card card-body">
                                        <div class="d-flex justify-content-between">
                                            <h6 class="fw-bold">Sample{{sample}}</h6>
                                            <button class="btn btn-warning" @click="open_problem.samples.splice(sample-1, 1)">Delete</button>
                                        </div>
                                        <div class="row">
                                            <div class="col">
                                                <label class="form-label">Input sample</label>
                                                <textarea class="form-control font-monospace" v-model="open_problem.samples[sample-1].input" rows="5" />
                                            </div>
                                            <div class="col">
                                                <label class="form-label">Output sample</label>
                                                <textarea class="form-control font-monospace" v-model="open_problem.samples[sample-1].output" rows="5" />
                                            </div>
                                        </div>
                                    </div>
                                    <br>
                                </div>
                                <div class="d-grid gap-2">
                                    <button class="btn btn-primary" type="button" @click="open_problem.samples.push({input:'', output:''})">Add Sample</button>
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
                                <div v-for="(v,k) in open_problem.template" :key="'template'+k">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" v-model="v.checked" :id="'template' + k">
                                        <label class="form-check-label" :for="'template' + k">
                                            {{k}}
                                        </label>
                                    </div>
                                    <codemirror v-model="v.code" :options="v.option" v-if="v.checked" />
                                 </div>
                            </div>
                            <div class="col-sm-12">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="spjswitch"  v-model="open_problem.spj" disabled>
                                    <label class="form-check-label" for="spjswitch">Use special judge(maintaining)</label>
                                </div>
                            </div>
                            <div class="col-sm-12" v-if="open_problem.spj">
                                <div class="card">
                                    <div class="card-header">
                                        <div class="form-check form-check-inline" v-for="i in languages.data.spj_languages.length" :key="i">
                                            <input class="form-check-input" type="radio" :id="'inlineRadio'+i" :value="languages.data.spj_languages[i-1].name" v-model="open_problem.spj_language">
                                            <label class="form-check-label" :for="'inlineRadio'+i">{{languages.data.spj_languages[i-1].name}}</label>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <codemirror :options="open_problem_spj.options[0]" v-model="open_problem.spj_code" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">Type</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="type_acm" value="ACM" v-model="open_problem.rule_type">
                                        <label class="form-check-label" for="type_acm">ACM</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="type_oi" value="OI" v-model="open_problem.rule_type">
                                        <label class="form-check-label" for="type_oi">OI</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">IO Mode</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="mode_std" value="Standard IO" v-model="open_problem.io_mode.io_mode">
                                        <label class="form-check-label" for="mode_std">Standard IO</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="mode_file" value="File IO" v-model="open_problem.io_mode.io_mode">
                                        <label class="form-check-label" for="mode_file">File IO</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div v-if="open_problem.io_mode.io_mode == 'File IO'">
                                    <label class="form-label">Input file</label>
                                    <input type="text" class="form-control" v-model="open_problem.io_mode.input">
                                </div>
                            </div>
                            <div class="col-sm-2">
                                <div v-if="open_problem.io_mode.io_mode == 'File IO'">
                                    <label class="form-label">Output file</label>
                                    <input type="text" class="form-control" v-model="open_problem.io_mode.output">
                                </div>
                            </div>
                            <div class="col-sm-12">
                                <label class="btn btn-primary">
                                    <input style="display:none;" type="file" @change="upload_event">
                                    Upload Testcase
                                </label>
                            </div>
                            <div class="col-sm-12">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Input</th>
                                            <th scope="col">Output</th>
                                            <th scope="col">Last</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="open_problem.test_case_id == ''">
                                        <tr>
                                            <td colspan="3" class="text-center">No Data</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-else>
                                        <tr v-for="testcase in open_problem.test_case_score" :key="testcase.input_name">
                                            <td class="col-3">{{testcase.input_name}}</td>
                                            <td class="col-3">{{testcase.output_name}}</td>
                                            <td class="col-3"><input class="form-control form-control-sm" type="text" v-model="testcase.score" :disabled="open_problem.rule_type == 'ACM'"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-sm-12">
                                <label class="form-label">Source</label>
                                <input type="text" class="form-control" v-model="open_problem.source" >
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="ProblemdeleteModal" tabindex="-1" aria-labelledby="ProblemdeleteModalLabel" aria-hidden="true" ref="delete_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ProblemdeleteModalLabel">Confirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this problem?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="delete_id">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="AddPublicProblemModal" tabindex="-1" aria-labelledby="AddPublicProblemModalLabel" aria-hidden="true" ref="add_public_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AddPublicProblemModalLabel">Add Problem from Public</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <table class="table text-nowrap table-hover" v-if="contest.public_problems">
                            <thead>
                                <tr>
                                    <th class="col-4">#</th>
                                    <th class="col-4">Display ID</th>
                                    <th class="col-4">Title</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="p in contest.public_problems.data.results" :key="p.id" role="button" @click="contest.select_import = p" :class="{'table-primary': contest.select_import == p}" class=" text-black">
                                    <td class="col-4">{{p.id}}</td>
                                    <td class="col-4">{{p._id}}</td>
                                    <td class="col-4">{{p.title}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="modal-body">
                        <div v-if="contest.select_import">
                            <div class="mb-3">
                                <label class="form-label">Display ID for the contest problem</label>
                                <input type="text" class="form-control" placeholder="Display ID" v-model="contest.display_id">
                            </div>
                            <button type="button" class="btn btn-primary float-end" @click="add_problem_from_public">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="MakePublicProblemModal" tabindex="-1" aria-labelledby="MakePublicProblemModalLabel" aria-hidden="true" ref="make_public_modal">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="MakePublicProblemModalLabel">Make Problem Public</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div>
                            <div class="mb-3">
                                <label class="form-label">Display ID for the problem</label>
                                <input type="text" class="form-control" placeholder="Display ID" v-model="make_public_problem.display_id">
                            </div>
                            <button type="button" class="btn btn-primary float-end" @click="make_problem_public">Add</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card card-body">
            <div class="table-responsive">
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
                    <tbody v-if="problems && languages">
                        <tr v-for="problem in problems.data.results" :key="problem.id">
                            <td>{{problem.id}}</td>
                            <td>{{problem._id}}</td>
                            <td>{{problem.title}}</td>
                            <td>{{problem.created_by.username}}</td>
                            <td>{{new Date(problem.create_time).toLocaleString()}}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="problem.visible" @change="visible(problem)">
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#MakePublicProblemModal" @click="make_public_problem.problem = problem" v-if="$route.params.manage_contest_id != undefined"><i class="bi bi-upload"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#ProblemModal" @click="edit(problem)"><i class="bi bi-pencil-square"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-outline-primary" @click="downloadTestCase(problem.id)"><i class="bi bi-cloud-arrow-down"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#ProblemdeleteModal" @click="open_problem = problem"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="problems.data.results.length == 0">
                            <td colspan="7" class="text-center">No Data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#ProblemModal" @click="create_new"><i class="bi bi-plus"></i> Create</button>&nbsp;
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddPublicProblemModal" @click="create_new" v-if="$route.params.manage_contest_id != undefined"><i class="bi bi-plus"></i> Add Public Problem</button>
                </div>
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)-1)"><i class="bi bi-chevron-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)+1)"><i class="bi bi-chevron-right"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/10) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/theme/solarized.css'

import Modal from 'bootstrap/js/dist/modal.js'

export default {
    name:"EditProblem",
    data(){
        return{
            toolbar : {
                Katex: {
                    title: 'Katex',
                    icon: 'v-md-icon-code',
                    action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '$';
                        const suffix = '$';
                        const placeholder = 'Katex';
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
            contest:{
                public_problems: null,
                select_import: null,
                display_id:""
            },
            make_public_problem:{
                display_id:"",
                problem: null
            },
            languages: null,
            total: 0,
            open_problem:{
                title:"",
                _id:"",
                description:"",
                input_description:"",
                output_description:"",
                time_limit:"1000",
                memory_limit:"256",
                difficulty:"Low",
                share_submission:false,
                visible:true,
                languages: [],
                tags:[],
                samples:[{input:"", output:""}],
                hint:"",
                template:{},
                spj:false,
                spj_language:"",
                spj_code:"",
                rule_type:"ACM",
                io_mode:{
                    io_mode: 'Standard IO',
                    input: 'input.txt',
                    output: 'output.txt'
                },
                test_case_id: "",
                test_case_score: [],
                source:""
            },
            open_problem_variables:{
                tmp_tag:"",
                templates:[],
                options:[],
                testCaseUploaded:false
            },
            open_problem_spj:{
                options:[],
            },
            mode:"create",
            ProblemModal: null,
            DeleteModal: null,
            AddPublicProblemModal: null,
            MakePublicProblemModal: null,
            page:1,
            url:"/api/admin/problem"
        }
    },
    props:{
        contest_rule: String
    },
    components:{
        codemirror
    },
    created(){
        if(this.$route.params.manage_contest_id != undefined){
            this.url = '/api/admin/contest/problem'
        }
        this.init()
    },
    mounted(){
        this.ProblemModal = new Modal(this.$refs.problem_modal)
        this.DeleteModal = new Modal(this.$refs.delete_modal)
        this.AddPublicProblemModal = new Modal(this.$refs.add_public_modal)
        this.MakePublicProblemModal = new Modal(this.$refs.make_public_modal)
    },
    methods:{
        init(){
            let tmp = "?offset=" + this.offset + "&limit=10"
            if(this.$route.params.manage_contest_id != undefined){
                tmp += '&contest_id=' + this.$route.params.manage_contest_id
                this.$http.get(window.location.origin + '/api/admin/problem?rule_type=' + this.contest_rule).then(response => {
                    this.contest.public_problems = response.data
                });
            }
            this.$http.get(window.location.origin + this.url + tmp).then(response => {
                this.problems = response.data
                this.total = response.data.data.total
            });
            this.$http.get(window.location.origin + '/api/languages').then(response => {
                this.languages = response.data
            });
        },
        reset_problem(){
            this.open_problem = {
                title:"",
                _id:"",
                description:"",
                input_description:"",
                output_description:"",
                time_limit:"1000",
                memory_limit:"256",
                difficulty:"Low",
                share_submission:false,
                visible:true,
                languages: [],
                tags:[],
                samples:[{input:"", output:""}],
                hint:"",
                template:{},
                spj:false,
                spj_language:"",
                spj_code:"",
                rule_type:"ACM",
                io_mode:{
                    io_mode: 'Standard IO',
                    input: 'input.txt',
                    output: 'output.txt'
                },
                test_case_id: "",
                test_case_score: [],
                source:""
            }
            this.open_problem_variables.tmp_tag = ""
            this.open_problem_variables.testCaseUploaded = false
        },
        edit(problem){
            this.open_problem = JSON.parse(JSON.stringify(problem))
            this.problem_language()
            this.mode = "edit"
        },
        create_new(){
            this.reset_problem()
            this.problem_language()
            this.mode = "create"
        },
        save(){
            let temp = {}
            for(let lan in this.open_problem.template){
                if(this.open_problem.template[lan].checked){
                    temp[lan] = this.open_problem.template[lan].code
                }
            }
            this.open_problem.template = JSON.parse(JSON.stringify(temp))
            if(this.$route.params.manage_contest_id != undefined){
                this.open_problem.contest_id = this.$route.params.manage_contest_id
            }
            if(this.mode == "edit" || this.mode == "vis"){
                this.$http.put(window.location.origin + this.url, this.open_problem).then(response => {
                    if(!response.data.error){
                        if(this.mode == "edit"){
                            this.ProblemModal.toggle();
                        }
                        this.$message.success({
                            message: "Succeed",
                            duration : 1500,
                            zIndex: 1000000
                        })
                        this.init();
                    }else{
                        this.$message.error({
                            message: response.data.data,
                            duration : 1500,
                            zIndex: 1000000
                        })
                    }
                });
            }else{
                this.$http.post(window.location.origin + this.url, this.open_problem).then(response => {
                    if(!response.data.error){
                        this.ProblemModal.toggle();
                        this.$message.success({
                            message: "Succeed",
                            duration : 1500,
                            zIndex: 1000000
                        })
                        this.init();
                    }else{
                        this.$message.error({
                            message: response.data.data,
                            duration : 1500,
                            zIndex: 1000000
                        })
                    }
                });
            }
        },
        visible(problem){
            this.open_problem = problem
            this.mode="vis"
            this.save();
        },
        delete_id(){
            this.$http.delete(window.location.origin + this.url + '?id=' + this.open_problem.id).then(response => {
                if(!response.data.error){
                    this.DeleteModal.toggle()
                    this.$message.success({
                        message: "Succeed",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.init();
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/10) + 1){
                return
            }
            this.page = page
            this.init()
        },
        create_tag(){
            if(this.open_problem_variables.tmp_tag == ""){
                this.$message.error({
                    message: "Please give tag name.",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            if(this.open_problem.tags.indexOf(this.open_problem_variables.tmp_tag) != -1){
                this.$message.error({
                    message: "Duplicated tag",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            this.$http.get(window.location.origin + '/api/problem/tags?keyword=' + this.open_problem_variables.tmp_tag).then(() => {
                this.open_problem.tags.push(this.open_problem_variables.tmp_tag)
                this.open_problem_variables.tmp_tag = ""
            })
        },
        upload_event(e){
            let formData = new FormData();
            formData.append("file", e.target.files[0]);
            formData.append("spj", this.open_problem.spj)
            this.$http.post(window.location.origin + '/api/admin/test_case',formData).then(response => {
                if (response.data.error) {
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                    return
                }
                this.open_problem.test_case_id = response.data.data.id
                let fileList = response.data.data.info
                for (let file in fileList) {
                    fileList[file].score = (100 / fileList.length).toFixed(0)
                    if (!fileList[file].output_name && this.open_problem.spj) {
                        fileList[file].output_name = '-'
                    }
                }
                this.open_problem.test_case_score = fileList
                this.open_problem_variables.testCaseUploaded = true
            })
        },
        problem_language(){
            let data = new Object
            // use deep copy to avoid infinite loop
            for (let i in this.languages.data.languages) {
                let item = this.languages.data.languages[i].name
                let langConfig = this.languages.data.languages[i]
                let opt = {
                    theme: "solarized",
                    lineNumbers: true,
                    mode: langConfig.content_type,
                    tabSize: 4
                }
                if (this.open_problem.template[item] === undefined) {
                    data[item] = {checked: false, code: langConfig.config.template, option: opt}
                } else {
                    data[item] = {checked: true, code: this.open_problem.template[item], option: opt}
                }
            }
            this.open_problem.template = data
        },
        handleUploadImage(event, insertImage, files) {
            // Get the files and upload them to the file server, then insert the corresponding content into the editor
            console.log(files);
            let formData = new FormData();
            formData.append("original_filename", files[0].name);
            formData.append("image", files[0]);
            this.$http.post(window.location.origin + '/api/admin/upload_image',formData).then(response => {
                if(response.data.success){
                    insertImage({
                        url: response.data.file_path,
                        desc: files[0].name,
                        width: 'auto',
                        height: 'auto',
                    });
                }
            })
            // Here is just an example
        },
        downloadTestCase (problemID) {
            let url = '/api/admin/test_case?problem_id=' + problemID
            // eslint-disable-next-line no-unused-vars
            new Promise((resolve, reject) => {
                this.$http.get(url, {responseType: 'blob'}).then(resp => {
                    let headers = resp.headers
                    if (headers['content-type'].indexOf('json') !== -1) {
                        let fr = new window.FileReader()
                        if (resp.data.error) {
                            this.$message.error({
                                message: resp.data.error,
                                duration : 1500,
                                zIndex: 1000000
                            })
                        } else {
                            this.$message.error({
                                message: 'Invalid file format',
                                duration : 1500,
                                zIndex: 1000000
                            })
                        }
                        fr.onload = (event) => {
                            let data = JSON.parse(event.target.result)
                            if (data.error) {
                                this.$message.error({
                                    message: data.data,
                                    duration : 1500,
                                    zIndex: 1000000
                                })
                            } else {
                                this.$message.error({
                                    message: 'Invalid file format',
                                    duration : 1500,
                                    zIndex: 1000000
                                })
                            }
                        }
                        let b = new window.Blob([resp.data], {type: 'application/json'})
                        fr.readAsText(b)
                        return
                    }
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new window.Blob([resp.data], {type: headers['content-type']}))
                    link.download = (headers['content-disposition'] || '').split('filename=')[1]
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                    resolve()
                }).catch(() => {})
            })
        },
        add_problem_from_public(){
            let param = {
                contest_id: this.$route.params.manage_contest_id,
                display_id: this.contest.display_id,
                problem_id: this.contest.select_import.id
            }
            this.$http.post(window.location.origin + '/api/admin/contest/add_problem_from_public', param).then(response => {
                if(!response.data.error){
                    this.AddPublicProblemModal.toggle();
                    this.contest.select_import = null
                    this.contest.display_id = ""
                    this.$message.success({
                        message: "Succeed",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.init();
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            });
        },
        make_problem_public(){
            let param = {
                id: this.make_public_problem.problem.id,
                display_id: this.make_public_problem.display_id,
            }
            console.log(param)
            this.$http.post(window.location.origin + '/api/admin/contest_problem/make_public', param).then(response => {
                if(!response.data.error){
                    this.$message.success({
                        message: "Succeed",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.init();
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
                this.MakePublicProblemModal.toggle();
                this.make_public_problem.display_id = ""
            });
        }
    },
    beforeRouteLeave(to, from, next) {
        this.ProblemModal.hide()
        this.DeleteModal.hide()
        next()
    }
}
</script>

<style>

</style>