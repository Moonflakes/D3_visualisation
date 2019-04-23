<template>
  <v-container></v-container>
</template>

<script>
import * as d3 from "d3";

const margin = { top: 20, right: 30, bottom: 30, left: 40 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

const x = d3.scaleBand().rangeRound([0, width]);

const y = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(x);

const yAxis = d3.axisLeft(y);

export default {
  name: "non-vue-line-chart",
  template: "<div></div>",
  // data() {
  // },

  mounted() {
    const barChart = d3.select(this.$el).append("svg");

    barChart
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.json("/data.json")
      .then(data => {
        x.domain(
          data.map(function(d) {
            return d.name;
          })
        );
        y.domain([
          0,
          d3.max(data, function(d) {
            return d.value;
          })
        ]);

        barChart
          .append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        barChart
          .append("g")
          .attr("class", "y axis")
          .call(yAxis);

        barChart
          .append("text") // add label
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Frequency");

        barChart
          .selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function(d) {
            return x(d.name);
          })
          .attr("y", function(d) {
            return y(d.value);
          })
          .attr("height", function(d) {
            return height - y(d.value);
          })
          .attr("width", width / data.length - 5);
      })
      .catch(err => console.log(err));
  }
};
</script>

<style>
svg g div {
  font: 10px sans-serif;
  background-color: steelblue;
  text-align: right;
  padding: 3px;
  margin: 1px;
  color: white;
}
</style>
