<template>
    <div>
        <div class="modal fade" id="AnnounceEditModal" tabindex="-1" aria-labelledby="AnnounceEditModalLabel" aria-hidden="true" ref="announce_modal">
            <div class="modal-dialog modal-xl modal-fullscreen-lg-down modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AnnounceEditModalLabel">Announce</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label class="form-label">Title</label>
                            <input type="email" class="form-control" placeholder="Title" v-model="announce_1.title">
                        </div>
                        <label class="form-label">Announce</label>
                        <v-md-editor
                            v-model="announce_1.content"
                            :disabled-menus="[]"
                            :toolbar="toolbar"
                            height="400px"
                            @upload-image="handleUploadImage"
                            left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                        />
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-primary" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="AnnouncedeleteModal" tabindex="-1" aria-labelledby="AnnouncedeleteModalLabel" aria-hidden="true" ref="delete_modal">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="AnnouncedeleteModalLabel">Confirm</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this announcement?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="btn btn-danger" @click="delete_id">Delete</button>
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
                            <th scope="col">Title</th>
                            <th scope="col">Create Time</th>
                            <th scope="col">Author</th>
                            <th scope="col">Visiable</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody v-if="announcements">
                        <tr v-for="announce in announcements" :key="announce.id">
                            <td>{{announce.id}}</td>
                            <td>{{announce.title}}</td>
                            <td>{{new Date(announce.create_time).toLocaleString()}}</td>
                            <td>{{announce.created_by.username}}</td>
                            <td>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="announce.visible" @change="visible(announce)">
                                </div>
                            </td>
                            <td>
                                <button class="btn btn-sm btn-outline-dark" data-bs-toggle="modal" data-bs-target="#AnnounceEditModal" @click="edit(announce)"><i class="bi bi-pencil-square"></i></button>
                                &nbsp;
                                <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#AnnouncedeleteModal" @click="announce_1 = announce"><i class="bi bi-trash"></i></button>
                            </td>
                        </tr>
                        <tr v-if="announcements.length == 0">
                            <td colspan="6" class="text-center">No Data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <div class="d-flex justify-content-between">
                <div>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AnnounceEditModal" @click="create_new"><i class="bi bi-plus"></i> Create</button>
                </div>
                <ul class="pagination" v-if="$route.params.manage_contest_id == undefined">
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
import Modal from 'bootstrap/js/dist/modal.js'
export default {
    name:"EditAnnounce",
    data(){
        return{
            announcements: null,
            total: 0,
            announce_1:{
                title:"",
                content:"",
                visible:true,
                id:0
            },
            mode:"create",
            AnnounceModal: null,
            DeleteModal: null,
            page:1,
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
            url:"/api/admin/announcement",
            type: "Public"
        }
    },
    created(){
        if(this.$route.params.manage_contest_id != undefined){
            this.url = '/api/admin/contest/announcement'
        }
        this.init()
    },
    mounted(){
        this.AnnounceModal = new Modal(this.$refs.announce_modal)
        this.DeleteModal = new Modal(this.$refs.delete_modal)
    },
    methods:{
        init(){
            let tmp = "?offset=" + this.offset + "&limit=10"
            if(this.$route.params.manage_contest_id != undefined){
                tmp = '?contest_id=' + this.$route.params.manage_contest_id
            }
            this.$http.get(window.location.origin + this.url + tmp).then(response => {
                this.announcements = response.data.data.results
                if(this.$route.params.manage_contest_id != undefined){
                    this.announcements = response.data.data
                }
                this.total = response.data.data.total
            });
        },
        edit(announce){
            this.announce_1 = announce
            this.mode = "edit"
        },
        create_new(){
            this.announce_1 = {
                title:"",
                content:"",
                visible:true,
                id: null
            }
            this.mode = "create"
        },
        save(){
            if(this.$route.params.manage_contest_id != undefined){
                this.announce_1.contest_id = this.$route.params.manage_contest_id
            }
            if(this.mode == "edit" || this.mode == "vis"){
                this.$http.put(window.location.origin + this.url, this.announce_1).then(response => {
                    if(!response.data.error){
                        if(this.mode == "edit"){
                            this.AnnounceModal.toggle();
                        }
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
            }else{
                this.$http.post(window.location.origin + this.url, this.announce_1).then(response => {
                    if(!response.data.error){
                        this.AnnounceModal.toggle();
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
            }
        },
        visible(announce){
            this.announce_1 = announce
            this.mode="vis"
            this.save();
        },
        delete_id(){
            this.$http.delete(window.location.origin + this.url + '?id=' + this.announce_1.id).then(response => {
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
    }
}
</script>

<style>

</style>