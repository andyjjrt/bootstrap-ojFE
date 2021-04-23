<template>
    <div class="card card-body">
        <div class="row">
            <div class="col-md">
                <h3>Change Password</h3>
                <form action="#" @submit.prevent="change_pass()">
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="OldPassword" placeholder="Old Password" v-model="oldp">
                        <label for="OldPassword">Old Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="NewPassword" placeholder="New Password" v-model="newp">
                        <label for="NewPassword">New Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="NewPassword1" placeholder="New Password1" v-model="c_newp">
                        <label for="NewPassword1">Confirm New Password</label>
                    </div>
                    <button type="submit" class="btn btn-primary" :class="{'disabled' : change_pass_btn}">Change</button>
                </form>
                <br>
            </div>
            <div class="col-md">
                <h3>Change Email</h3>
                <form action="#" @submit.prevent="change_email()">
                    <div class="form-floating mb-3">
                        <input type="password" class="form-control" id="Password" placeholder="Password" v-model="oldp_email">
                        <label for="Password">Password</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="OldEmail" placeholder="Old Email" v-model="old_email" disabled>
                        <label for="OldEmail">Old Email</label>
                    </div>
                    <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="NewEmail" placeholder="New Email" v-model="new_email">
                        <label for="NewEmail">New Email</label>
                    </div>
                    <button type="submit" class="btn btn-primary" :class="{'disabled' : change_email_btn}">Change</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"Profile",
    data(){
        return{
            change_pass_btn: false,
            change_email_btn: false,
            newp:"",
            c_newp:"",
            oldp:"",
            new_email:"",
            old_email:"",
            oldp_email:""
        }
    },
    created(){
        this.old_email = this.$store.state.profile.data.user.email
    },
    methods:{
        change_pass(){
            if(this.newp != this.c_newp || this.newp == "" || this.c_newp == "" || this.oldp == ""){
                this.$message.error({
                    message: "Empty box or confirm fail",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            this.change_pass_btn = true
            this.$http.post(window.location.origin + '/api/change_password', {old_password: this.oldp, new_password: this.newp}).then(response => {
                this.change_pass_btn = false
                if(!response.data.error){
                    this.$message.success({
                        message: "Change Password Successfully!",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.$message.success({
                        message: "Log out soon...",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.$http.get(window.location.origin + '/api/logout').then((response) => {
                        this.$store.commit('get_profile', response.data)
                        this.$router.push({ name: 'Home'})
                    });
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            });
        },
        change_email(){
            if(this.new_email == "" || this.oldp_email == ""){
                this.$message.error({
                    message: "Empty box or confirm fail",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            this.change_email_btn = true
            this.$http.post(window.location.origin + '/api/change_email', {password: this.oldp_email, new_email: this.new_email, old_email: this.new_email}).then(response => {
                if(!response.data.error){
                    this.oldp_email = ""
                    this.new_email = ""
                    this.$message.success({
                        message: "Change Email Successfully!",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.$http.get(window.location.origin + '/api/profile').then((response) => {
                        this.$store.commit('get_profile', response.data)
                        this.old_email = response.data.data.user.email
                        this.change_email_btn = false
                        
                    });
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.change_email_btn = false
                }

            });
        }
    }
}
</script>

<style>

</style>