<template>
    <div v-if="profile" class="container-fluid">
        <div v-if="profile.user.admin_type == 'Admin' || profile.user.admin_type == 'Super Admin'">
            <div>
                <div class="row">
                    <div class="col-lg-3">
                        <div class="card card-body d-none d-lg-block">
                            <span class="d-flex pb-3 mb-3 border-bottom fs-5 fw-semibold">Admin</span>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin'" class="link-dark rounded fw-bold" :class="{'active':check_active('DashBoard')}"><i class="bi bi-palette-fill" style="padding-right: 5px;"></i>Dashboard</router-link>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1">
                                    <button class="btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                                        General
                                    </button>
                                    <div class="collapse show" id="home-collapse">
                                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                            <li><router-link :to="'/admin/users'" class="link-dark rounded" :class="{'active':check_active('Users')}"><i class="bi bi-people-fill" style="padding-right: 5px;"></i>Users</router-link></li>
                                            <li><router-link :to="'/admin/announce'" class="link-dark rounded" :class="{'active':check_active('Announce')}"><i class="bi bi-megaphone-fill" style="padding-right: 5px;"></i>Announce</router-link></li>
                                            <li><router-link :to="'/admin/config'" class="link-dark rounded" :class="{'active':check_active('Config')}"><i class="bi bi-wrench" style="padding-right: 5px;"></i>Config</router-link></li>
                                            <li><router-link :to="'/admin/judgeserver'" class="link-dark rounded" :class="{'active':check_active('Judge Server')}"><i class="bi bi-server" style="padding-right: 5px;"></i>Judge Server</router-link></li>
                                            <li><router-link :to="'/admin/prunetestcase'" class="link-dark rounded" :class="{'active':check_active('Prune Testcase')}"><i class="bi bi-safe-fill" style="padding-right: 5px;"></i>Prune testcase</router-link></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin/problem'" class="link-dark rounded fw-bold" :class="{'active':check_active('Problem')}"><i class="bi bi-grid-3x3-gap-fill" style="padding-right: 5px;"></i>Problem</router-link>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin/contest'" class="link-dark rounded fw-bold" :class="{'active':check_active('ContestList')}"><i class="bi bi-trophy-fill" style="padding-right: 5px;"></i>Contest</router-link>
                                </li>
                            </ul>
                        </div>
                        <div class="mb-3 d-block d-lg-none">
                            <div class="card card-body">
                                <div class="d-flex justify-content-between">
                                    <h4>Admin</h4>
                                    <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        Menu
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-9">
                        <router-view />
                    </div>
                </div>
            </div>
        </div>
        <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Admin</h5>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body">
                <ul class="list-unstyled ps-0">
                    <li class="mb-1 btn-toggle-nav">
                        <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                            <router-link :to="'/admin'" class="link-dark rounded fw-bold" :class="{'active':check_active('DashBoard')}"><i class="bi bi-palette-fill" style="padding-right: 5px;"></i>Dashboard</router-link>
                        </span>
                    </li>
                </ul>
                <ul class="list-unstyled ps-0">
                    <li class="mb-1">
                        <button class="btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                            General
                        </button>
                        <div class="collapse show" id="home-collapse">
                            <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                <li>
                                    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        <router-link :to="'/admin/users'" class="link-dark rounded" :class="{'active':check_active('Users')}"><i class="bi bi-people-fill" style="padding-right: 5px;"></i>Users</router-link>
                                    </span>
                                </li>
                                <li>
                                    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        <router-link :to="'/admin/announce'" class="link-dark rounded" :class="{'active':check_active('Announce')}"><i class="bi bi-megaphone-fill" style="padding-right: 5px;"></i>Announce</router-link>
                                    </span>
                                </li>
                                <li>
                                    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        <router-link :to="'/admin/config'" class="link-dark rounded" :class="{'active':check_active('Config')}"><i class="bi bi-wrench" style="padding-right: 5px;"></i>Config</router-link>
                                    </span>
                                </li>
                                <li>
                                    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        <router-link :to="'/admin/judgeserver'" class="link-dark rounded" :class="{'active':check_active('Judge Server')}"><i class="bi bi-server" style="padding-right: 5px;"></i>Judge Server</router-link>
                                    </span>
                                </li>
                                <li>
                                    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                                        <router-link :to="'/admin/prunetestcase'" class="link-dark rounded" :class="{'active':check_active('Prune Testcase')}"><i class="bi bi-safe-fill" style="padding-right: 5px;"></i>Prune testcase</router-link>
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
                <ul class="list-unstyled ps-0">
                    <li class="mb-1 btn-toggle-nav">
                        <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                            <router-link :to="'/admin/problem'" class="link-dark rounded fw-bold" :class="{'active':check_active('Problem')}"><i class="bi bi-grid-3x3-gap-fill" style="padding-right: 5px;"></i>Problem</router-link>
                        </span>
                    </li>
                </ul>
                <ul class="list-unstyled ps-0">
                    <li class="mb-1 btn-toggle-nav">
                        <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions">
                            <router-link :to="'/admin/contest'" class="link-dark rounded fw-bold" :class="{'active':check_active('ContestList')}"><i class="bi bi-trophy-fill" style="padding-right: 5px;"></i>Contest</router-link>
                        </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import Offcanvas from 'bootstrap/js/dist/offcanvas.js'
export default {
    name:"Admin",
    computed:{
        profile(){
            return this.$store.state.profile.data
        }
    },
    created(){
        this.seeroute = this.$route.meta.admin
        if(this.profile == null){
            this.$message.error({
                message: "Please login first",
                duration : 1500,
                zIndex: 1000000
            })
            this.$router.push({ name: 'Home'})
        }else if(this.profile.user.admin_type != 'Admin' && this.profile.user.admin_type != 'Super Admin'){
            this.$message.error({
                message: "Please login first",
                duration : 1500,
                zIndex: 1000000
            })
            this.$router.push({ name: 'Home'})
        }
    },
    mounted(){
        var offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'))
        offcanvasElementList.map(function (offcanvasEl) {
            return new Offcanvas(offcanvasEl)
        })
    },
    methods:{
        check_active(name){
            if(this.seeroute == name){
                return true
            }
            return false
        },
    },
    watch:{
        $route(to){
            this.seeroute = to.meta.admin
        }
    }
}
</script>

<style>
    .btn-toggle{
        display: inline-flex;
        align-items: center;
        padding: .25rem .5rem;
        font-weight: 600;
        color: rgba(0, 0, 0, .65);
        background-color: transparent;
        border: 0;
    }
    .btn-toggle:hover,
    .btn-toggle:focus {
        color: rgba(0,0,0,1);
    }

    .btn-toggle::before {
        width: 1.25em;
        line-height: 0;
        content: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='rgba%280,0,0,.5%29' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 14l6-6-6-6'/%3e%3c/svg%3e");
        transition: transform .35s ease;
        transform-origin: .5em 50%;
    }

    
    .btn-toggle[aria-expanded="true"]::before {
        color: rgba(255, 255, 255, 0.85);
        transform: rotate(90deg);
    }

    .btn-toggle-nav a {
        display: inline-flex;
        padding: .1875rem .5rem;
        margin-top: .125rem;
        margin-left: 1.25rem;
        text-decoration: none;
    }
    .btn-toggle-nav a:hover,
    .btn-toggle-nav a:focus
    {
        color: rgba(0,0,0,1);
    }

    .btn-toggle-nav a.active{
        color: rgba(255, 255, 255, 0.85);
        background-color: #4285F4;
    }

    .btn-nav a{
        display: inline-flex;
        align-items: center;
        padding: .25rem .5rem;
        font-weight: 600;
        color: rgba(0, 0, 0, .65);
        background-color: transparent;
        border: 0;
    }

    .btn-nav a:hover,
    .btn-nav a:focus
    {
        color: rgba(0,0,0,1);
    }

    .btn-nav a.active{
        color: rgba(255, 255, 255, 0.85);
        background-color: #4285F4;
    }
</style>