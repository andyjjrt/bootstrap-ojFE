<template>
    <div>
        <div class="modal fade" id="NewContestModal" tabindex="-1" aria-labelledby="NewContestModalLabel" aria-hidden="true" ref="newcontest_modal">
            <div class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="NewContestModalLabel">New Contest</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row g-3">
                            <div class="col-sm-12">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" v-model="new_contest.title" >
                            </div>
                            <div class="col-sm-12">
                                <label class="form-label">Description</label>
                                <v-md-editor
                                    v-model="new_contest.description"
                                    :disabled-menus="[]"
                                    :toolbar="toolbar"
                                    height="400px"
                                    @upload-image="handleUploadImage"
                                    left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                                />
                            </div>
                            <div class="col-sm-4">
                                <DatePicker v-model="new_contest.start_time" mode="dateTime" :popover="DatePicker_popover">
                                    <template v-slot="{ inputValue, inputEvents }">
                                        <label class="form-label">Start Time</label>
                                        <input class="form-control" :value="inputValue" v-on="inputEvents">
                                    </template>
                                </DatePicker>
                            </div>
                            <div class="col-sm-4">
                                <DatePicker v-model="new_contest.end_time" mode="dateTime" :popover="DatePicker_popover">
                                    <template v-slot="{ inputValue, inputEvents }">
                                        <label class="form-label">End Time</label>
                                        <input class="form-control" :value="inputValue" v-on="inputEvents">
                                    </template>
                                </DatePicker>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">Password</label>
                                <input type="text" class="form-control" v-model="new_contest.password" >
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label">Contest Rule Type</label>
                                <div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="rule_acm" value="ACM" v-model="new_contest.rule_type">
                                        <label class="form-check-label" for="rule_acm">ACM</label>
                                    </div>
                                    <div class="form-check form-check-inline">
                                        <input class="form-check-input" type="radio" id="rule_oi" value="OI" v-model="new_contest.rule_type">
                                        <label class="form-check-label" for="rule_oi">OI</label>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label"></label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="ContestRTR" v-model="new_contest.real_time_rank">
                                    <label class="form-check-label" for="ContestRTR">Real Time Rank</label>
                                </div>
                            </div>
                            <div class="col-sm-4">
                                <label class="form-label"></label>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="Contest_visible" v-model="new_contest.visible">
                                    <label class="form-check-label" for="Contest_visible">Visible</label>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <label class="form-label">Allowed IP Ranges</label>
                                <div class="input-group mb-3">
                                    <input type="text" class="form-control" placeholder="IP" v-model="add_ip">
                                    <button class="btn btn-outline-secondary" type="button" @click="addip">Button</button>
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <p v-for="(ips,i) in new_contest.allowed_ip_ranges" :key="i"></p>
                                <div class="alert alert-success alert-dismissible fade show" role="alert" v-for="ips in new_contest.allowed_ip_ranges" :key="ips">
                                    {{ips}}
                                    <button type="button" class="btn-close" aria-label="Close" @click="new_contest.allowed_ip_ranges.splice(new_contest.allowed_ip_ranges.indexOf(ips), 1);"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="save_contest">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card card-body">
            <div class="table-responsive">
                <table class="table text-nowrap">
                    <thead>
                        <tr>
                            <th scope="col">ID</th>
                            <th scope="col">Title</th>
                            <th scope="col">Rule Type</th>
                            <th scope="col">Contest Type</th>
                            <th scope="col">Status</th>
                            <th scope="col">Visiable</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody v-if="contests">
                        <tr v-for="i in contests.data.results" :key="i.id">
                            <td>{{i.id}}</td>
                            <td>{{i.title}}</td>
                            <td><span class="badge bg-info">{{i.rule_type}}</span></td>
                            <td><div v-html="contest_type_tag(i.contest_type)" /></td>
                            <td><div v-html="status_tag(i.status)" /></td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="i.visible" @change="visible(i)">
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-dark" @click="goto(i.id)"><i class="bi bi-pencil-square"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#NewContestModal">Create</button>
                </div>
                <ul class="pagination">
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(1)"><i class="bi bi-chevron-double-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)-1)"><i class="bi bi-chevron-left"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(page)+1)"><i class="bi bi-chevron-right"></i></a></li>
                    <li class="page-item"><a class="page-link" role="button" @click="to_page(parseInt(total/10) + 1)"><i class="bi bi-chevron-double-right"></i></a></li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import Modal from 'bootstrap/js/dist/modal.js'

export default {
    name: "ContestList",
    data(){
        return{
            NewContestModal: null,
            contests: null,
            total: null,
            offset: 0,
            new_contest:{
                title: "",
                description:"",
                rule_type: "ACM",
                start_time: new Date(),
                end_time: new Date(),
                password:"",
                real_time_rank:true,
                visible:true,
                allowed_ip_ranges:[]
            },
            toolbar : {
                Katex: {
                    title: 'Katex',
                    icon: 'v-md-icon-code',
                    action(editor) {
                    editor.insert(function (selected) {
                        const prefix = '$';
                        const suffix = '$';
                        const placeholder = 'Katex';
                        const content = selected || placeholder;

                        return {
                        text: `${prefix}${content}${suffix}`,
                        selected: content,
                        };
                    });
                    },
                },
            },
            DatePicker_popover:{
                placement: "top"
            },
            add_ip:""
        }
    },
    mounted(){
        this.NewContestModal = new Modal(this.$refs.newcontest_modal)
        this.init()
    },
    components: {
        DatePicker
    },
    methods:{
        init(){
            this.$http.get(window.location.origin + '/api/admin/contest?offset=' + this.offset + '&limit=10').then(response => {
                this.contests = response.data
                this.total = response.data.data.total
            });
        },
        to_page(page){
            if(page < 1 || page > parseInt(this.total/10) + 1){
                return
            }
            this.page = page
            this.init()
        },
        handleUploadImage(event, insertImage, files) {
            // Get the files and upload them to the file server, then insert the corresponding content into the editor
            console.log(files);
            let formData = new FormData();
            formData.append("original_filename", files[0].name);
            formData.append("image", files[0]);
            this.$http.post(window.location.origin + '/api/admin/upload_image',formData).then(response => {
                if(response.data.success){
                    insertImage({
                        url: response.data.file_path,
                        desc: files[0].name,
                        width: 'auto',
                        height: 'auto',
                    });
                }
            })
            // Here is just an example
        },
        save_contest(){
            if(this.new_contest.password == ""){
                this.new_contest.contest_type = "Public"
            }else{
                this.new_contest.contest_type = "Password Protected"
            }
            this.new_contest.start_time = new Date(this.new_contest.start_time).toISOString()
            this.new_contest.end_time = new Date(this.new_contest.end_time).toISOString()
            this.$http.post(window.location.origin + '/api/admin/contest', this.new_contest).then(response => {
                if(!response.data.error){
                    this.NewContestModal.toggle();
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
        addip(){
            if(this.add_ip == ""){
                this.$message.error({
                    message: "Please enter IP",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            if(this.new_contest.allowed_ip_ranges.indexOf(this.add_ip) != -1){
                this.$message.error({
                    message: "Duplicated IP",
                    duration : 1500,
                    zIndex: 1000000
                })
                return
            }
            this.new_contest.allowed_ip_ranges.push(this.add_ip)
            this.add_ip = ""
        },
        visible(con){
            this.$http.put(window.location.origin + '/api/admin/contest', con).then(response => {
                if(!response.data.error){
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
        goto(id){
            this.$router.push({ path: '/admin/contest/' + id })
        },
        contest_type_tag(type){
            if(type == "Public"){
                return '<span class="badge bg-success">Public</span>'
            }else if(type == "Password Protected"){
                return '<span class="badge bg-primary">	Password Protected</span>'
            }
        },
        status_tag(status){
            if(status == 1){
                return '<span class="badge bg-warning">Not Started</span>'; 
            }else if(status == -1){
                return '<span class="badge bg-danger">Ended</span>'; 
            }
                return '<span class="badge bg-success">Underway</span>'; 
        }
    }
}
</script>

<style>

</style>