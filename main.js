var width = 500;
var height = 500;

var width2 = 1200;
var svg = d3.select('svg');

var padding = { t: 60, r: 40, b: 30, l: 300 };

// Compute chart dimensions
var barChartWidth = width2 - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;
var barChartHeight = 625;

var colleges;

var barSpacing = 5; // Space between bars
var barHeight = 10;  // Fixed height for each bar
var barBand = chartHeight / 409;

// Set up axis
var xScale = d3.scaleLinear().range([0, barChartWidth]);
//var yScale = d3.scaleBand().domain(csv.map(d => d.Name)).range([0, csv.length * barSpacing]).padding(0.3);

var xAxisTop = d3.axisTop(xScale).ticks(10).tickFormat(d => d3.format(".0f")(d / 1000) + "k");
var xAxisBottom = d3.axisBottom(xScale).ticks(10).tickFormat(d => d3.format(".0f")(d / 1000) + "k");

// Chart svg
var chart1 = d3
    .select("#chart1")
    .append("svg")
    .attr("id", "svg1")
    .attr("width", width2)
    .attr("height", 750);

// Chart group for appending chart elements
var chartGroup = chart1.append("g")
    .attr("transform", `translate(${padding.l},${padding.t})`);

// Add axis
chart1.append("g")
    .attr("class", "xTopAxis")
    .attr("transform", `translate(${padding.l},${padding.t})`)

chart1.append("g")
    .attr("class", "xBottomAxis")
    .attr("transform", `translate(${padding.l},${barChartHeight + padding.t})`)

// Chart title
chart1.append("text")
    .attr("x", width2 / 2)
    .attr("y", padding.t / 2 - 15)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Average Cost of Colleges");

// Axis label
chart1.append("text")
    .attr("x", width2 / 2 + 150)
    .attr("y", barChartHeight + padding.t + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Cost per Year");

d3.csv("colleges.csv").then(function (csv) {
    csv.forEach(d => {
        d.Name = d.Name; // Column: "Name" (string, no conversion needed)
        d.Region = d.Region; // Column: "Region" (string, no conversion needed)
        d.Cost = +d["Average Cost"]; // Column: "Average Cost" -> convert to numeric
        d.AcceptanceRate = +d["Admission Rate"]; // Column: "Admission Rate" -> convert to numeric
        d.SATScore = +d["SAT Average"]; // Column: "SAT Average" -> convert to numeric
    });

    colleges = csv

    xScale.domain([0, d3.max(colleges, function (d) { return d.Cost; })]);

    chart1.select('.xTopAxis')
        .call(xAxisTop)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(-6, -5)");

    chart1.select('.xBottomAxis')
        .call(xAxisBottom)
        .selectAll("text")
        .style("text-anchor", "start")
        .attr("transform", "translate(-6, 5)");

    updateChart('all-regions');
    //console.log(csv);
})

// Update Chart
function updateChart(filterKey) {
    // Load and filter the data based on the filterKey (for now, no filtering)
    var filteredRegions;

    if (filterKey === 'all-regions')
        filteredRegions = colleges.filter(d => d.Region !== filterKey);
    else filteredRegions = colleges.filter(d => d.Region === filterKey);

    const totalHeight = filteredRegions.length * (barHeight + barSpacing) + 20;

    // Set the SVG height to fit all bars
    d3.select('#chart1')
        .attr('width', width2 - padding.r)
        .attr('height', totalHeight);

    var bars = chartGroup.selectAll('.bar')
        .data(filteredRegions, d => d.Name);
    //enter
    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('height', barHeight)
        .attr('fill', 'darkblue')
        .attr('width', d => xScale(d.Cost))
        .attr('y', (d, i) => {
            const yPosition = i * (barHeight + barSpacing) + 10;
            return yPosition < totalHeight ? yPosition : -9999;
        });
    //update
    bars.attr('width', d => xScale(d.Cost))
        .attr('y', (d, i) => {
            const yPosition = i * (barHeight + barSpacing) + 10;
            return yPosition < totalHeight ? yPosition : -9999;
        });
    //exit
    bars.exit().remove();

    // Text labels for bars
    var labels = chartGroup.selectAll('.label')
        .data(filteredRegions, d => d.Name);
    //enter
    labels.enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', -5)
        .attr('dy', '0.3em')
        .attr('text-anchor', 'end')
        .attr('y', (d, i) => {
            const yPosition = i * (barHeight + barSpacing) + 15;
            return yPosition < barChartHeight ? yPosition : -9999;
        })
        .text(d => d.Name);
    //update
    labels.attr('y', (d, i) => {
        const yPosition = i * (barHeight + barSpacing) + 15;
        return yPosition < barChartHeight ? yPosition : -9999;
    })
        .text(d => d.Name);
    //exit
    labels.exit().remove();
}