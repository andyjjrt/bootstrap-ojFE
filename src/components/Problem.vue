<template>
    <div>
        <div v-if="problem">
            <div class="row" v-if="!problem.error">
                <div class="col">
                    <div class="card card-body">
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
                        <!--<CodeMirror :mycode="code" class="p-2"/>-->
                        <select class="form-select" aria-label="Default select example" v-model="code_language">
                            <option :value="language" v-for="language in problem.data.languages" :key="language">{{language}}</option>
                        </select>
                        <div class="p-2">
                            <textarea v-model="code" style="width: 100%; height: 100px"/>
                        </div>
                        <div class="d-grid gap-2 d-md-flex justify-content-between">
                            <span class="fs-4" v-html="status_indicater" v-if="status_indicater"/>
                            <p></p>
                            <button class="btn btn-warning me-md-2" :class="{'disabled':on_submit}" type="button" @click="submit">Submit</button>
                        </div>
                    </div>
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
                    <br>
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-pie-chart"></i> Statistic
                        </div>
                        <div class="card-body">
                            <Pie :data="donught_data()" :option="donught_options" class="lg-display"/>
                            <Pie :data="donught_data()" class="lg-no-display" />
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
//import CodeMirror from '@/components/CodeMirror.vue'
import Pie from '@/components/Pie.vue'

export default {
    name:"problem_page",
    props:{
        problem_url: String,
        type: String
    },
    data(){
        return{
            thisid:"",
            problem:null,
            code:"",
            code_language:"",
            donught_options:{
                legend:{
                    display: false
                }
            },
            on_submit: false,
            status_indicater:"",
            ticker: null
        }
    },
    components:{
        //CodeMirror,
        Pie
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
            this.code_language = this.problem.data.languages[0]
        })
    },
    methods:{
        submit(){
            console.log(this.code)
            if(this.code == "" || this.code == undefined){
                this.$message.error({message: 'Code can not be empty',duration : 1500})
                return
            }
            this.on_submit = true
            this.status_indicater = ""
            this.$http.post(window.location.origin + '/api/submission', {code: this.code ,language: this.code_language, problem_id: this.problem.data.id})
            .then((res) => {
                let vm = this
                vm.get_submit_status(res.data.data.submission_id)
                this.ticker = window.setInterval(function(){vm.get_submit_status(res.data.data.submission_id)}, 1000)
            })
            .catch((error) => {
                console.error(error)
            })
        },
        get_submit_status(id){
            this.$http.get(window.location.origin + '/api/submission?id=' + id).then(response => {
                this.status_indicater = '<span class="badge bg-' + this.$store.state.status_list[response.data.data.result].type + '">' + this.$store.state.status_list[response.data.data.result].name + '</span>'
                if(response.data.data.result != 7 && response.data.data.result != 9){
                    window.clearInterval(this.ticker)
                    this.on_submit = false
                }
            })
        },
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
        },
        donught_data(){
            let data = {
                datasets: [
                    {
                        data: [],
                        backgroundColor: []
                    }
                ],
                labels: []
            }
            let keys = Object.keys(this.problem.data.statistic_info)
            for (let i in keys){
                data.datasets[0].data.push(this.problem.data.statistic_info[keys[i]])
                data.datasets[0].backgroundColor.push(this.$store.state.status_list[keys[i]].color)
                data.labels.push(this.$store.state.status_list[keys[i]].short)
            }
            return data
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
  .lg-display{
    display: block;
  }
  .lg-no-display{
      display: none;
  }
  @media (min-width: 768px) {
    .md-no-display{
      display: block;
    }
    .md-display{
      display: none;
    }
  }
  @media (min-width: 992px) {
      .lg-no-display{
        display: block;
        }
        .lg-display{
        display: none;
        }
  }
</style>