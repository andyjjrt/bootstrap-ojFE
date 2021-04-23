<template>
    <div>
        <div class="text-center" style="font-size: 0.9em;">
            <span v-html="footer"></span>
            <br>
            <span>
                FE redesign by 
                <a href="https://github.com/andyjjrt">andyjjrt</a>
                <span>
                    &nbsp;  Version: {{version}}
                </span>
            </span>
        </div>
        <br>
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
        },
        version(){
            return process.env.VUE_APP_VERSION
        }
    }
}
</script>

<style>

</style>