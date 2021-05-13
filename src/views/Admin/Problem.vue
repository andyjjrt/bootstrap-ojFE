<template>
    <div class="container">
        <div class="modal fade" id="AnnounceEditModal" tabindex="-1" aria-labelledby="AnnounceEditModalLabel" aria-hidden="true" ref="announce_modal">
            <div class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AnnounceEditModalLabel">Problem</h5>
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
                                <Editor v-model="open_problem.description" />
                            </div>
                            <div class="col-sm-12">
                                <label class="form-label">Input Description</label>
                                <Editor v-model="open_problem.input_description" />
                            </div>
                            <div class="col-sm-12">
                                <label class="form-label">Output Description</label>
                                <Editor v-model="open_problem.output_description" />
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
                                    <input class="form-check-input" type="checkbox" id="Problem_visible" v-model="open_problem.share_submission">
                                    <label class="form-check-label" for="Problem_visible">Share</label>
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
                                <Editor v-model="open_problem.hint" />
                            </div>
                            <div class="col-sm-12">
                                <label class="form-label">Code Templates</label>
                                <div v-for="i in languages.data.languages.length" :key="i">
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" :value="languages.data.languages[i-1].name" v-model="open_problem.template" :id="'template' + languages.data.languages[i-1].name">
                                        <label class="form-check-label" :for="'template' + languages.data.languages[i-1].name">
                                            {{languages.data.languages[i-1].name}}
                                        </label>
                                    </div>
                                    <codemirror v-if="open_problem.template.indexOf(languages.data.languages[i-1].name) != -1" v-model="open_problem_variables.templates[i-1]" :options="open_problem_variables.options[i-1]" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="AnnouncedeleteModal" tabindex="-1" aria-labelledby="AnnouncedeleteModalLabel" aria-hidden="true" ref="delete_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AnnouncedeleteModalLabel">Confirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this announcement?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="delete_id">Delete</button>
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
                                <button class="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#AnnounceEditModal" @click="edit(announce)"><i class="bi bi-pencil-square"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#AnnouncedeleteModal" @click="announce_1 = announce"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AnnounceEditModal" @click="create_new">Create</button>
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
import Editor from '@/views/Admin/components/Editor.vue'
export default {
    name:"EditAnnounce",
    data(){
        return{
            problems: null,
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
                template:[]
            },
            open_problem_variables:{
                tmp_tag:"",
                templates:[],
                options:[]
            },
            mode:"create",
            AnnounceModal: null,
            DeleteModal: null,
            page:1,
        }
    },
    components:{
        Editor,
        codemirror
    },
    created(){
        this.init()
    },
    mounted(){
        this.AnnounceModal = new Modal(this.$refs.announce_modal)
        this.DeleteModal = new Modal(this.$refs.delete_modal)
    },
    methods:{
        init(){
            this.$http.get(window.location.origin + '/api/admin/problem?offset=' + this.offset + '&limit=10').then(response => {
                this.problems = response.data
                this.total = response.data.data.total
            });
            this.$http.get(window.location.origin + '/api/languages').then(response => {
                this.languages = response.data
                for(let i in this.languages.data.languages){
                    this.open_problem_variables.templates.push(this.languages.data.languages[i].config.template)
                    this.open_problem_variables.options.push({
                        theme: "solarized",
                        lineNumbers: true,
                        mode: this.languages.data.languages[i].content_type,
                        tabSize: 4
                    })
                }
            });
        },
        edit(announce){
            this.announce_1 = announce
            this.mode = "edit"
        },
        create_new(){
            this.announce_1 = {
                title:"",
                content:"",
                visible:true,
                id: null
            }
            this.mode = "create"
        },
        save(){
            if(this.mode == "edit" || this.mode == "vis"){
                this.$http.put(window.location.origin + '/api/admin/announcement', this.announce_1).then(response => {
                    if(!response.data.error){
                        if(this.mode == "edit"){
                            this.AnnounceModal.toggle();
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
                this.$http.post(window.location.origin + '/api/admin/announcement', this.announce_1).then(response => {
                    if(!response.data.error){
                        this.AnnounceModal.toggle();
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
        visible(announce){
            this.announce_1 = announce
            this.mode="vis"
            this.save();
        },
        delete_id(){
            this.$http.delete(window.location.origin + '/api/admin/announcement?id=' + this.announce_1.id).then(response => {
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
            }
            this.$http.get(window.location.origin + '/api/problem/tags?keyword=' + this.open_problem_variables.tmp_tag).then(() => {
                this.open_problem.tags.push(this.open_problem_variables.tmp_tag)
                this.open_problem_variables.tmp_tag = ""
            })
        }
    }
}
</script>

<style>

</style>