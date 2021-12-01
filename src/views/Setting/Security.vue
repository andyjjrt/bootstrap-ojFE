<template>
    <div>
        <div class="modal fade" id="confirm_modal" tabindex="-1" aria-labelledby="confirmLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="comfirmLabel">Modal title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        ...
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card card-body">
            <div v-if="sessions">
                <ul class="list-group list-group-flush">
                    <div v-for="session in sessions.data" :key="session.session_key">
                        <div role="button" class="list-group-item" :style="{'background-color': current(session)}" @click="clear_session(session)">
                            <div class="fs-5 d-flex justify-content-between">
                                <div class="d-flex">
                                    <i class="bi bi-laptop" v-if="get_UA(session.user_agent).device_type == 'desktop'"></i>
                                    <i class="bi bi-phone" v-else></i>
                                    <span>{{session.ip}}</span>
                                    <div class="d-none d-lg-block d-xl-block d-xxl-block"> on {{get_UA(session.user_agent).os}},{{get_UA(session.user_agent).name}}</div>
                                </div>
                                <div class="d-none d-sm-block">
                                    {{new Date(session.last_activity).toLocaleString()}}
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </div>
            <div class="d-flex justify-content-center" v-else>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
let UA = require('user-agent-parse')
export default {
    name:"Profile",
    data(){
        return{
            sessions: null
        }
    },
    created(){
        this.get_session()
    },
    methods:{
        get_session(){
            this.$http.get(window.location.origin + "/api/sessions").then((response) => {
                this.sessions = response.data
                if(!response.data.error){
                    this.sessions.data.sort(function(a,b){
                        if(!a.current_session){
                            return 1
                        }else{
                            return new Date(a.last_activity) < new Date(b.last_activity)?1:-1
                        }
                    })
                }
            });
        },
        get_UA(string){
            return UA.parse(string)
        },
        current(session){
            if(session.current_session){
                return '#00c85140'
            }
            return '#ffffff'
        },
        clear_session(session){
            if(session.current_session){
                return
            }
            this.$http.delete(window.location.origin + "/api/sessions?session_key=" + session.session_key).then((response) => {
                if(!response.data.error){
                    this.$message.success({
                        message: "Delete Successfully",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.get_session()
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            });
        }
    }
}
</script>

<style>

</style>