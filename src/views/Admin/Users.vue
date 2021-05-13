<template>
    <div>
        <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true" ref="user_modal">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">User</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" v-if="userdata">
                        <form class="row g-3" action="#" @submit.prevent="put_user">
                            <div class="col-md-6">
                                <label class="form-label">Username</label>
                                <input type="text" class="form-control" v-model="userdata.username">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Email address</label>
                                <input type="email" class="form-control" v-model="userdata.email">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Real name</label>
                                <input type="text" class="form-control" v-model="userdata.real_name">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">New Password</label>
                                <input type="text" class="form-control" v-model="userdata.password">
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">User Type</label>
                                <select class="form-select" aria-label="Duefault select example" v-model="userdata.admin_type">
                                    <option value="Regular User">Regular User</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Super Admin">Super Admin</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label"  v-if="userdata.admin_type == 'Admin'">Problem permission</label>
                                <select class="form-select" aria-label="Duefault select example" v-model="userdata.problem_permission" v-if="userdata.admin_type == 'Admin'">
                                    <option value="None">None</option>
                                    <option value="Own">Own</option>
                                    <option value="All">All</option>
                                </select>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check form-switch">
                                    <label class="form-check-label" for="tfa_check">TFA</label>
                                    <input class="form-check-input" id="tfa_check" type="checkbox" v-model="userdata.two_factor_auth" disabled>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check form-switch">
                                    <label class="form-check-label" for="api_check">Open API</label>
                                    <input class="form-check-input" id="api_check" type="checkbox" v-model="userdata.open_api">
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="form-check form-switch">
                                    <label class="form-check-label" for="dis_check">Disabled</label>
                                    <input class="form-check-input" id="dis_check" type="checkbox" v-model="userdata.is_disabled">
                                </div>
                            </div>
                            <div class="col-12">
                                <button type="submit" class="btn btn-primary float-end">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true" ref="delete_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Confirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Sure to delete the user? The associated resources created by this user will be deleted as well, like problem, contest, announcement, etc.
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="delete_user">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card card-body">
            <div class="table-responsive">
                <table class="table text-nowrap">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Create</th>
                            <th scope="col">Type</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody v-if="users">
                        <tr v-for="user in users.data.results" :key="user.id">
                            <td>{{user.id}}</td>
                            <td>{{user.username}}</td>
                            <td>{{new Date(user.create_time).toLocaleString()}}</td>
                            <td>{{user.admin_type}}</td>
                            <td>
                                <button class="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#userModal" @click="get_user(user)"><i class="bi bi-pencil-square"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteModal" @click="delete_id = user.id"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <nav aria-label="Page navigation example">
                <ul class="pagination justify-content-end">
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)-1)"><i class="bi bi-chevron-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)+1)"><i class="bi bi-chevron-right"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/10) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
export default {
    name:"Users",
    data(){
        return{
            users: null,
            userdata: null,
            page:1,
            total: 0,
            UserModal: null,
            DeleteModal: null,
            delete_id:""
        }
    },
    created(){
        this.init()
    },
    mounted(){
        this.UserModal = new Modal(this.$refs.user_modal)
        this.DeleteModal = new Modal(this.$refs.delete_modal)
    },
    methods:{
        init(){
            this.$http.get(window.location.origin + '/api/admin/user?offset=' + this.offset + '&limit=10').then(response => {
                this.users = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/10) + 1 || page == this.$route.query.page){
                return
            }
            this.page = page
            this.init()
        },
        get_user(user){
            this.userdata = null
            this.$http.get(window.location.origin + '/api/admin/user?id=' + user.id).then(response => {
                this.userdata = response.data.data
                if(this.userdata.email == null){
                    this.userdata.email = ""
                }
                if(this.userdata.real_name == null){
                    this.userdata.real_name = ""
                }
                this.userdata.password = ""
            });
        },
        put_user(){
            if(this.userdata.email == ""){
                this.userdata.email = null
            }
            if(this.userdata.real_name == ""){
                this.userdata.real_name = null
            }
            this.userdata.real_tfa = this.userdata.two_factor_auth
            if(this.userdata.admin_type == 'Super Admin'){
                this.userdata.problem_permission = "All"
            }else if(this.userdata.admin_type == 'Regular User'){
                this.userdata.problem_permission = "None"
            }

            this.$http.put(window.location.origin + '/api/admin/user', this.userdata).then(response => {
                if(!response.data.error){
                    this.UserModal.toggle()
                    this.$message.success({
                        message: "Succeed",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.init();
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            });
        },
        delete_user(){
            this.$http.delete(window.location.origin + '/api/admin/user?id=' + this.delete_id, {}).then(response => {
                if(!response.data.error){
                    this.DeleteModal.toggle()
                    this.$message.success({
                        message: "Succeed",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    this.init();
                }else{
                    this.$message.error({
                        message: response.data.data,
                        duration : 1500,
                        zIndex: 1000000
                    })
                }
            })
        }
    },
    computed:{
        offset(){
            return (this.page-1)*10
        }
    }
}
</script>

<style>

</style>