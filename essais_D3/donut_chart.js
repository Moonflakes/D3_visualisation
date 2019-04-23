partition = data => d3.partition()
    .size([2 * Math.PI, radius])
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value))

color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

format = d3.format(",d")

width = 932

radius = width / 2

arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1)

function autosize(svg) {
    document.body.appendChild(svg);
    const box = svg.getBBox();
    document.body.removeChild(svg);
    svg.setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);
    return svg;
}

var chart = d3.select(".chart")
    .attr("width", "100%")
    .attr("height", "auto")
    .style("padding", "10px")
    .style("font", "10px sans-serif")
    .style("box-sizing", "border-box")
// .append('g')
// .attr('transform', 'translate(0, 10)');

d3.json("donut_data.json").then((data) => {
    const root = partition(data);

    chart.append("g")
        .attr("fill-opacity", 0.6)
        .selectAll("path")
        .data(root.descendants().filter(d => d.depth))
        .enter().append("path")
        .attr("fill", d => {
            while (d.depth > 1) d = d.parent;
            return color(d.data.name);
        })
        .attr("d", arc)
        .append("title")
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    chart.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
        .enter().append("text")
        .attr("transform", function (d) {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        })
        .attr("dy", "0.35em")
        .text(d => d.data.name);

})