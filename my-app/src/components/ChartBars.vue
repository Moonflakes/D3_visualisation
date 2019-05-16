<template>
    <div>
        <div>
            <span>yMax: {{yMax}}, yMin: {{yMin}}</span>
        </div>
        <svg :height="height" :width="width">
            <g :transform="display">
                <g id="xAxis" :transform="bottomTranslate"></g>
                <g id="yAxis"></g>
                <rect class="bar" v-for="point in bars" :x="xScale(point.x)" :y="_height() - yScale(point.y)" :width="xScale.bandwidth()" :height="yScale(point.y)"></rect>
            </g>
        </svg>
    </div>
</template>
<script>
import { select, scaleLinear, scaleBand, min, max, axisLeft, axisBottom } from 'd3'

let margin = { top: 20, right: 20, bottom: 20, left: 30 };

export default {
    name: 'ChartBars',
    props: {
        bars: {
            type: Array,
            required: true
        },
        height: {
            type: Number,
            default: 480
        },
        width: {
            type: Number,
            default: 720
        }
    },
    data: function() {
        console.log(this.bars);

        let xScale = scaleBand(),
            yScale = scaleLinear();

        xScale.range([0, this._width()]);
        xScale.domain(this.bars.map(point => point.x));
        xScale.padding(0.2)

        yScale.range([this._height(), 0]);
        yScale.domain([this.getMin('y'), this.getMax('y')]);

        return {
            xScale: xScale,
            yScale: yScale
        }
    },
    mounted: function() {
        this.drawXAxis();
        this.drawYAxis();
    },
    watch: {
        width: function() {
            this.xScale.range([0, this._width()]);
            this.drawXAxis()
        },
        height: function() {
            this.yScale.range([this._height(), 0]);
            this.drawYAxis();
        },
        'bars.length': function() {
            this.xScale.domain(this.bars.map(point => point.x));
            this.drawXAxis();
        },
        yMax: function() {
            this.yScale.domain([this.getMin('y'), this.getMax('y')]);
            this.drawYAxis();
        },
        yMin: function() {
            this.yScale.domain([this.getMin('y'), this.getMax('y')]);
            this.drawYAxis();
        }
    },
    methods: {
        drawXAxis: function() {
            select('#xAxis').call(axisBottom(this.xScale))
        },
        drawYAxis: function() {
            select('#yAxis').call(axisLeft(this.yScale))
        },
        _width: function() {
            return this.width - margin.left - margin.right;
        },
        _height: function() {
            return this.height - margin.top - margin.bottom;
        },
        getMax: function(axis) {
            return max(this.bars, (d) => d[axis]);
        },
        getMin: function(axis) {
            return min(this.bars, (d) => d[axis]);
        }
    },
    computed: {
        display: function() {
            return 'translate(' + margin.left + ',' + margin.top + ')';
        },
        bottomTranslate: function() {
            return 'translate(0,' + this._height() + ')'
        },
        yMax: function() {
            return this.getMax('y');
        },
        yMin: function() {
            return this.getMin('y')
        }
    }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.bar {
    fill: steelblue;
    /*stroke: steelblue;*/
    /*stroke-width: 1.5px;*/
}
</style>