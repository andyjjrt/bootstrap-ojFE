<template>
    <div>
        <Cropper/>
        <br>
        <div class="card card-body">
            <h3>Profile</h3>
            <form action="#" @submit.prevent="update_profile">
                <div class="row row-cols-1 row-cols-md-2">
                    <div class="col">
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="realname" placeholder="Real name" v-model="profile.data.real_name">
                            <label for="realname">Real name</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3 col">
                            <input type="text" class="form-control" id="mood" placeholder="Mood" v-model="profile.data.mood">
                            <label for="mood">Mood</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3 col">
                            <input type="text" class="form-control" id="school" placeholder="School" v-model="profile.data.school">
                            <label for="school">School</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3 col">
                            <input type="text" class="form-control" id="blog" placeholder="Blog" v-model="profile.data.blog">
                            <label for="blog">Blog</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3 col">
                            <input type="text" class="form-control" id="major" placeholder="Major" v-model="profile.data.major">
                            <label for="major">Major</label>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-floating mb-3 col">
                            <input type="text" class="form-control" id="github" placeholder="Github" v-model="profile.data.github">
                            <label for="github">Github</label>
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary" :class="{'disabled': submit_status}">Update</button>
            </form>
        </div>
    </div>
</template>

<script>
import Cropper from '@/components/Cropper.vue'
export default {
    name:"Profile",
    data(){
        return{
            profile:null,
            submit_status: false
        }
    },
    components:{
        Cropper
    },
    computed:{
        get_profile(){
            return this.$store.state.profile
        }
    },
    created(){
        this.profile = this.get_profile
    },
    methods:{
        update_profile(){
            this.submit_status = true
            this.$http.put(window.location.origin + '/api/profile', {
                blog: this.profile.data.blog,
                github: this.profile.data.github,
                language: "en-US",
                major: this.profile.data.major,
                mood: this.profile.data.mood,
                real_name: this.profile.data.real_name,
                school: this.profile.data.school
            }).then(response => {
                if(!response.data.error){
                    this.$message.success({
                        message: "Change Profile Successfully!",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.$store.commit('get_profile', response.data)
                    this.profile = response.data
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
                this.submit_status = false
            })
        }
    }
}
</script>

<style>

</style>