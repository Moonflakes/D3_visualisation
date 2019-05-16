<template>
  <div class="chart">
    <ChartAssemblee :width="chartWidth"/>
  </div>
</template>
<script>
import ChartAssemblee from "@/components/ChartAssemblee.vue";

export default {
  name: "donut",
  components: {
    ChartAssemblee
  },
  data: function() {
    return {
      chartWidth: 500
    };
  }
};
</script>