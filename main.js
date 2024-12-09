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

/**
Detials on demand (hovering? Clicking?)
Acceptance rate vs SAT Score
Dots are colored based on region
*/
    var chart2 = d3
    .select("#chart2")
    .append("svg:svg")
    .attr("id", "svg2")
    .attr("width", width)
    .attr("height", height);

    function scaleAccept(AcceptanceRate) { // formerlly attack
        return acceptScale(AcceptanceRate);
    }

    function scaleSAT(SATScore) { //formerly defense
        return satScale(SATScore);
    }

    function scaleCost(speed) {
        return costScale(speed);
    }
    

    // **** Start of Code for creating scales for axes and data plotting****

    var acceptScale = d3.scaleLinear()
        .domain(d3.extent(csv, d => d.AcceptanceRate))
        .range([50, 450]);

    var satScale = d3.scaleLinear()
        .domain(d3.extent(csv, d => d.SATScore))
        .range([450, 50])

    // Scale for the speed attribute, mapping to a radius range
    var costScale = d3.scaleLinear()
        .domain(d3.extent(csv, d => d.Cost))
        .range([2, 6]);

    var svg = d3.select('svg');

    

    // **** End of Code for creating scales for axes and data plotting****

    var tooltip = d3.select('#chart2')
        .append('div')
		.attr('class', 'tooltip')
		.style('position', 'absolute')
		.style('background-color', 'white')
		.style('border', '1px solid black')
		.style('padding', '5px')
		.style('border-radius', '5px')
		.style('opacity', 0); // Start with opacity 0 to keep it hidden

    // X-axis - Append to svg (axis and label)

    var x_axis = d3.axisBottom(acceptScale); 

    var chart2Stuff = chart2.append('g')
    .attr("width", width) 
    .attr("height", height)
    .attr('class', 'x axis')
    .attr("transform", "translate(0,450)") 
    .call(x_axis);

    chart2.append("text")
    .attr('class', 'x axis')
    .attr("transform", "translate(225,475)") 
    .text("Acceptance Rate");

    // Y-axis - Append to svg (axis and label)

    
    var y_axis = d3.axisLeft(satScale); 

    chart2.append('g')
    .attr("width", width) 
    .attr("height", height)
    .attr('class', 'y axis')
    .attr("transform", "translate(50,0) ") 
    .text("y Axis")
    //.attr("transform", "rotate(90)") 
     .call(y_axis) ;

     chart2.append("text")
     .attr('class', 'y axis')
     .attr("transform", "rotate(90) translate(170, 0) ")
     .text("SAT Average");

    // Title - Append to svg

    
    chart2.append("text")
    .attr("transform", "translate(175,40)") 
    .style("font-size", "13px")
    .style("font-family", "Georgia")
    .text("Colleges Acceptance Rate vs SAT Average");
    

    // Plot the points & scale radius by speed - Enter and append
    var highSpeed = 100;
    chart2.append('g')
    .selectAll(".dot")
    .data(csv)
    .enter()

    .append("circle")
    .attr("class", "dot")
    .attr("cx", function (d) { return scaleAccept(d.AcceptanceRate); } )
    .attr("cy", function (d) { return scaleSAT(d.SATScore); } )
    //.attr("r", 5)
    .attr("r", function (d) { return scaleCost(d.Cost); })
    //.style("fill" ,"steelblue")
  //  .style('fill', function(d) {
    //    return d.Speed > highSpeed ? '#FFD700' : 'steelblue';
   // })
    .style("opacity" ,"0.7")
    .on('mouseover', function(event, i) {
        const a = csv[i]; // Use 'i' as an index to access the correct object
        //console.log(csv)
        //console.log(i)
        //console.log(a)
        const cx = scaleAccept(i["Admission Rate"]);// TO-DO: Get the x-position for the tooltip
        const cy = scaleSAT(i["SAT Average"]);// TO-DO: Get the y-position for the tooltip
        //const pointer = d3.pointer(event);
        // TO-DO: Style the tooltip correctly.
        var htmlText = "";
       // if (d["Type 2"] == '') {
        htmlText = "<b>" + i.Name + "</b><br\>" + "Region: " + i.Region+ "</b><br\>" + "Cost: $" + i.Cost;
      //  } else {
           // htmlText = "<b>" + d.Name + "</b><br\>" + "Type 1: " + d["Type 1"] + "<br\>" + "Type 2: " + d["Type 2"];
       // }
       // console.log(event.pageX)
        tooltip
        .attr("class", "tooltip")
        .html(`${htmlText}`)
        .style("Left", event.pageX+25 + "px")
        .style("Top", event.pageY-35 + "px")
        .style("opacity", "1.0")
        .style("position", "absolute")
    }).on('mouseout', function() {
        // TO-DO: Hide the tooltip when not hovering
        return tooltip.style("opacity", "0.0");
    })
    .attr("class", d => {
        if (d.Region == "Outlying Areas"){
            return "outlying";
        } else if (d.Region == "New England") {
            return "newengland";
        } else if (d.Region == "Mid-Atlantic") {
            return "midatlantic";
        } else if (d.Region == "Southeast") {
            return "southeast";
        } else if (d.Region == "Great Lakes") {
            return "greatLakes";
        } else if (d.Region == "Great Plains") {
            return "greatPlains";
        } else if (d.Region == "Rocky Mountains") {
            return "rocky";
        } else if (d.Region == "Southwest") {
            return "southwest";
        } else {
            return "farWest";
        } 
    });


    d3
    .select("#newEngland")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "newengland")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#midAtlantic")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "midatlantic")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#southEast")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "southeast")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#greatLakes")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "greatLakes")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#greatPlains")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "greatPlains")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#rockY")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "rocky")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#southWest")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "southwest")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#farWest")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "farWest")
    .attr("stroke-width", 1)
    .attr("stroke", "black");

    d3
    .select("#outLying")
    .append("circle")
    .attr("cx", 6 )
    .attr("cy", 6)
    .attr("r", 5)
    .attr("class", "outlying")
    .attr("stroke-width", 1)
    .attr("stroke", "black");




    //***************** Chart 1 ******************//
    console.log(csv);
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

    // Bars for charts
    var bars = chartGroup.selectAll('.bar')
        .data(filteredData, d => d.Name);
    // Enter
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
    // Update
    bars.attr('width', d => xScale(d.Cost))
        .attr('y', (d, i) => {
            const yPosition = i * (barHeight + barSpacing) + 10;
            return yPosition < totalHeight ? yPosition : -9999;
        });
    // Exit
    bars.exit().remove();


    // Text labels for bars
    var labels = chartGroup.selectAll('.label')
        .data(filteredData, d => d.Name);
    // Enter
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
    // Update
    labels.attr('y', (d, i) => {
        const yPosition = i * (barHeight + barSpacing) + 18;
        return yPosition < totalHeight ? yPosition : -9999;
    })
        .text(d => d.Name);
    // Exit
    labels.exit().remove();

    // Price labels on bars
    var priceLabels = chartGroup.selectAll('.price-label')
        .data(filteredData, d => d.Name);
    // Enter
    priceLabels.enter()
        .append('text')
        .attr('class', 'price-label')
        .attr('x', d => xScale(d.Cost) - 5) // Near the end of the bar
        .attr('y', (d, i) => i * (barHeight + barSpacing) + barHeight / 2 + 11) // Vertically centered
        .attr('text-anchor', 'end')
        .style('fill', 'white') 
        .style('font-size', '12px')
        .style('dominant-baseline', 'middle')
        .text(d => `$${d3.format(",.0f")(d.Cost)}`);
    // Update
    priceLabels.attr('x', d => xScale(d.Cost) - 5)
        .attr('y', (d, i) => i * (barHeight + barSpacing) + barHeight / 2 + 10)
        .text(d => `$${d3.format(",.0f")(d.Cost)}`);
    // Exit
    priceLabels.exit().remove();
}

const assignColor = d3.scaleOrdinal()
    .domain(["Far West", "Great Lakes", "Great Plains", "Mid-Atlantic",
        "New England", "Outlying Areas", "Rocky Mountains",
        "Southeast", "Southwest"])
    .range(["#D103FF", "#B4CEFF", "#F1B4FF", "#4288FF",
        "#005EFF", "#000000", "#E679FF", "#6ea3ff", "#DD46FF"]);
