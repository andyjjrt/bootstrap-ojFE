<template>
    <div>
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Announcements</h4>
                <div v-if="announcements">
                    <div v-if="!announcements.error">
                        <ul class="list-group list-group-flush">
                            <div v-for="announce in announcements.data.results" :key="announce.id" class="list-group-item">
                                <div role="button" class="d-flex justify-content-between p-1" @click="toggle_modal(announce)" data-bs-toggle="modal" data-bs-target="#modal_announce">
                                    <span>{{ announce.title }}</span>
                                    <span class="md-no-display"><i class="bi-alarm"></i> {{ announce_time(announce.last_update_time) }} <i class="bi bi-person-fill"></i> {{ announce.created_by.username }}</span>
                                </div>
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
        </div>
        <div class="modal fade" id="modal_announce" tabindex="-1" aria-labelledby="modal_announce_label" aria-hidden="true" ref="modal_announce">
            <div class="modal-dialog modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="modal_announce_label">{{ get_title }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="container">
                            <div v-html="get_body"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Modal from 'bootstrap/js/dist/modal.js'

    export default {
        name: "Announce",
        props:{
            announce_url: String
        },
        data(){
            return{
                ModalAnnounce: null,
                announcements: null,
                offsets: 0,
                limit: 10,
                announce: null
            }
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
            this.$http.get(window.location.origin + this.announce_url).then(response => {
                this.announcements = response.data
            });
            this.ModalAnnounce = new Modal(this.$refs.modal_announce)
        },
        methods:{
            announce_time(time_arr){
                return time_arr.split('T')[0]
            },
            toggle_modal(a){
                this.announce = a
            }
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