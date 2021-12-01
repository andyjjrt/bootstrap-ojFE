<template>
    <div>
        <div v-if="response">
            <div class="card card-body">
                <div :class="'alert alert-' + $store.state.status_list[response.data.result].type" role="alert">
                    <h3>{{$store.state.status_list[response.data.result].name}}</h3>
                    <div v-if="response.data.statistic_info.err_info">
                        <pre><code>{{response.data.statistic_info.err_info}}</code></pre>
                    </div>
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4" v-else>
                        <div class="col">
                            Time: {{response.data.statistic_info.time_cost}}ms
                        </div>
                        <div class="col">
                            Memory: {{ parseInt(response.data.statistic_info.memory_cost/1048576)+1 }}MB
                        </div>
                        <div class="col">
                            Language: {{response.data.language}}
                        </div>
                        <div class="col">
                            Author: {{response.data.username}}
                        </div>
                    </div>
                </div>
                <div v-if="response.data.info && !response.data.statistic_info.err_info">
                    <ul class="list-group list-group-flush text-center">
                        <div class="list-group-item">
                            <div class="row p-1">
                                <span class="col-1">#</span>
                                <span class="col">status</span>
                                <span class="col d-none d-md-block d-lg-block d-xl-block d-xxl-block">memory</span>
                                <span class="col d-none d-md-block d-lg-block d-xl-block d-xxl-block">time</span>
                                <span v-if="response.data.statistic_info.score" class="col">score</span>
                            </div>
                        </div>
                        <div class="list-group-item" v-for="stat in response.data.info.data" :key="stat.test_case">
                            <div class="row p-1">
                                <span class="col-1">{{stat.test_case}}</span>
                                <span class="col d-none d-sm-block"><span :class="'badge bg-' + $store.state.status_list[stat.result].type">{{$store.state.status_list[stat.result].name}}</span></span>
                                <span class="col d-block d-sm-none"><span :class="'badge bg-' + $store.state.status_list[stat.result].type">{{$store.state.status_list[stat.result].short}}</span></span>
                                <span class="col d-none d-md-block d-lg-block d-xl-block d-xxl-block">{{parseInt(stat.memory/1048576)+1}}MB</span>
                                <span class="col d-none d-md-block d-lg-block d-xl-block d-xxl-block">{{stat.real_time}}ms</span>
                                <span v-if="response.data.statistic_info.score" class="col">{{stat.score}}</span>
                            </div>
                        </div>
                    </ul>
                </div>
            </div>
            <br>
            <div class="card card-body">
                <pre v-highlightjs="response.data.code">
                    <code :class="response.data.language" />
                </pre>
            </div>
            <div class="py-3 d-flex flex-row-reverse" v-if="response.data.can_unshare">
                <button class="btn" @click="share" :class="{'btn-warning' : response.data.shared, 'btn-primary' : !response.data.shared, 'disabled':share_btn_disabled}">
                    {{response.data.shared == true ? 'Unshare' : 'Share'}}
                </button>
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
export default {
    name:"Status",
    props:{
        id: String
    },
    data(){
        return{
            response: null,
            share_btn_disabled: false
        }
    },
    created(){
        this.init()
    },
    methods:{
        init(){
            this.$http.get(window.location.origin + "/api/submission?id=" + this.id).then((response) => {
                this.response = response.data
                this.share_btn_disabled = false
            });
        },
        share(){
            this.share_btn_disabled = true;
            this.$http.put(window.location.origin + "/api/submission", {id: this.response.data.id, shared: !this.response.data.shared}).then((response) => {
                this.init()
                response.data.error ? this.$error(response.data.data) :this.$success('Succeed')
            });
        }
    }
}
</script>

<style>

</style>