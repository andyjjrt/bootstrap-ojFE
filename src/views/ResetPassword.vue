<template>
    <div class="container">
        <div class="card card-body" style="margin:0px auto; max-width: 600px">
            <h3>Reset Password</h3><br>
            <form action="#" @submit.prevent="reset_pass">
                <div class="mb-3">
                    <div class="form-floating">
                        <input type="password" class="form-control" id="password" placeholder="Password" v-model="reset.password">
                        <label for="password">Password</label>
                    </div>
                </div>
                <div class="mb-3">
                    <div class="form-floating">
                        <input type="password" class="form-control" id="con_password" placeholder="Confirm Password" v-model="reset.password_con">
                        <label for="con_password">Confirm Password</label>
                    </div>
                </div>
                <div class="row mb-3">
                    <div class="col-8">
                        <div class="form-floating">
                            <input type="text" class="form-control" id="captcha" placeholder="Captcha" v-model="reset.captcha">
                            <label for="captcha">Captcha</label>
                        </div>
                    </div>
                    <div class="col-4 position-relative">
                        <img :src="reset.captcha_url" class="position-absolute top-50 start-50 translate-middle">
                    </div>
                </div>
                <div class="p-3"  v-if="reset.error">
                    <div class="alert alert-danger" role="alert">
                        {{ reset.error }}
                    </div>
                </div>
                <div class="d-flex flex-row-reverse bd-highlight">
                    <button type="submit" class="btn btn-primary" :class="{'disabled': reset.btn}">Change Password</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name:"ResetPassword",
    data(){
        return{
            reset:{
                password:"",
                password_con:"",
                captcha:"",
                captcha_url: "",
                error:null,
                btn: false,
                token:""
            }
        }
    },
    mounted(){
        this.captcha()
        this.reset.token = this.$route.params.token
    },
    methods:{
        captcha(){
            this.reset.captcha_url = ""
            this.$http.get(window.location.origin + '/api/captcha').then((response) => {
                this.reset.captcha_url = response.data.data
            });
        },
        reset_pass(){
            if(this.reset.password == "" || this.reset.captcha == ""){
                this.reset.error = "Please check inputs"
                this.captcha();
                this.reset.captcha = ""
                return
            }
            if(this.reset.password != this.reset.password_con){
                this.reset.error = "Password doesn't match"
                this.captcha();
                this.reset.captcha = ""
                return
            }
            this.reset.btn = true
            this.reset.error = null
            this.$http.post(window.location.origin + '/api/reset_password', {captcha: this.reset.captcha, password: this.reset.password, token:this.reset.token})
            .then((res) => {
                this.reset.btn = false
                if(res.data.error){
                    this.reset.error = res.data.data
                    this.captcha();
                    this.reset.captcha = ""
                    return
                }
                this.$router.push({ name: 'Home'})
                this.$message.success({
                    message: "Password changed successfully!Please login again.",
                    duration : 1500,
                    zIndex: 1000000
                })
            })
            .catch((error) => {
                console.error(error)
            })
        }
    }
}
</script>

<style>

</style>