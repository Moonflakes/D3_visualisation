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

   const g = chart.append("g")
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
        .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`); // je ne sais pas a quoi ca sert ???

    const label = chart.append("g") // create donut of texts above the other
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .attr('transform', 'translate(500, 500)')
        .selectAll("text")
        .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10)) // on ne prend que les noms ou le radian est assez grand pour le voir
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


    const path  = chart.selectAll("path")
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

    const parent = g.append("circle")
      .datum(root)
      .attr("r", radius)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("click", clicked);

    function clicked(p) {
        console.log(parent)
        parent.datum(p.parent || root);
    
        root.each(d => d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth)
        });
    
        const t = g.transition().duration(750);
    
        // Transition the data on all arcs, even the ones that aren’t visible,
        // so that if this transition is interrupted, entering arcs will start
        // the next transition from the desired position.
        path.transition(t)
            .tween("data", d => {
              const i = d3.interpolate(d.current, d.target);
              return t => d.current = i(t);
            })
          .filter(function(d) {
            return +this.getAttribute("fill-opacity") || arcVisible(d.target);
          })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attrTween("d", d => () => arc(d.current));
    
        label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
          }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
      }

      function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
      }
    
      function labelVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
      }
    
      function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
        const y = (d.y0 + d.y1) / 2 * radius;
        return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
      }
    

})