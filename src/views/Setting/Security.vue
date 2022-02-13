<template>
    <div>
        <div class="modal fade" ref="modal" id="confirm_modal" tabindex="-1" aria-labelledby="confirmLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="comfirmLabel">Warning</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure to revoke the session?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-warning" data-bs-dismiss="modal" @click="clear_session(selected_session)">Revoke</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" ref="close2fa_modal" id="close2fa_modal" tabindex="-1" aria-labelledby="close2faLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="close2faLabel">Comfirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Two-factor Authentication is a powerful tool to protect your account, are you sure to close it?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="close2fa">Close 2FA</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card card-body">
            <div class="d-flex justify-content-center" v-if="!sessions || !two_fac_auth_img">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-lg-6">
                    <h3>Sessions</h3>   
                    <ul class="list-group list-group-flush py-2">
                        <div v-for="session in sessions.data" :key="session.session_key">
                            <div role="button" class="list-group-item" :style="{'background-color': current(session)}" :data-bs-toggle="session.current_session ? '' : 'modal'" data-bs-target="#confirm_modal" @click="selected_session = session">
                                <div class="d-flex justify-content-between">
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
                    <br>
                </div>
                <div class="col-lg-6">
                    <h3>Two Factor Authentication</h3>
                    <template v-if="!$store.state.profile.data.user.two_factor_auth">
                        <img v-if="two_fac_auth_img" :src="two_fac_auth_img" class="img-fluid" style="max-height: 300px;">
                        <form class="p-1" @submit.prevent="open2fa">
                            <div class="mb-3">
                                <input type="text" class="form-control" placeholder="Two Factor Authentication code" v-model="open2fa_code">
                            </div>
                            <button class="btn btn-primary" type="submit">Open 2FA</button>
                        </form>
                    </template>  
                    <template v-else>
                        <div class="alert alert-success d-flex align-items-center" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-triangle-fill flex-shrink-0 me-2" viewBox="0 0 16 16" role="img" aria-label="Warning:">
                                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                            </svg>
                            <div>You have enabled two-factor authentication</div>
                        </div>
                        <form class="p-1" @submit.prevent="close2fa_modal.toggle()">
                            <div class="mb-3">
                                <input type="text" class="form-control" placeholder="Two Factor Authentication code" v-model="close2fa_.code">
                            </div>
                            <button class="btn btn-danger" type="submit" :disabled="close2fa_.loading">Close 2FA</button>
                        </form>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
let UA = require('user-agent-parse')
export default {
    name:"Profile",
    data(){
        return{
            sessions: null,
            selected_session: "",
            two_fac_auth_img: null,
            open2fa_code: "",
            close2fa_: {
                code: "",
                loading: false,
            },
            modal: null,
            close2fa_modal: null
        }
    },
    created(){
        this.get_session()
        this.get_2fa()
    },
    mounted(){
        this.modal = new Modal(this.$refs.modal)
        this.close2fa_modal = new Modal(this.$refs.close2fa_modal)
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
        get_2fa(){
            this.$http.get(window.location.origin + "/api/two_factor_auth").then((response) => {
                this.two_fac_auth_img = response.data.data
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
                this.$success("Currently using!")
                return
            }
            this.$http.delete(window.location.origin + "/api/sessions?session_key=" + session.session_key).then((response) => {
                if(!response.data.error){
                    this.$success("Delete Successfully")
                    this.get_session()
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        open2fa() {
            this.$http.post(window.location.origin + "/api/two_factor_auth", {code: this.open2fa_code}).then((response) => {
                this.open2fa_code = ""
                if(!response.data.error){
                    this.$success("You have enabled two-factor authentication")
                    this.$http.get(window.location.origin + "/api/profile").then((response) => {
                        this.$store.commit('get_profile', response.data)
                    });
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        close2fa() {
            this.close2fa_.loading = true
            this.$http.put(window.location.origin + "/api/two_factor_auth", {code: this.close2fa_.code}).then((response) => {
                this.close2fa_.loading = false
                this.close2fa_.code = ""
                if(!response.data.error){
                    this.$success("Success")
                    this.$http.get(window.location.origin + "/api/profile").then((response) => {
                        this.$store.commit('get_profile', response.data)
                    });
                    this.get_2fa()
                }else{
                    this.$error(response.data.data)
                }
            });
        }
    }
}
</script>

<style>

</style>