<script>
import { Pie } from 'vue-chartjs'

export default {
    extends: Pie,
    props:{
        data: Object,
        option: Object
    },
    mounted () {
        this.renderChart(this.data, this.option)
    }
}
</script>
