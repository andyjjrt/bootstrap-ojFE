<template>
    <div v-if="profile" class="container-fluid">
        <div v-if="profile.user.admin_type == 'Admin' || profile.user.admin_type == 'Super Admin'">
            <div class="d-none d-md-block d-lg-block d-xl-block d-xxl-block">
                <div class="row">
                    <div class="col-3">
                        <div class="p-3 bg-white">
                            <span class="d-flex pb-3 mb-3 border-bottom fs-5 fw-semibold">Admin</span>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin'" class="link-dark rounded fw-bold" :class="{'active':check_active('DashBoard')}">Dash Board</router-link>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1">
                                    <button class="btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                                        General
                                    </button>
                                    <div class="collapse show" id="home-collapse">
                                        <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                                            <li><router-link :to="'/admin/users'" class="link-dark rounded" :class="{'active':check_active('Users')}">Users</router-link></li>
                                            <li><router-link :to="'/admin/announce'" class="link-dark rounded" :class="{'active':check_active('Announce')}">Announce</router-link></li>
                                            <li><router-link :to="'/admin/config'" class="link-dark rounded" :class="{'active':check_active('Config')}">Config</router-link></li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin/problem'" class="link-dark rounded fw-bold" :class="{'active':check_active('Problem')}">Problem</router-link>
                                </li>
                            </ul>
                            <ul class="list-unstyled ps-0">
                                <li class="mb-1 btn-toggle-nav">
                                    <router-link :to="'/admin/contest'" class="link-dark rounded fw-bold" :class="{'active':check_active('ContestList')}">Contest</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-9">
                        <router-view />
                    </div>
                </div>
            </div>
            <div class="d-block d-md-none d-lg-none d-xl-none d-xxl-none text-center">
                <h5>
                    你可以考慮用電腦
                </h5>
                <br>
                <img :src="require('@/assets/too_small.jpg')" class="img-fluid w-75">
            </div>
        </div>
    </div>
</template>

<script>
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