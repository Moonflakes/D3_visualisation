<template>
    <div class="chart mt-1 text-xs-center" style="margin-left: 2px;">
      <a @click="refreshSize">Refresh Size</a>
      <ChartDonut class="mt-13" :dataDonut="dataDonut" :width="chartWidth" :display="display"/>
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
      },
      items: [
        { title: "Home", icon: "dashboard" },
        { title: "About", icon: "question_answer" }
      ],
      right: null
    };
  },
  methods: {
    refreshSize: function() {
      this.chartWidth = 900;
    }
  }
};
</script>
<style>
.main_div {
  display: flex;
}
</style>