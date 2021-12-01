<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col">
                <ProblemList :select_tag="select_tag" />
            </div>
            <div class="col-3 d-none d-sm-none d-md-block">
                <div class="card">
                    <div class="card-body">
                        <h4 class="card-title">Tags</h4>
                        <div class="d-flex flex-wrap" v-if="tags">
                            <div style="padding: 3px" v-for="tag in tags.data" :key="tag.id">
                                <button type="button" class="btn btn-primary btn-sm" v-if="select_tag == tag.name" @click="select_tag_func(tag.name)">{{ tag.name }}</button>
                                <button type="button" class="btn btn-outline-primary btn-sm" v-else @click="select_tag_func(tag.name)">{{ tag.name }}</button>
                            </div>
                        </div>
                        <div class="d-flex justify-content-center" v-else>
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-grid gap-2">
                            <button class="btn btn-light text-black" type="button" @click="pick_one"><i class="bi bi-shuffle"></i>&nbsp;Pick one</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProblemList from '@/components/Problemlist.vue'
export default {
    name:"PublicProblemList",
    data(){
        return{
            problems: null,
            tags: null,
            total: 0,
            select_tag: "",
            page: 1,
        }
    },
    components:{
        ProblemList
    },
    created() {
        this.init()
        this.$http.get(window.location.origin + '/api/problem/tags').then(response => {
            this.tags = response.data
        });
    },
    methods:{
        init(){
            this.select_tag = this.$route.query.tag
            if(this.select_tag == undefined){
                this.select_tag = ""
            }else{
                this.select_tag = this.$route.query.tag
            }
        },
        select_tag_func(name){
            if(this.select_tag == name){
                this.select_tag = ""
            }else{
                this.select_tag = name
            }
            let que = {}
            que.page = 1
            que.tag = this.select_tag != "" ? this.select_tag : undefined
            this.$router.push({ path: 'problem', query: que})
        },
        pick_one(){
            this.$http.get(window.location.origin + '/api/pickone').then(response => {
                this.$router.push({ name: 'Problem', params: { pid:response.data.data }})
                this.$success('Good luck')
            });
        }
    },
    watch:{
        '$route.query.tag'(){
            this.init()
        }
    }
}
</script>

<style scoped>
</style>
