/* ***** */
//PART I //
/* ***** */

// var data = [4, 8, 15, 16, 23, 42];

// d3.select(".chart")
//     .selectAll("div")
//     .data(data)
//     .enter().append("div")
//     .style("width", function (d) {
//         return d * 10 + "px";
//     })
//     .text(function (d) {
//         return d;
//     });

/* ************************ */
// PART II using svg balise //
/* ************************ */

// var data = [4, 8, 15, 16, 23, 42, 89];

// var width = 960,
//     barHeight = 20;

// var x = d3.scaleLinear()
//     .domain([0, d3.max(data)])
//     .range([0, width]);

// console.log(x(8))

// var chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", barHeight * data.length);

// var bar = chart.selectAll("g")
//     .data(data)
//     .enter().append("g")
//     .attr("transform", function (d, i) {
//         return "translate(0," + i * barHeight + ")";
//     });

// bar.append("rect")
//     .attr("width", x)
//     //equivalent : 
//     // .attr("width", function (d) {
//     //     return x(d);
//     // })
//     .attr("height", barHeight - 1);

// bar.append("text")
//     .attr("x", function (d) {
//         return x(d) - 3;
//     })
//     .attr("y", barHeight / 2)
//     .attr("dy", ".35em")
//     .text(function (d) {
//         return d;
//     });

/* ******** */
// TSV file //
/* ******** */

// var width = 420,
//     barHeight = 20;

// var x = d3.scaleLinear()
//     .range([0, width]);

// var chart = d3.select(".chart")
//     .attr("width", width);

// d3.json("/data.json").then((data) => {
//     console.log(data);
//     x.domain([0, d3.max(data, function (d) {
//         return d.value;
//     })]);

//     chart.attr("height", barHeight * data.length);

//     var bar = chart.selectAll("g")
//         .data(data)
//         .enter().append("g")
//         .attr("transform", function (d, i) {
//             return "translate(0," + i * barHeight + ")";
//         });

//     bar.append("rect")
//         .attr("width", function (d) {
//             return x(d.value);
//         })
//         .attr("height", barHeight - 1);

//     bar.append("text")
//         .attr("x", function (d) {
//             return x(d.value) - 3;
//         })
//         .attr("y", barHeight / 2)
//         .attr("dy", ".35em")
//         .text(function (d) {
//             return d.value;
//         });
// });

/* ******** */
// PART III //
/* ******** */

// var width = 300,
//     height = 500;

// var y = d3.scaleLinear()
//     .range([height, 0]);

// var chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", height);

// d3.json("data.json").then((data) => {
//     y.domain([0, d3.max(data, function(d) { return d.value; })]);

//   var barWidth = width / data.length;

//   var bar = chart.selectAll("g")
//       .data(data)
//     .enter().append("g")
//       .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

//   bar.append("rect")
//       .attr("y", function(d) { return y(d.value); })
//       .attr("height", function(d) { return height - y(d.value); })
//       .attr("width", barWidth - 1);

//   bar.append("text")
//       .attr("x", barWidth / 2)
//       .attr("y", function(d) { return y(d.value) + 3; })
//       .attr("dy", ".75em")
//       .text(function(d) { return d.value; });
// })


/* ********************* */
// with ordinales values //
/* ********************* */

// var data = ["A", "B", "C", "D", "E", "F"];

// var width = 960,
//     barHeight = 20;

// // var x = d3.scaleOrdinal()
// //     .domain(data)
// //     .range([0, 1, 2, 3, 4, 5]);

// var x = d3.scaleBand()
//     .domain(data)
//     .rangeRound([0, width], 0.1)
//     // .padding(.1);

// console.log(x('B'))

// var chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", barHeight * data.length);

// var bar = chart.selectAll("g")
//     .data(data)
//     .enter().append("g")
//     .attr("transform", function (d, i) {
//         return "translate(0," + i * barHeight + ")";
//     });

// bar.append("rect")
//     .attr("width", x)
//     //equivalent : 
//     // .attr("width", function (d) {
//     //     return x(d);
//     // })
//     .attr("height", barHeight - 1);

// bar.append("text")
//     .attr("x", function (d) {
//         return x(d) - 3;
//     })
//     .attr("y", barHeight / 2)
//     .attr("dy", ".35em")
//     .text(function (d) {
//         return d;
//     });

/* ********************* */
// with ordinales values //
/* ********************* */

// var width = 960,
//   height = 500;

// var x = d3.scaleBand()
//   .rangeRound([0, width])

// var y = d3.scaleLinear()
//   .range([height, 0]);

// var chart = d3.select(".chart")
//   .attr("width", width)
//   .attr("height", height);

// d3.json("data.json").then((data) => {
//   x.domain(data.map(function (d) {
//     return d.name;
//   }));
//   y.domain([0, d3.max(data, function (d) {
//     return d.value;
//   })]);

//   console.log(x("Reyes"))

//   var bar = chart.selectAll("g")
//     .data(data)
//     .enter().append("g")
//     .attr("transform", function (d) {
//       return "translate(" + x(d.name) + ",0)";
//     });

//   bar.append("rect")
//     .attr("y", function (d) {
//       return y(d.value);
//     })
//     .attr("height", function (d) {
//       return height - y(d.value);
//     })
//     .attr("width", 160 - 3);

//   bar.append("text")
//     .attr("x", function (d) {
//         return 160 / 2 ;
//     })
//     .attr("y", function (d) {
//       return y(d.value) + 3;
//     })
//     .attr("dy", ".75em")
//     .text(function (d) {
//       return d.value;
//     });
// })


// var margin = {top: 20, right: 30, bottom: 30, left: 40},
//     width = 960
//     height = 500
// var chart = d3.select(".chart")
//     .attr("width", width)
//     .attr("height", height)
//   .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
//   .append("rect")
//     .attr("width", 300)
//     .attr("height", 500)
//   .append("text")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("dy", ".75em")
//     .text("blabla")


/* ********* */
// with axis //
/* ********* */

var margin = {top: 20, right: 30, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
    .rangeRound([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("data.json").then((data) => {
  x.domain(data.map(function(d) { return d.name; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis.tickFormat(function(d) {
        var s = d;
        return this.parentNode.nextSibling
            ? "\xa0" + s + '%'
            : s + " $";
      }))

  chart.append("text") // add label
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Frequency");

  chart.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.name); })
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
      .attr("width", width / (data.length) - 5);
})