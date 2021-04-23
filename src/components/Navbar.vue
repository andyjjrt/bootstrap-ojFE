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
                        <form @submit.prevent="login" action="#">
                            <div class="mb-3">
                                <div class="form-floating mb-3">
                                    <input type="text" class="form-control" id="floatingInput" placeholder="username" v-model="username">
                                    <label for="floatingInput">Username</label>
                                </div>
                            </div>
                            <div class="mb-3">
                                <div class="form-floating">
                                    <input type="password" class="form-control" id="floatingPassword" placeholder="Password" v-model="password">
                                    <label for="floatingPassword">Password</label>
                                </div>
                            </div>
                            <div class="p-3"  v-if="login_error">
                                <div class="alert alert-danger" role="alert">
                                    {{ login_error }}
                                </div>
                            </div>
                            <button type="submit" class="d-none">Login</button>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="login" :class="{'disabled': login_btn}">Login</button>
                    </div>
                </div>
            </div>
        </div>
        <nav class="navbar navbar-expand-md navbar-light fixed-top" style="background-color: #f4f4f4;">
            <div class="container-fluid">
                <router-link to="/" class="navbar-brand" @click.native="toggle_collapse">{{ nav_brand }}</router-link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent" ref="nav_collapse">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <router-link to="/" class="nav-link" @click.native="toggle_collapse" :class="{'active':check_active('Home')}"><i class="bi bi-house" style="padding: 0px 6px;"></i>Home</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/problem" class="nav-link" @click.native="toggle_collapse" :class="{'active':check_active('Problem')}"><i class="bi bi-grid-3x3-gap" style="padding: 0px 6px;"></i>Problem</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/contest" class="nav-link" @click.native="toggle_collapse" :class="{'active':check_active('Contest')}"><i class="bi bi-trophy" style="padding: 0px 6px;"></i>Contest</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/status" class="nav-link" @click.native="toggle_collapse" :class="{'active':check_active('Status')}"><i class="bi bi-graph-up" style="padding: 0px 6px;"></i>Status</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link to="/judger" class="nav-link" @click.native="toggle_collapse" :class="{'active':check_active('Judger')}"><i class="bi bi-info-circle" style="padding: 0px 6px;"></i>Judger</router-link>
                        </li>
                    </ul>
                    <form class="d-flex">
                        <div v-if="profile != null">
                            <div v-if="profile.data == null">
                                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Login
                                </button>
                            </div>
                            <div v-else>
                                <div class="dropdown d-none d-md-block">
                                    <a role="button" class="navbar-brand" id="dropdownMenuLink" ref="drop_profile" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img :src="custom_avatar(profile.data.avatar)" width="40" class="rounded-circle" v-if="profile.data.avatar">
                                        <img :src="default_avatar" width="40" class="rounded-circle" v-else>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end">
                                        <li><h6 class="dropdown-header">{{profile.data.user.username}}</h6></li>
                                        <li><a class="dropdown-item" role="button" @click="to_user">Home</a></li>
                                        <li><a class="dropdown-item" role="button" @click="to_submission">Submissions</a></li>
                                        <li><a class="dropdown-item" role="button" @click="to_setting">Setting</a></li>
                                        <li><a class="dropdown-item" role="button" href="/admin" v-if="profile.data.user.admin_type == 'Admin' || profile.data.user.admin_type == 'Super Admin'">Management</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" role="button" @click="logout">Logout</a></li>
                                    </ul>
                                </div>
                                <div class="dropdown d-block d-md-none">
                                    <a role="button" class="navbar-brand" id="dropdownMenuLink" ref="drop_profile" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img :src="custom_avatar(profile.data.avatar)" width="40" class="rounded-circle" v-if="profile.data.avatar">
                                        <img :src="default_avatar" width="40" class="rounded-circle" v-else>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu">
                                        <li><h6 class="dropdown-header">{{profile.data.user.username}}</h6></li>
                                        <li><a class="dropdown-item" role="button" @click="to_user">Home</a></li>
                                        <li><a class="dropdown-item" role="button" @click="to_submission">Submissions</a></li>
                                        <li><a class="dropdown-item" role="button" @click="to_setting">Setting</a></li>
                                        <li><a class="dropdown-item" role="button" href="/admin" v-if="profile.data.user.admin_type == 'Admin' || profile.data.user.admin_type == 'Super Admin'">Management</a></li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li><a class="dropdown-item" role="button" @click="logout">Logout</a></li>
                                    </ul>
                                </div>
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
            top_route: null,
            login_btn: false
        }
    },
    mounted(){
        this.LoginModal = new Modal(this.$refs.login_modal)
        this.NavCollapse = new Collapse(this.$refs.nav_collapse, {toggle: false})
        if(this.profile != null && this.profile.data != null){
            this.DropProfile = new Dropdown(this.$refs.drop_profile)
        }
        this.top_route = this.$route.meta.title
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
            this.login_btn = true
            this.login_error = null
            this.$http.post(window.location.origin + '/api/login', {username: this.username, password: this.password})
            .then((res) => {
                this.$http.get(window.location.origin + "/api/profile").then((response) => {
                    this.$store.commit('get_profile', response.data)
                });
                this.login_btn = false
                if(res.data.error){
                    this.login_error = res.data.data
                    return
                }
                this.LoginModal.toggle()
                this.toggle_collapse()
                this.$message.success({
                    message: "Welcome back to OJ",
                    duration : 1500,
                    zIndex: 1000000
                })
            })
            .catch((error) => {
                console.error(error)
                this.LoginModal.toggle()
            })
        },
        logout(){
            this.toggle_collapse()
            this.$http.get(window.location.origin + '/api/logout').then((response) => {
                this.$store.commit('get_profile', response.data)
                this.$router.push({ name: 'Home'})
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
        },
        to_user(){
            this.toggle_collapse()
            this.$router.push({ name: 'User'})
        },
        to_submission(){
            this.toggle_collapse()
            this.$router.push({ name: 'Status', query:{myself: 1}})
        },
        to_setting(){
            this.toggle_collapse()
            this.$router.push({ path: '/setting'})
        },
        check_active(name){
            if(this.top_route == name){
                return true
            }
            return false
        },
    },
    watch: {
        $route(to) {
            this.top_route = to.meta.title
            window.document.title = this.$store.state.site.data.website_name_shortcut + ' | ' + to.name
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