<template>
  <canvas id="myChart"></canvas>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  props: {
    ChartData: Object,
    Options: Object,
    Type: String,
  },
  data() {
    return {
      mychart: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      const config = {
        type: this.Type,
        data: this.ChartData,
        options: this.Options,
      };
      this.mychart = new Chart(document.getElementById("myChart"), config);
    },
  },
  watch: {
    Options() {
      this.mychart.options = this.Options;
      this.mychart.update("none");
    },
    ChartData() {
      this.mychart.data = this.ChartData;
      this.mychart.update("none");
    },
  },
};
</script>

<style></style>
