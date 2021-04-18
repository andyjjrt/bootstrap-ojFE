<template>
    <div>
        <div class="container-fluid" v-if="problem">
            <div class="row" v-if="!problem.error">
                <div class="col">
                    <h3>{{problem.data.title}}</h3>
                    <hr>
                    <h4>Description</h4>
                    <p v-html="problem.data.description" class="p-4 text-wrap" v-katex></p>
                    <h4>Input</h4>
                    <p v-html="problem.data.input_description" class="p-4 text-wrap" v-katex></p>
                    <h4>Output</h4>
                    <p v-html="problem.data.output_description" class="p-4 text-wrap" v-katex></p>
                    <div class="row" v-for="tests in problem.data.samples" :key="tests.input">
                        <div class="col-6">
                            <h4>
                                Input&nbsp;
                                <a role="button" @click="doCopy(tests.input)"><i class="bi bi-clipboard"></i></a>
                            </h4>
                            <pre class="p-4 text-wrap" style="border: black solid 2px;"><code v-html="replace_n(tests.input)"/></pre>
                        </div>
                        <div class="col-6">
                            <h4>Output</h4>
                            <pre class="p-4 text-wrap" style="border: black solid 2px;"><code v-html="replace_n(tests.output)"/></pre>
                        </div>
                    </div>
                    <CodeMirror :mycode="code" class="p-2"/>
                </div>
                <div class="col-3 md-no-display">
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-info-circle"></i> Information
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush" style="font-size: smaller;">
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>ID</span>
                                    <span>{{problem.data._id}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-clock"></i></span>
                                    <span>{{problem.data.time_limit}}ms</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-hdd"></i></span>
                                    <span>{{problem.data.memory_limit}}MB</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-code-slash"></i></span>
                                    <span>{{problem.data.io_mode.io_mode}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-person-circle"></i></span>
                                    <span>{{problem.data.created_by.username}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-star"></i></span>
                                    <span v-html="difficulty_tag(problem.data.difficulty)"></span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="alert alert-danger" role="alert">
                    {{problem.data}}
                </div>
            </div>
        </div>
        <div class="d-flex justify-content-center" v-else>
            <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
</template>

<script>
import { parse } from 'node-html-parser';
import CodeMirror from '@/components/CodeMirror.vue'

export default {
    name:"problem_page",
    props:{
        problem_url: String
    },
    data(){
        return{
            thisid:"",
            problem:null,
            code:"",
        }
    },
    components:{
        CodeMirror
    },
    created(){
        this.thisid = this.$route.params.id
        this.$http.get(window.location.origin + this.problem_url).then(response => {
            this.problem = response.data
            this.code = this.problem.data.template.C
            let root = parse(this.problem.data.description)
            for(let i in root.querySelectorAll("img")){
                root.querySelectorAll("img")[i].removeAttribute("width")
                root.querySelectorAll("img")[i].removeAttribute("height")
                root.querySelectorAll("img")[i].setAttribute("class", "img-fluid")
                console.log(root.querySelectorAll("img")[i])
            }
            this.problem.data.description = root.toString().replace(/\u00A0/g, " ");
        })
    },
    methods:{
        difficulty_tag(difficulty){
            if(difficulty == "High"){
                return '<span class="badge bg-warning text-dark">High</span>'
            }else if(difficulty == "Mid"){
                return '<span class="badge bg-primary">Mid</span>'
            }
            return '<span class="badge bg-success">Low</span>'
        },
        doCopy: function (text) {
            let vue = this
            this.$copyText(text).then(function () {
                vue.$message.success({message: 'Code coppied!',duration : 1500})
            }, function () {
                vue.$message.error({message: 'Fail coppying!',duration : 1500})
            })
        },
        replace_n(string){
            return string.replace(/\n/g,'<br>')
        }
    }
}
</script>

<style>
  .md-no-display{
    display: none;
  }
  .md-display{
    display: block;
  }
  @media (min-width: 768px) {
    .md-no-display{
      display: block;
    }
    .md-display{
      display: none;
    }
  }
</style>