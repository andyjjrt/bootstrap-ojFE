<template>
    <div>
        <div v-if="problem">
            <div class="row" v-if="!problem.error">
                <div class="col-md-9">
                    <div class="card card-body" v-katex>
                        <div>
                            <div class="d-flex justify-content-between">
                                <h3>{{problem.data.title}}</h3>
                                <template v-if="$store.state.profile">
                                    <template v-if="$store.state.profile.data">
                                        <span>
                                            <button class="btn btn-primary btn-sm" @click="edit(problem.data.id)" v-if="$store.state.profile.data.user.admin_type == 'Admin' || $store.state.profile.data.user.admin_type == 'Super Admin'"><i class="bi bi-pencil-square"></i></button>
                                        </span>
                                    </template>
                                </template>
                            </div>
                            <span class="float-end" v-if="problem.data.source">{{problem.data.source}}</span>
                        </div>
                        <hr>
                        <h4>Description</h4>
                        <v-md-editor :value="decodeURI(problem.data.description)" mode="preview"></v-md-editor>
                        <h4>Input</h4>
                        <v-md-editor :value="problem.data.input_description" mode="preview"></v-md-editor>
                        <h4>Output</h4>
                        <v-md-editor :value="problem.data.output_description" mode="preview"></v-md-editor>
                        <div class="row g-2 mb-3">
                            <template v-for="(tests, i) in problem.data.samples">
                                <div class="col-sm-6" :key="'input' + i">
                                    <h4>
                                        Input {{i+1}}&nbsp;
                                        <a role="button" @click="doCopy(tests.input)"><i class="bi bi-clipboard"></i></a>
                                    </h4>
                                </div>
                                <div class="col-sm-6 d-none d-sm-block" :key="'output1' + i">
                                    <h4>
                                        Output {{i+1}}&nbsp;
                                        <a role="button" @click="doCopy(tests.output)"><i class="bi bi-clipboard"></i></a>    
                                    </h4>
                                </div>
                                <div class="col-sm-6" :key="tests.input">
                                    <div class="p-1 border bg-light" style="height: 100%">
                                        <pre class="p-4"><code v-html="replace_n(tests.input)"/></pre>
                                    </div>
                                </div>
                                <div class="col-sm-6 d-block d-sm-none" :key="'output2' + i">
                                    <h4>
                                        Output {{i+1}}&nbsp;
                                        <a role="button" @click="doCopy(tests.output)"><i class="bi bi-clipboard"></i></a>    
                                    </h4>
                                </div>
                                <div class="col-sm-6" :key="tests.output">
                                    <div class="p-1 border bg-light" style="height: 100%">
                                        <pre class="p-4"><code v-html="replace_n(tests.output)"/></pre>
                                    </div>
                                </div>
                            </template>
                            <br>
                        </div>
                        <h4 v-if="problem.data.hint != ''">Hint</h4>
                        <v-md-editor v-if="problem.data.hint != ''" :value="problem.data.hint" mode="preview"></v-md-editor>
                        <CodeMirror :problem="problem" :type="type" class="p-2"/>
                    </div>
                </div>
                <div class="col-3 md-no-display">
                    <div class="list-group">
                        <button type="button" class="list-group-item list-group-item-action" @click="$router.push({ path: '/contest/' + $route.params.id +  '/status', query: { problem_id: problem.data._id}})" v-if="type == 'contest'">
                            <div class="p-1 text-nowrap"><i class="bi bi-list-task"></i> Submissions</div>
                        </button>
                        <button type="button" class="list-group-item list-group-item-action" @click="$router.push({ path: '/status', query: { problem_id: problem.data._id}})" v-else>
                            <div class="p-1 text-nowrap"><i class="bi bi-list-task"></i> Submissions</div>
                        </button>
                    </div>
                    <br>
                    <div class="card">
                        <div class="card-header">
                            <i class="bi bi-info-circle"></i> Information
                        </div>
                        <div class="card-body">
                            <ul class="list-group list-group-flush">
                                <li class="list-group-item d-flex justify-content-between">
                                    <span>ID</span>
                                    <span style="font-size: smaller;">{{problem.data._id}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-clock"></i></span>
                                    <span style="font-size: smaller;">{{problem.data.time_limit}}ms</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-hdd"></i></span>
                                    <span style="font-size: smaller;">{{problem.data.memory_limit}}MB</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-code-slash"></i></span>
                                    <span style="font-size: smaller;">{{problem.data.io_mode.io_mode}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-person-circle"></i></span>
                                    <span style="font-size: smaller;">{{problem.data.created_by.username}}</span>
                                </li>
                                <li class="list-group-item d-flex justify-content-between">
                                    <span><i class="bi bi-star"></i></span>
                                    <span v-html="difficulty_tag(problem.data.difficulty)"></span>
                                </li>
                                <li class="list-group-item">
                                    <span>Tags</span>
                                    <div class="d-flex flex-wrap">
                                        <div style="padding: 3px" v-for="tag in problem.data.tags" :key="tag">
                                            <span role="button" class="badge bg-primary">{{ tag }}</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <br>
                    <div class="card" v-if="problem.data.submission_number != 0">
                        <div class="card-header">
                            <i class="bi bi-pie-chart"></i> Statistic
                        </div>
                        <div class="card-body">
                            <Chart Type="doughnut" :ChartData="donught_data()" :Options="donught_options" />
                            <!--
                            <Pie :data="donught_data()" :option="donught_options" class="d-block d-lg-none d-xl-none d-xxl-none"/>
                            <Pie :data="donught_data()" class="d-none d-lg-block d-xl-block d-xxl-block" />
                            -->
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
//import {parse} from 'node-html-parser'
import CodeMirror from '@/components/CodeMirror.vue'
import Chart from '@/components/MyChart.vue'

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
                responsive: true,
                plugins:{
                    legend: {
                        position: "bottom",
                        align: "start"
                    },
                    tooltip:{
                        callbacks: {
                            label: (tooltipItems) => {
                                let stats = tooltipItems.dataset.data
                                let total = 0
                                for(let i in stats){
                                    total += stats[i]
                                }
                                return " " + tooltipItems.label + ": " + tooltipItems.raw + "(" + (tooltipItems.raw * 100 / total).toFixed(2) + "%)"
                            }
                        }
                    }
                }
                
            },
        }
    },
    components:{
        CodeMirror,
        Chart,
    },
    created(){
        this.thisid = this.$route.params.pid
        this.$http.get(window.location.origin + this.problem_url).then(response => {
            this.problem = response.data
            window.document.title = this.$store.state.site.data.website_name_shortcut + ' | ' + this.problem.data.title
            /*
            let root = parse(this.problem.data.description)
            for(let i in root.querySelectorAll("img")){
                root.querySelectorAll("img")[i].removeAttribute("width")
                root.querySelectorAll("img")[i].removeAttribute("height")
                root.querySelectorAll("img")[i].setAttribute("class", "img-fluid")
            }
            this.problem.data.description = root.toString().replace(/\u00A0/g, " ");
            */
        })
    },
    methods:{
        difficulty_tag(difficulty){
            if(difficulty == "High"){
                return '<span class="badge bg-warning">High</span>'
            }else if(difficulty == "Mid"){
                return '<span class="badge bg-primary">Mid</span>'
            }
            return '<span class="badge bg-success">Low</span>'
        },
        doCopy: function (text) {
            let vue = this
            this.$copyText(text).then(function () {
                vue.$success('Code coppied!')
            }, function () {
                vue.$error('Fail coppying!')
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
        },
        edit(id){
            if(this.$route.params.id != undefined){
                this.$router.push({ path: '/admin/contest/' + this.$route.params.id + '?problem_id=' + id})
            }else{
                this.$router.push({ path: '/admin/problem?problem_id=' + id})
            }
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