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
        <div class="card">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h4>User</h4>
                    <input class="form-control w-50" type="text" placeholder="Keyword" v-model="keyword">
                </div>
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
                                    <span data-bs-toggle="modal" data-bs-target="#userModal">
                                        <button class="btn btn-sm btn-outline-dark" @click="get_user(user)" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="bi bi-pencil-square"></i></button>
                                    </span>
                                    &nbsp;
                                    <span data-bs-toggle="modal" data-bs-target="#deleteModal">
                                        <button class="btn btn-sm btn-danger" @click="delete_id = user.id" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="bi bi-trash"></i></button>
                                    </span>
                                </td>
                            </tr>
                            <tr v-if="users.data.results.length == 0">
                                <td colspan="7" class="text-center">No Data</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <Pagination @nav="to_page" :total="total" :page="page" :perpage="10" :dress_class="'card-body border-top'" />
        </div>
        <br>
        <div class="card card-body">
            <div class="mb-3">
                <div class="fs-4">Import Users</div>
                <small class="text-muted">Only support csv file without headers, check the <a class="text-reset" href="http://docs.onlinejudge.me/#/onlinejudge/guide/import_users">link</a> for details</small>
            </div>
            <div>
                <label class="btn btn-primary">
                    <input style="display:none;" type="file" @change="handle_user_import">
                    <i class="bi bi-cloud-arrow-up"></i> Choose File
                </label>
                &nbsp;
                <button v-if="import_data.users" class="btn btn-success" @click="import_user"><i class="bi bi-cloud-arrow-up"></i> Import Users</button>
            </div>
            <br v-if="import_data.users">
            <div class="table-responsive" v-if="import_data.users" style="max-height: 400px;">
                <table class="table text-nowrap">
                    <thead>
                        <tr>
                            <th scope="col">Username</th>
                            <th scope="col">Password</th>
                            <th scope="col">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(user,i) in import_data.users" :key="i">
                            <td>{{user[0]}}</td>
                            <td>{{user[1]}}</td>
                            <td>{{user[2]}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br>
        <div class="card card-body">
            <div class="mb-3">
                <div class="fs-4">Generate Users</div>
            </div>
            <div class="row g-3">
                <div class="col-sm-6">
                    <label class="form-label">Prefix</label>
                    <input type="text" class="form-control" placeholder="Prefix" v-model="random_generate.prefix" >
                </div>
                <div class="col-sm-6">
                    <label class="form-label">Suffix</label>
                    <input type="text" class="form-control" placeholder="Suffix" v-model="random_generate.suffix" >
                </div>
                <div class="col-sm-6">
                    <label class="form-label">Start number</label>
                    <input type="number" class="form-control" v-model="random_generate.number_from" >
                </div>
                <div class="col-sm-6">
                    <label class="form-label">End number</label>
                    <input type="number" class="form-control" v-model="random_generate.number_to" >
                </div>
                <div class="col-sm-6">
                    <label class="form-label">Password Length</label>
                    <input type="number" class="form-control" v-model="random_generate.password_length" >
                </div>
            </div>
            <br>
            <div>
                <button class="btn btn-primary" @click="generate_user"><i class="bi bi-people-fill"></i> Generate & Export</button>
            </div>
        </div>
    </div>
</template>

<script>
import papa from 'papaparse'
import Modal from 'bootstrap/js/dist/modal.js'
import Tooltip from 'bootstrap/js/dist/tooltip.js'
import Pagination from '@/components/Pagination.vue'

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
            delete_id:"",
            import_data: {},
            random_generate:{
                prefix:"",
                suffix:"",
                number_from:0,
                number_to:0,
                password_length:8
            },
            keyword:""
        }
    },
    components:{
        Pagination
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
            this.$http.get(window.location.origin + '/api/admin/user?offset=' + this.offset + '&limit=10&keyword=' + this.keyword).then(response => {
                this.users = response.data
                this.total = response.data.data.total
            }).then(()=>{
                Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode))
            })
        },
        to_page(page){
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
                    this.$success("Succeed")
                    this.init();
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        delete_user(){
            this.$http.delete(window.location.origin + '/api/admin/user?id=' + this.delete_id, {}).then(response => {
                if(!response.data.error){
                    this.DeleteModal.toggle()
                    this.$success("Succeed")
                    this.init();
                }else{
                    this.$error(response.data.data)
                }
            })
        },
        handle_user_import(e){
            this.import_data = {users: []}
            let vm = this
            papa.parse(e.target.files[0], {
                complete: function(results) {
                    let fail = 0;
                    for(let i in results.data){
                        if(results.data[i].length == 3){
                            vm.import_data.users.push(results.data[i])
                        }else{
                            fail += 1
                        }
                    }
                    if(fail > 0){
                        vm.$message.warning({
                            message: fail + "users have been filtered due to empty value",
                            duration : 3000,
                            zIndex: 1000000
                        })
                    }
                    e.target.value = ''
                }
            });
        },
        import_user(){
            this.$http.post(window.location.origin + '/api/admin/user', this.import_data).then(response => {
                if(!response.data.error){
                    this.import_data = {}
                    this.$success("Succeed")
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        generate_user(){
            this.$http.post(window.location.origin + '/api/admin/generate_user', this.random_generate).then(response => {
                if(!response.data.error){
                    this.downloadTestCase(response.data.data.file_id)
                    this.init()
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        downloadTestCase (ID) {
            let url = '/api/admin/generate_user?file_id=' + ID
            // eslint-disable-next-line no-unused-vars
            new Promise((resolve, reject) => {
                this.$http.get(url, {responseType: 'blob'}).then(resp => {
                    let headers = resp.headers
                    if (headers['content-type'].indexOf('json') !== -1) {
                        let fr = new window.FileReader()
                        if (resp.data.error) {
                            this.$error(resp.data.error)
                        } else {
                            this.$error('Invalid file format')
                        }
                        fr.onload = (event) => {
                            let data = JSON.parse(event.target.result)
                            if (data.error) {
                                this.$error(data.data)
                            } else {
                                this.$error('Invalid file format')
                            }
                        }
                        let b = new window.Blob([resp.data], {type: 'application/json'})
                        fr.readAsText(b)
                        return
                    }
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(new window.Blob([resp.data], {type: headers['content-type']}))
                    link.download = (headers['content-disposition'] || '').split('filename=')[1]
                    document.body.appendChild(link)
                    link.click()
                    link.remove()
                    resolve()
                }).catch(() => {})
            })
        },
    },
    computed:{
        offset(){
            return (this.page-1)*10
        }
    },
    watch:{
        keyword(){
            this.to_page(1)
        }
    },
    beforeRouteLeave(to, from, next) {
        this.UserModal.hide()
        this.DeleteModal.hide()
        next()
    },
    beforeDestroy(){
        this.UserModal.hide()
        this.DeleteModal.hide()
    }
}
</script>

<style>

</style>