<template>
    <div class="chart">
        <a @click="refreshData">Refresh Lines</a> |
        <a @click="refreshSize">Refresh Size</a>
        <Chartlines :lines="randomData" :width="chartWidth" :height="chartHeight" curve="curveMonotoneX" />
    </div>
</template>
<script>
import { collection } from '@/modules/randomVals.js'

import Chartlines from '@/components/ChartLines'


export default {
    name: 'lines',
    components: {
        Chartlines
    },
    data: function() {
        return {
            randomData: collection(),
            chartWidth: 720,
            chartHeight: 480
        }
    },
    methods: {
        refreshData: function() {
            let nbLines = Math.round(Math.random() * 2 + 2);
            let nbPoints = Math.round(Math.random() * 15 + 3)

            this.randomData = collection(nbLines, nbPoints, 0, 100);
        },
        refreshSize: function() {
            this.chartWidth = Math.round(Math.random() * 420 + 300);
            this.chartHeight = Math.round(Math.random() * 180 + 300);
        }
    }
}
</script>