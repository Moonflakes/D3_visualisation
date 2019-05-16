<template>
  <div class="chart">
    <a @click="refreshSize">Refresh Size</a>
    <ChartDonut :dataDonut="dataDonut" :width="chartWidth" :display="display"/>
  </div>
</template>
<script>
import ChartDonut from "@/components/ChartDonut.vue";
import dataDonut from "../assets/donut.json";

export default {
  name: "donut",
  components: {
    ChartDonut
  },
  data: function() {
    return {
      dataDonut: dataDonut,
      chartWidth: 400,
      display: {
        nbRing: "all",
        textSlice: true,
        zoomable: true,
        hover: true,
        legend: true
      }
    };
  },
  methods: {
    refreshSize: function() {
      this.chartWidth = 900;
    }
  }
};
</script>