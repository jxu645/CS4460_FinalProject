var width = 500;
var height = 500;

var width2 = 1200;
var svg = d3.select('svg');

var padding = { t: 60, r: 40, b: 30, l: 340 };

// Compute chart dimensions
var barChartWidth = width2 - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;
var barChartHeight = 625;

var colleges;

var barSpacing = 8; // Space between bars
var barHeight = 15;  // Fixed height for each bar
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
//.attr("height", 750);

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

// // Chart title
// chart1.append("text")
//     .attr("x", width2 / 2)
//     .attr("y", padding.t / 2 - 15)
//     .attr("text-anchor", "middle")
//     .style("font-size", "16px")
//     .style("font-weight", "bold")
//     .text("Average Cost of Colleges");

// Axis label
chart1.append("text")
    .attr("class", "axisTitle")
    .attr("x", width2 / 2 + 150)
    //.attr("y", barChartHeight + padding.t + 40)
    .attr("text-anchor", "middle")
    .style("font-size", "12px")
    .text("Average Cost per Year");

var filteredData;

d3.csv("colleges.csv").then(function (csv) {
    csv.forEach(d => {
        d.Name = d.Name; // Column: "Name" (string, no conversion needed)
        d.Region = d.Region; // Column: "Region" (string, no conversion needed)
        d.Cost = +d["Average Cost"]; // Column: "Average Cost" -> convert to numeric
        d.AcceptanceRate = +d["Admission Rate"]; // Column: "Admission Rate" -> convert to numeric
        d.SATScore = +d["SAT Average"]; // Column: "SAT Average" -> convert to numeric
    });

    colleges = csv;
    filteredData = colleges;

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

    updateChart(colleges);
    //console.log(csv);
})

// Logic that handles dropdowns

function onRegionChanged() {
    updateFilteredData();
}

function onSortChanged() {
    updateFilteredData();
}

function updateFilteredData() {
    var select = d3.select('#regionSelect').node();
    var selectedRegion = select.options[select.selectedIndex].value;

    if (selectedRegion === 'all-regions')
        filteredData = colleges.filter(d => d.Region !== selectedRegion);
    else filteredData = colleges.filter(d => d.Region === selectedRegion);

    const sortSelect = d3.select('#sortSelect').node();
    const selectedSort = sortSelect.options[sortSelect.selectedIndex].value;

    if (selectedSort === 'none') {
        if (filteredData !== colleges) {
            const currentRegion = d3.select('#regionSelect').node().value;
            filteredData = currentRegion === 'all-regions' ? colleges : colleges.filter(d => d.Region === currentRegion);
        } else {
            console.log("onregion sorting triggered")
            filteredData = colleges.filter(d => d.Region !== selectedRegion);
        }
    } else if (selectedSort === 'low-to-high') {
        filteredData.sort((a, b) => a.Cost - b.Cost);
    } else if (selectedSort === 'high-to-low') {
        filteredData.sort((a, b) => b.Cost - a.Cost);
    }

    updateChart(filteredData);
}

// Update Chart
function updateChart(filteredData) {
    // Load and filter the data based on the filterKey (for now, no filtering)
    // var filteredRegions;

    // if (filterKey === 'all-regions')
    //     filteredRegions = colleges.filter(d => d.Region !== filterKey);
    // else filteredRegions = colleges.filter(d => d.Region === filterKey);

    const totalHeight = filteredData.length * (barHeight + barSpacing) + padding.b + padding.t + 10;

    // Set the SVG height to fit all bars
    d3.select('#chart1')
        .attr('width', width2 - padding.r)
        .attr('height', totalHeight + padding.b);

    // Update axes and axis label positions 
    chart1.select(".xBottomAxis")
        .attr("transform", `translate(${padding.l},${totalHeight - padding.b})`);

    chart1.select(".axisTitle")
        .attr("y", totalHeight + 15);

    var bars = chartGroup.selectAll('.bar')
        .data(filteredData, d => d.Name);
    //enter
    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('height', barHeight)
        .attr("fill", d => assignColor(d.Region))
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
        .data(filteredData, d => d.Name);
    //enter
    labels.enter()
        .append('text')
        .attr('class', 'label')
        .style("font-family", "Verdana")
        .attr('x', -5)
        .attr('dy', '0.3em')
        .attr('text-anchor', 'end')
        .attr('y', (d, i) => {
            const yPosition = i * (barHeight + barSpacing) + 18;
            return yPosition < totalHeight ? yPosition : -9999;
        })
        .text(d => d.Name);
    //update
    labels.attr('y', (d, i) => {
        const yPosition = i * (barHeight + barSpacing) + 18;
        return yPosition < totalHeight ? yPosition : -9999;
    })
        .text(d => d.Name);
    //exit
    labels.exit().remove();
}

const assignColor = d3.scaleOrdinal()
    .domain(["Far West", "Great Lakes", "Great Plains", "Mid-Atlantic",
        "New England", "Outlying Areas", "Rocky Mountains",
        "Southeast", "Southwest"])
    .range(["#D103FF", "#B4CEFF", "#F1B4FF", "#4288FF",
        "#005EFF", "#000000", "#E679FF", "#6ea3ff", "#DD46FF"]);
