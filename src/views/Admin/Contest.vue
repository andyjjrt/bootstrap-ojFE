<template>
    <div v-if="contest">
        <div class="card card-body">
            <h4 class="mb-3">Edit Contest</h4>
            <div class="row g-3" v-if="contest">
                <div class="col-sm-12">
                    <label class="form-label">Title</label>
                    <input type="text" class="form-control" v-model="contest.data.title" >
                </div>
                <div class="col-sm-12">
                    <label class="form-label">Description</label>
                    <v-md-editor
                        v-model="contest.data.description"
                        :disabled-menus="[]"
                        :toolbar="toolbar"
                        height="400px"
                        @upload-image="handleUploadImage"
                        left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
                    />
                </div>
                <div class="col-sm-4">
                    <DatePicker v-model="contest.data.start_time" mode="dateTime" :popover="DatePicker_popover">
                        <template v-slot="{ inputValue, inputEvents }">
                            <label class="form-label">Start Time</label>
                            <input class="form-control" :value="inputValue" v-on="inputEvents">
                        </template>
                    </DatePicker>
                </div>
                <div class="col-sm-4">
                    <DatePicker v-model="contest.data.end_time" mode="dateTime" :popover="DatePicker_popover">
                        <template v-slot="{ inputValue, inputEvents }">
                            <label class="form-label">End Time</label>
                            <input class="form-control" :value="inputValue" v-on="inputEvents">
                        </template>
                    </DatePicker>
                </div>
                <div class="col-sm-4">
                    <label class="form-label">Password</label>
                    <input type="text" class="form-control" v-model="contest.data.password" >
                </div>
                <div class="col-sm-4">
                    <label class="form-label">Contest Rule Type</label>
                    <div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="rule_acm" value="ACM" v-model="contest.data.rule_type" disabled>
                            <label class="form-check-label" for="rule_acm">ACM</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="rule_oi" value="OI" v-model="contest.data.rule_type" disabled>
                            <label class="form-check-label" for="rule_oi">OI</label>
                        </div>
                    </div>
                </div>
                <div class="col-sm-4">
                    <label class="form-label"></label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="ContestRTR" v-model="contest.data.real_time_rank">
                        <label class="form-check-label" for="ContestRTR">Real Time Rank</label>
                    </div>
                </div>
                <div class="col-sm-4">
                    <label class="form-label"></label>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" id="Contest_visible" v-model="contest.data.visible">
                        <label class="form-check-label" for="Contest_visible">Visible</label>
                    </div>
                </div>
                <div class="col-sm-6">
                    <label class="form-label">Allowed IP Ranges</label>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control" placeholder="IP" v-model="add_ip">
                        <button class="btn btn-outline-secondary" type="button" @click="addip">Add</button>
                    </div>
                </div>
                <div class="col-sm-6">
                    <p v-for="(ips,i) in contest.data.allowed_ip_ranges" :key="i"></p>
                    <div class="alert alert-success alert-dismissible fade show" role="alert" v-for="ips in contest.data.allowed_ip_ranges" :key="ips">
                        {{ips}}
                        <button type="button" class="btn-close" aria-label="Close" @click="contest.data.allowed_ip_ranges.splice(contest.data.allowed_ip_ranges.indexOf(ips), 1);"></button>
                    </div>
                </div>
                <div class="col-sm-12">
                    <button class="btn btn-primary float-end" @click="save_contest">Save</button>
                </div>
            </div>
        </div>
        <br>
        <Announce />
        <br>
        <Problem :contest_rule="contest.data.rule_type" />
    </div>
    
</template>

<script>
import DatePicker from 'v-calendar/lib/components/date-picker.umd'
import Announce from '@/views/Admin/Announce.vue'
import Problem from '@/views/Admin/Problem.vue'

export default {
    name:"ManageContest",
    data(){
        return{
            contest: null,
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
            add_ip: "",
            DatePicker_popover:{
                placement: "top"
            },
        }
    },
    mounted(){
        this.init()
    },
    components: {
        DatePicker,
        Announce,
        Problem
    },
    methods:{
        init(){
            this.$http.get(window.location.origin + '/api/admin/contest?id=' + this.$route.params.manage_contest_id).then(response => {
                this.contest = response.data
            });
        },
        addip(){
            if(this.add_ip == ""){
                this.$error("Please enter IP")
                return
            }
            if(this.contest.data.allowed_ip_ranges.indexOf(this.add_ip) != -1){
                this.$error("Duplicated IP")
                return
            }
            this.contest.data.allowed_ip_ranges.push(this.add_ip)
            this.add_ip = ""
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
            if(this.contest.data.password == ""){
                this.contest.data.contest_type = "Public"
            }else{
                this.contest.data.contest_type = "Password Protected"
            }
            this.contest.data.start_time = new Date(this.contest.data.start_time).toISOString()
            this.contest.data.end_time = new Date(this.contest.data.end_time).toISOString()
            this.$http.put(window.location.origin + '/api/admin/contest', this.contest.data).then(response => {
                if(!response.data.error){
                    this.$success("Succeed")
                    this.init();
                }else{
                    this.$error(response.data.data)
                }
            });
        },
    }
}
</script>

<style>

</style>