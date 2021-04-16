<template>
    <div>
        <p class="text-center"><span v-html="footer"></span></p>
    </div>
</template>

<script>
export default {
    computed:{
        footer(){
            if(this.$store.state.site.data){
                return this.$store.state.site.data.website_footer
            }
            return ""
        }
    }
}
</script>

<style>

</style>