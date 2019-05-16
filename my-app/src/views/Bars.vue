<template>
    <div class="chart">
        <a @click="refreshData">Refresh Bars</a> |
        <a @click="refreshSize">Refresh Size</a>
        <ChartBars :bars="randomData" :width="chartWidth" :height="chartHeight" @clickBar />
    </div>
</template>
<script>
import { points } from '@/modules/randomVals.js'

import ChartBars from '@/components/ChartBars.vue'


export default {
    name: 'bars',
    components: {
        ChartBars
    },
    data: function() {
        return {
            randomData: points(),
            chartWidth: 720,
            chartHeight: 480
        }
    },
    methods: {
        refreshData: function() {
            this.randomData = points(Math.round(Math.random() * 15 + 3));
        },
        refreshSize: function() {
            this.chartWidth = Math.round(Math.random() * 420 + 300);
            this.chartHeight = Math.round(Math.random() * 180 + 300);
        }
    }
}
</script>