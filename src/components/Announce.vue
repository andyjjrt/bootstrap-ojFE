<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Announcements</h4>
                <div v-if="announcements">
                    <div v-if="!announcements.error">
                        <ul class="list-group list-group-flush">
                            <div v-for="a in announcements.data" :key="a.id" class="list-group-item d-flex">
                                <div role="button" class="flex-fill d-flex justify-content-between p-1" @click="toggle_modal(a)" data-bs-toggle="modal" data-bs-target="#modal_announce">
                                    <span>{{ a.title }}</span>
                                    <span class="md-no-display"><i class="bi-alarm"></i> {{ announce_time(a) }} <i class="bi bi-person-fill"></i> {{ a.created_by.username }}</span>
                                </div>
                                <template v-if="$store.state.profile">
                                    <template v-if="$store.state.profile.data">
                                        <span style="padding-left: 5px;" v-if="$store.state.profile.data.user.admin_type == 'Admin' || $store.state.profile.data.user.admin_type == 'Super Admin'">
                                            <button class="btn btn-primary btn-sm" @click.stop="edit(a.id)"><i class="bi bi-pencil-square"></i></button>
                                        </span>
                                    </template>
                                </template>                           
                            </div>
                        </ul>
                        <ul class="list-group list-group-flush" v-if="announcements.data.length == 0">
                            <li class="d-flex justify-content-between p-1">
                                No Announcement
                            </li>
                        </ul>
                    </div>
                    <div v-else>
                        <div class="alert alert-danger" role="alert">
                            {{announcements.data}}
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center" v-else>
                    <div class="spinner-border" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
            <template v-if="$route.params.id == undefined">
                <Pagination @nav="to_page" :total="total" :page="page" :perpage="10" :dress_class="'card-body border-top'" />
            </template>
        </div>
        <div class="modal fade" id="modal_announce" tabindex="-1" aria-labelledby="modal_announce_label" aria-hidden="true" ref="modal_announce">
            <div class="modal-dialog modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal_announce_label">{{ get_title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <v-md-editor :value="get_body" mode="preview"></v-md-editor>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Modal from 'bootstrap/js/dist/modal.js'
    import Pagination from '@/components/Pagination.vue'
    export default {
        name: "Announce",
        data(){
            return{
                ModalAnnounce: null,
                announcements: null,
                total: 0,
                page: 1,
                announce: null,
                url: "/api/announcement"
            }
        },
        components:{
            Pagination
        },
        computed:{
            profile(){
                if(this.$store.state.profile){
                    return this.$store.state.profile.data
                }
                return ""
            },
            get_title(){
                if(this.announce){
                    return this.announce.title
                }
                return ""
            },
            get_body(){
                if(this.announce){
                    return this.announce.content
                }
                return ""
            }
        },
        created() {
            this.init()
        },
        mounted(){
            this.ModalAnnounce = new Modal(this.$refs.modal_announce)
        },
        methods:{
            init(){
                let tmp = '?'
                if(this.$route.params.id != undefined){
                    this.url = "/api/contest/announcement"
                    tmp += 'contest_id=' + this.$route.params.id
                }else{
                    tmp += 'offset=' + ((this.page-1)*10) + '&limit=10'
                }
                this.$http.get(window.location.origin + this.url + tmp).then(response => {
                    this.announcements = response.data
                    if(this.announcements.data.results){
                        this.total = this.announcements.data.total
                        this.announcements.data = this.announcements.data.results
                        this.announcements.data.unshift({
                            "id": -1,
                            "created_by": {
                                "id": "aaa",
                                "username": "andyjjrt",
                                "real_name": null
                            },
                            "title": "新版OJ網頁測試中",
                            "content": "新版OJ網頁測試中，有bug請截圖通知。",
                            "create_time": "2021-04-23T00:00:00.000000Z",
                            "last_update_time": "2021-04-23T00:00:00.000000Z",
                            "visible": true
                        })
                    }
                });
            },
            announce_time(announce){
                if(announce.last_update_time){
                    return announce.last_update_time.split('T')[0]
                }
                return announce.create_time.split('T')[0]
            },
            toggle_modal(a){
                this.announce = a
            },
            edit(id){
                if(this.$route.params.id != undefined){
                    this.$router.push({ path: '/admin/contest/' + this.$route.params.id + '?announce_id=' + id})
                }else{
                    this.$router.push({ path: '/admin/announce?announce_id=' + id})
                }
            },
            to_page(page){
                this.page = page
                this.init()
            }
        },
        beforeRouteLeave(to, from, next) {
            this.ModalAnnounce.hide()
            next()
        },
        beforeDestroy(){
            this.ModalAnnounce.hide()
        }
    };

</script>

<style>
    .md-no-display{
        display: none;
    }
    @media (min-width: 768px) {
        .md-no-display{
            display: block;
        }
    }
</style>