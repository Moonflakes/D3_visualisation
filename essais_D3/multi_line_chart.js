var width = 960,
    height = 800,
    margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 30
    }
var zoom = 0;
var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height)
    .append('g')
    .attr('transform', 'translate(0, 10)');
const dot = chart.append("g")

d3.json("data_unemployed.json").then((data) => {
    console.log(data)

    var dates = data.dates.map(date => new Date(date))

    var xScale = d3.scaleTime()
    var yScale = d3.scaleLinear()

    var xAxisCall = d3.axisBottom()
    var yAxisCall = d3.axisLeft()

    setScale1()
    initAxis()
    createLines()

    function setScale1() {
        xScale.domain(d3.extent(dates))
            .range([margin.left, width - margin.right])
        yScale.domain([0, d3.max(data.series, d => d3.max(d.values))]).nice()
            .range([height - margin.bottom, margin.top])
        xAxisCall.scale(xScale)
        yAxisCall.scale(yScale)
    }

    function initAxis() {
        chart.append('g') // create x axe
            .attr("class", "x axe")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(xAxisCall)

        chart.append("g")
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(yAxisCall)
            .call(g => g.select(".tick:last-of-type text").clone()
                .attr("x", 3)
                .attr("text-anchor", "start")
                .attr("font-weight", "bold")
                .text(data.y))
    }

    function createLines() {
        var line = d3.line()
            .defined(d => !isNaN(d))
            .x((d, i) => xScale(dates[i]))
            .y(d => yScale(d))

        chart.append("g")
            .attr("class", "lines")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .selectAll("path")
            .data(data.series)
            .join("path")
            .style("mix-blend-mode", "multiply")
            .attr("d", d => line(d.values))
    }

    chart.selectAll(".lines path")
        .on("mouseover", handleMouseOver)

    d3.select(".chart")
        .on("mouseleave", handleMouseOut)
        .on("mousemove", moved);

    d3.select(".chart").on("dblclick", function () {
        let date = xScale.invert(event.clientX),
            year = date.getFullYear(),
            yearMin = (year < 2002) ? 2000 : year - 2,
            yearMax = (year > 2012) ? 2013 : year + 2,
            month = (yearMax === 2013 && date.getMonth() > 8) ? 8 : date.getMonth(),
            dayMin = new Date(yearMin, month + 1, 0).getDate(),
            dayMax = new Date(yearMax, month + 1, 0).getDate(),
            dateMin = new Date(yearMin, month, dayMin, 24).toISOString(),
            dateMax = new Date(yearMax, month, dayMax, 24).toISOString()

        console.log("dateMin", dateMin, "dateMax", dateMax, date.getMonth())

        var newData = updateData(data, dateMin, dateMax)
        zoom = 1;

        function setScale2() {
            xScale.domain(d3.extent(newData.dates))
                .range([margin.left, width - margin.right])
            xAxisCall.scale(xScale)
        }

        function updateAxis() {
            var t = d3.transition()
                .duration(500)

            chart.select(".x")
                .transition(t)
                .call(xAxisCall)
        }

        function updateLines() {
            var t = d3.transition()
                .duration(500)

            var line = d3.line()
                .defined(d => !isNaN(d))
                .x((d, i) => xScale(newData.dates[i]))
                .y(d => yScale(d))

            chart.selectAll(".lines path")
                .data(newData.series)
                .transition(t)
                .attr("d", d => line(d.values));
        }

        setScale2()
        updateAxis()
        updateLines()

        console.log("zoom")
    })

    dot.append("circle")
        .attr("r", 2.5);

    dot.append("text")
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle")
        .attr("y", -8);
    
        function moved() {
            dates = zoom ? newData.dates : dates;
            data = zoom ? newData : data;
            d3.event.preventDefault();
            const ym = yScale.invert(event.offsetY);
            const xm = xScale.invert(event.offsetX);
            const i1 = d3.bisectLeft(dates, xm, 1);
            const i0 = i1 - 1;
            const i = xm - dates[i0] > dates[i1] - xm ? i1 : i0;
            const s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
            d3.selectAll(".lines path").attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
            dot.attr("transform", `translate(${xScale(dates[i])},${yScale(s.values[i])})`).raise();
            dot.select("text").text(s.name).raise();
        }


})



function updateData(data, dateMin, dateMax) {
    let newDates = data.dates.filter(date => date >= dateMin && date <= dateMax),
        indexMin = data.dates.indexOf(dateMin),
        indexMax = data.dates.indexOf(dateMax),
        newSeries = data.series.map(function (elem) {
            return {
                name: elem.name,
                values: elem.values.slice(indexMin, indexMax + 1)
            }
        })
    newDates = newDates.map(date => new Date(date))

    return newData = {
        y: data.y,
        series: newSeries,
        dates: newDates
    }
}

function handleMouseOver(d, i) {
    d3.selectAll(".lines path").style("mix-blend-mode", null).attr("stroke", "#ddd");
    // d3.select(this).attr("stroke", null).raise();
    dot.attr("display", null);
}

function handleMouseOut(d, i) {
    d3.selectAll(".lines path").style("mix-blend-mode", "multiply").attr("stroke", null);
    dot.attr("display", "none");
}