<template>
    <div :class="dress_class" v-if="total > perpage">
        <div class="d-none d-md-block">
            <pagination :records="total" v-model="page_1" :per-page="perpage" :options="opt" />
        </div>
        <div class="d-block d-md-none">
            <pagination :records="total" v-model="page_1" :per-page="perpage" :options="opt2" />
        </div>
    </div>
</template>

<script>
    import PaginationTemplate from '@/components/Pagination/template.vue'
    export default {
        name:"PaginationComponent",
        props:{
            total: Number,
            page: Number,
            perpage: Number,
            dress_class: String
        },
        data(){
            return{
                opt:{
                    chunk:5,
                    template: PaginationTemplate,
                    edgeNavigation: true
                },
                opt2:{
                    chunk:3,
                    template: PaginationTemplate,
                },
                page_1: this.page
            }
        },
        watch:{
            page_1(){
                this.$emit('nav', this.page_1)
            }
        }
    }
</script>