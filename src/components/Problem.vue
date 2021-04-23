<template>
    <div>
        <div v-if="problem">
            <div class="row" v-if="!problem.error">
                <div class="col-md-9">
                    <div class="card card-body">
                        <div>
                            <h3>{{problem.data.title}}</h3>
                            <span class="float-end" v-if="problem.data.source">{{problem.data.source}}</span>
                        </div>
                        <hr>
                        <h4>Description</h4>
                        <p v-html="problem.data.description" class="p-4 text-wrap codeder" v-katex style="background-color: #f3f3f3;"></p>
                        <h4>Input</h4>
                        <p v-html="problem.data.input_description" class="p-4 text-wrap codeder" v-katex style="background-color: #f3f3f3;"></p>
                        <h4>Output</h4>
                        <p v-html="problem.data.output_description" class="p-4 text-wrap codeder" v-katex style="background-color: #f3f3f3;"></p>
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
                        <h4 v-if="problem.data.hint != ''">Hint</h4>
                        <p  v-if="problem.data.hint != ''" v-html="problem.data.hint" class="p-4 text-wrap codeder" v-katex style="background-color: #f3f3f3;"></p>
                        <CodeMirror :problem="problem" :type="type" class="p-2"/>
                    </div>
                </div>
                <div class="col-3 md-no-display">
                    <div class="list-group">
                        <button type="button" class="list-group-item list-group-item-action" @click="$router.push({ path: '/contest/' + $route.params.id +  '/status', query: { problem_id: problem.data._id}})" v-if="type == 'contest'">
                            <div class="p-1"><i class="bi bi-list-task"></i> Submissions</div>
                        </button>
                        <button type="button" class="list-group-item list-group-item-action" @click="$router.push({ path: '/status', query: { problem_id: problem.data._id}})" v-else>
                            <div class="p-1"><i class="bi bi-list-task"></i> Submissions</div>
                        </button>
                    </div>
                    <br>
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
                            <Pie :data="donught_data()" :option="donught_options" class="d-block d-lg-none d-xl-none d-xxl-none"/>
                            <Pie :data="donught_data()" class="d-none d-lg-block d-xl-block d-xxl-block" />
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
            donught_options:{
                legend:{
                    display: false
                }
            },
        }
    },
    components:{
        CodeMirror,
        Pie
    },
    created(){
        this.thisid = this.$route.params.id
        this.$http.get(window.location.origin + this.problem_url).then(response => {
            this.problem = response.data
            let root = parse(this.problem.data.description)
            for(let i in root.querySelectorAll("img")){
                root.querySelectorAll("img")[i].removeAttribute("width")
                root.querySelectorAll("img")[i].removeAttribute("height")
                root.querySelectorAll("img")[i].setAttribute("class", "img-fluid")
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
                vue.$message.success({message: 'Code coppied!',duration : 1500,zIndex: 1000000})
            }, function () {
                vue.$message.error({message: 'Fail coppying!',duration : 1500,zIndex: 1000000})
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
  .codeder code{
      padding: 0px 4px;
  }
</style>