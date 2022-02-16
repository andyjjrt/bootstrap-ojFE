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
            <div class="mb-3">
                <div class="fs-4">Announce</div>
            </div>
            <div class="table-responsive"  v-if="announcements">
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
                    <tbody>
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
                                <span data-bs-toggle="modal" data-bs-target="#AnnounceEditModal"><button class="btn btn-sm btn-outline-dark" @click="edit(announce)" data-bs-toggle="tooltip" data-bs-placement="top" title="Edit"><i class="bi bi-pencil-square"></i></button></span>
                                &nbsp;
                                <span data-bs-toggle="modal" data-bs-target="#AnnouncedeleteModal"><button class="btn btn-sm btn-danger" @click="announce_1 = announce"  data-bs-toggle="tooltip" data-bs-placement="top" title="Delete"><i class="bi bi-trash"></i></button></span>                            </td>
                        </tr>
                        <tr v-if="announcements.length == 0">
                            <td colspan="6" class="text-center">No Data</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="d-flex justify-content-center pt-4" v-else>
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-sm mb-3">
                    <button class="btn btn-primary text-nowrap" data-bs-toggle="modal" data-bs-target="#AnnounceEditModal" @click="create_new"><i class="bi bi-plus"></i> Create</button>
                </div>
                <div class="col-sm float-end mb-3" v-if="$route.params.manage_contest_id == undefined">
                    <Pagination @nav="to_page" :total="total" :page="page" :perpage="10" :dress_class="''" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Modal from 'bootstrap/js/dist/modal.js'
import Tooltip from 'bootstrap/js/dist/tooltip.js'
import Pagination from '@/components/Pagination.vue'
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
    components:{
        Pagination
    },
    created(){
        if(this.$route.params.manage_contest_id != undefined){
            this.url = '/api/admin/contest/announcement'
        }
    },
    mounted(){
        this.AnnounceModal = new Modal(this.$refs.announce_modal)
        this.DeleteModal = new Modal(this.$refs.delete_modal)
        if(this.$route.query.announce_id != undefined){
            this.$http.get(window.location.origin + this.url + '?id=' + this.$route.query.announce_id).then(response => {
                if(response.data.error) throw response.data.data
                if(this.$route.params.manage_contest_id != undefined){
                    if(response.data.data.contest != this.$route.params.manage_contest_id){
                        this.$error("This announce doesn't belong to this contest.")
                    }else{
                        this.edit(response.data.data)
                        this.AnnounceModal.toggle()
                    }
                }else{
                    this.edit(response.data.data)
                    this.AnnounceModal.toggle()
                }
            }).catch((err) => {
                this.$error(err)
                this.$router.back()
            }).then(() => {
                this.init()
            })
        }else{
            this.init()
        }
    },
    methods:{
        init(){
            let offset = (this.page-1) * 10
            let tmp = "?offset=" + offset + "&limit=10"
            if(this.$route.params.manage_contest_id != undefined){
                tmp = '?contest_id=' + this.$route.params.manage_contest_id
            }
            this.$http.get(window.location.origin + this.url + tmp).then(response => {
                if(response.data.error) throw response.data.data
                this.announcements = response.data.data.results
                if(this.$route.params.manage_contest_id != undefined){
                    this.announcements = response.data.data
                }
                this.total = response.data.data.total
            }).then(()=>{
                Array.from(document.querySelectorAll('button[data-bs-toggle="tooltip"]')).forEach(tooltipNode => new Tooltip(tooltipNode))
            })
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
                        this.$success("Succeed")
                        this.init();
                    }else{
                        this.$error(response.data.data)
                    }
                });
            }else{
                this.$http.post(window.location.origin + this.url, this.announce_1).then(response => {
                    if(!response.data.error){
                        this.AnnounceModal.toggle();
                        this.$success("Succeed")
                        this.init();
                    }else{
                        this.$error(response.data.data)
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
                    this.$success("Succeed")
                    this.init();
                }else{
                    this.$error(response.data.data)
                }
            });
        },
        to_page(page){
            this.page = page
            this.init()
        },
        handleUploadImage(event, insertImage, files) {
            // Get the files and upload them to the file server, then insert the corresponding content into the editor
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
    },
    beforeRouteLeave(to, from, next) {
        this.AnnounceModal.hide()
        this.DeleteModal.hide()
        next()
    },
    beforeDestroy(){
        this.AnnounceModal.hide()
        this.DeleteModal.hide()
    }
}
</script>

<style>

</style>