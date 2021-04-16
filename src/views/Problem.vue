<template>
    <div class="container" v-if="problem">
        <div>
            <h3>{{problem.data.title}}</h3>
            <hr>
            <h4>Description</h4>
            <div v-html="problem.data.description" class="p-4"></div>
            <h4>Input</h4>
            <div v-html="problem.data.input_description" class="p-4"></div>
            <h4>Output</h4>
            <div v-html="problem.data.output_description" class="p-4"></div>
            <div class="row" v-for="tests in problem.data.samples" :key="tests.input">
                <div class="col-sm">
                    <h4>Input</h4>
                    <div class="p-4">{{tests.input}}</div>
                </div>
                <div class="col-sm">
                    <h4>Output</h4>
                    <div class="p-4">{{tests.output}}</div>
                </div>
            </div>
        </div>
        {{ problem.data }}
    </div>
</template>

<script>
import { parse } from 'node-html-parser';

export default {
    name:"problem_page",
    data(){
        return{
            thisid:"",
            problem:null,
        }
    },
    created(){
        this.thisid = this.$route.params.id
        this.$http.get(window.location.origin + '/api/problem?problem_id=' + this.thisid).then(response => {
            this.problem = response.data
            let root = parse(this.problem.data.description)
            for(let i in root.querySelectorAll("img")){
                root.querySelectorAll("img")[i].removeAttribute("width")
                root.querySelectorAll("img")[i].removeAttribute("height")
                root.querySelectorAll("img")[i].setAttribute("class", "img-fluid")
                console.log(root.querySelectorAll("img")[i])
            }
            this.problem.data.description = root.toString();
        })
    }
}
</script>

<style>

</style>