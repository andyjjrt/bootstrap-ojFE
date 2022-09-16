<script>
import { Line } from "vue-chartjs";

export default {
  mixins: [Line],
  props: {
    data: Object,
    option: Object,
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.renderChart(this.data, this.option);
    },
  },
};
</script>
