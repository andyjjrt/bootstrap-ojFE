<template>
    <div class="card card-body">
        <h3>Avatar</h3>
        <div class="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-lg">
            <div class="col">
                <div class="mb-3 p-2">
                    <input class="form-control" type="file" id="formFile" @change="previewFiles" ref="uploader">
                </div>
            </div>
            <div class="col" v-if="pic_data && pic != ''">
                <div class="d-grid gap-2 p-2">
                    <div class="btn btn-dark disabled">{{parseInt(pic_data.width)}} x {{parseInt(pic_data.height)}} pxs</div>
                </div>
            </div>
            <div class="col" v-if="pic != ''">
                <div class="d-grid gap-2 p-2">
                    <button class="btn btn-success" type="button" @click="reset_pic">Reset</button>
                </div>
            </div>
            <div class="col">
                <div class="d-grid gap-2 p-2" v-if="pic != ''">
                    <button class="btn btn-primary" type="button" @click="uploadAvatar">Upload</button>
                </div>
            </div>
        </div>
        <vue-cropper
            ref="cropper"
            :src="pic"
            alt="Source Image"
            :aspect-ratio="1 / 1"
            :zoomable="false"
            :movable="false"
            :background="false"
            @crop="evt"
            v-if="pic"
        >
        </vue-cropper>
    </div>
</template>

<script>
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';
export default {
    components: { VueCropper},
    data(){
        return{
            pic:"",
            pic_data:null
        }
    },
    methods:{
        reset_pic(){
            this.$refs.uploader.value = ""
            this.pic = ""
            this.pic_data = null
        },
        previewFiles(e) {
            const file = e.target.files[0]
            const reader = new FileReader();
            if (file.type.indexOf('image/') === -1) {
                alert('Please select an image file');
                return;
            }
            reader.onload = (event) => {
                this.pic = event.target.result;
            };
            reader.readAsDataURL(file);
        },
        evt(e){
            this.pic_data = e.detail
        },
        uploadAvatar () {
            this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
                let form = new window.FormData()
                let file = new window.File([blob], 'avatar.png')
                if (file.size > 2 * 1024 * 1024){
                    this.$message.error({
                        message: "Upload limit is 2MB",
                        duration : 1500,
                        zIndex: 1000000
                    })
                    return
                }
                form.append('image', file)
                this.loadingUploadBtn = true
                this.$http({
                    method: 'post',
                    url: 'api/upload_avatar',
                    data: form,
                    headers: {'content-type': 'multipart/form-data'}
                }).then(res => {
                    if(res.data.error){
                        this.$message.error({
                            message: res.data.data,
                            duration : 1500,
                            zIndex: 1000000
                        })
                    }else{
                        this.$message.success({
                            message: "Upload successful",
                            duration : 1500,
                            zIndex: 1000000
                        })
                        
                        this.$http.get(window.location.origin + "/api/profile").then((response) => {
                            this.$store.commit('get_profile', response.data)
                        });
                    }
                    this.reset_pic()
                })
            })
        },
    }
}
</script>

<style>

</style>