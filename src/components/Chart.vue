<script>
import { Bar } from 'vue-chartjs'

export default {
    mixins: [Bar],
    props:{
        data: Object,
        option: Object
    },
    mounted () {
        this.renderChart(this.data, this.option)
    }
}
</script>

<style>
</style>