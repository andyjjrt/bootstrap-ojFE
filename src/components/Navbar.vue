<template>
    <div>
        <div class="modal fade" id="exampleModal" ref="login_modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Login</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="floatingInput" placeholder="username" v-model="username">
                            <label for="floatingInput">Username</label>
                        </div>
                        <div class="form-floating">
                            <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
                            <label for="floatingPassword">Password</label>
                        </div>
                        <div class="p-3"  v-if="login_error">
                            <div class="alert alert-danger" role="alert">
                                {{ login_error }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="login">Login</button>
                    </div>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-expand-sm navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">{{ nav_brand }}</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="nav_collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link" @click.native="toggle_collapse">Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/problem" class="nav-link" @click.native="toggle_collapse">Problem</router-link>
                        </li>
                    </ul>
                    <form class="d-flex">
                        <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#exampleModal" v-if="profile == null || profile.data == null">
                            Login
                        </button>
                        <div v-else>
                            <div class="dropdown sm-no-display">
                                <a role="button" class="navbar-brand" id="dropdownMenuLink" ref="drop_profile" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img :src="custom_avatar(profile.data.avatar)" width="40" class="rounded-circle" v-if="profile.data.avatar">
                                    <img :src="default_avatar" width="40" class="rounded-circle" v-else>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end">
                                    <li><h6 class="dropdown-header">{{profile.data.user.username}}</h6></li>
                                    <li><a class="dropdown-item" role="button" @click="logout">Logout</a></li>
                                </ul>
                            </div>
                            <div class="dropdown sm-display">
                                <a role="button" class="navbar-brand" id="dropdownMenuLink" ref="drop_profile" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img :src="custom_avatar(profile.data.avatar)" width="40" class="rounded-circle" v-if="profile.data.avatar">
                                    <img :src="default_avatar" width="40" class="rounded-circle" v-else>
                                </a>
                                <ul class="dropdown-menu dropdown-menu">
                                    <li><h6 class="dropdown-header">{{profile.data.user.username}}</h6></li>
                                    <li><a class="dropdown-item" role="button" @click="logout">Logout</a></li>
                                </ul>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </nav>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
import Collapse from 'bootstrap/js/dist/collapse.js'
import Dropdown from 'bootstrap/js/dist/dropdown.js'

export default {
    data(){
        return{
            LoginModal : null,
            NavCollapse: null,
            DropProfile: null,
            username: "",
            password:"",
            login_error: null,
            
        }
    },
    mounted(){
        this.LoginModal = new Modal(this.$refs.login_modal)
        this.NavCollapse = new Collapse(this.$refs.nav_collapse, {toggle: false})
        if(this.profile != null && this.profile.data != null){
            this.DropProfile = new Dropdown(this.$refs.drop_profile)
        }
        
    },
    computed:{
        nav_brand(){
            if(this.$store.state.site.data){
                return this.$store.state.site.data.website_name
            }
            return ""
        },
        profile(){
            return this.$store.state.profile
        }
    },
    methods:{
        login(){
            this.login_error = null
            this.$http.post(window.location.origin + '/api/login', {username: this.username, password: this.password})
            .then((res) => {
                if(res.data.error == "error"){
                    this.login_error = res.data.data
                    return
                }
                this.LoginModal.toggle()
                this.$http.get(window.location.origin + "/api/profile").then((response) => {
                    console.log(response.data);
                    this.$store.commit('get_profile', response.data)
                    this.$message.success({
                        message: "Welcome back to OJ",
                        duration : 1500
                    })
                });
            })
            .catch((error) => {
                console.error(error)
                this.LoginModal.toggle()
            })
        },
        logout(){
            this.$http.get(window.location.origin + '/api/logout').then((response) => {
                console.log(response.data);
                this.$store.commit('get_profile', response.data)
            });
        },
        default_avatar(){
            return window.location.origin + "/public/avatar/default.png"
        },
        custom_avatar(src){
            return window.location.origin + src
        },
        toggle_collapse(){
            this.NavCollapse.hide()
        }
    }
}
</script>

<style>
  .sm-no-display{
    display: none;
  }
  .sm-display{
    display: block;
  }
  @media (min-width: 576px) {
    .sm-no-display{
      display: block;
    }
    .sm-display{
      display: none;
    }
  }
</style>