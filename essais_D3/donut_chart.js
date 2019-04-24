d3.json("donut_data.json").then((data) => {
    width = 932

    radius = width / 2

    var partition = d3.partition() // paramettrage size scale
        .size([2 * Math.PI, radius])

    var root = d3.hierarchy(data)
        .sum(d => d.value) // sum values of children for attribute size for parents
        .sort((a, b) => b.value - a.value) // sort by asc

    partition(root); // combine all data size on the size scale of partition

    // console.log(root.descendants())

    var color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1)) // create color scale

    var format = d3.format(",d")

    var width = 932

    var radius = width / 2

    var arc = d3.arc()
        .startAngle(d => d.x0) // radian location for the start of the arc
        .endAngle(d => d.x1) // radian location for the end of the arc
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005)) // padding left and right beetwen arcs
        .padRadius(radius / 2) // padding beetwen arcs
        .innerRadius(d => d.y0) // the radian location for the inside arc
        .outerRadius(d => d.y1 - 1) // the radian location for the outside arc, (-1) for padding top and bottom beetwen arcs

    var chart = d3.select(".chart") // svg settings
        .style("width", "100%")
        .style("height", "100%")
        // .style("padding", "10px")
        .style("font", "10px sans-serif")
    // .style("box-sizing", "border-box")

    chart.append("g")
        .attr("fill-opacity", 0.6) // for color intensity
        .attr('transform', 'translate(500, 500)')
        .selectAll("path")
        .data(root.descendants().filter(d => d.depth)) // depth = profondeur de positionnement dans l'arc
        .enter()
        // .append('g').attr("class", "node") // if you want an other way to add directly text
        .append("path") // way without text
        .attr("fill", d => { // attribut la meme couleur que les parents aux enfants
            while (d.depth > 1) d = d.parent; // si on est sur un child remonte jusqu'a la data du parent
            return color(d.data.name); // attribut la couleur selon l'echelle ordinal color en fonction des noms
        })
        .attr("d", arc) // positionne l'arc
        .append("title") // <path> cannot contain <text> elements
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

    chart.append("g") // create donut of texts above the other
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr('transform', 'translate(500, 500)')
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


        // other way to add directly text in g but text is not black
    // chart.selectAll(".node")
    //     .attr("text-anchor", "middle")
    //     .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    //     .append("text")
    //     .attr("fill", "black")
    //     .attr("fill-opacity", 1)
    //     .attr("transform", function (d) {
    //         const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
    //         const y = (d.y0 + d.y1) / 2;
    //         return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    //     })
    //     .attr("dy", "0.35em")
    //     .text(d => d.data.name);

    // document.body.appendChild(chart.node());
    // const box = chart.node().getBBox();
    // document.body.removeChild(chart.node());
    // chart.node().setAttribute("viewBox", `${box.x} ${box.y} ${box.width} ${box.height}`);

})