var width = 500;
var height = 500;

var width2 = 900;
var svg = d3.select('svg');

var padding = { t: 60, r: 40, b: 30, l: 120 };

// Compute chart dimensions
var barChartWidth = width2 - padding.l - padding.r;
var chartHeight = height - padding.t - padding.b;

d3.csv("colleges.csv").then(function (csv) {
    csv.forEach(d => {
        d.Name = d.Name; // Column: "Name" (string, no conversion needed)
        d.Region = d.Region; // Column: "Region" (string, no conversion needed)
        d.Cost = +d["Average Cost"]; // Column: "Average Cost" -> convert to numeric
        d.AcceptanceRate = +d["Admission Rate"]; // Column: "Admission Rate" -> convert to numeric
        d.SATScore = +d["SAT Average"]; // Column: "SAT Average" -> convert to numeric
    });

    var chart2 = d3
    .select("#chart2")
    .append("svg:svg")
    .attr("id", "svg2")
    .attr("width", width)
    .attr("height", height);



/**
Detials on demand (hovering? Clicking?)
Acceptance rate vs SAT Score
Dots are colored based on region
*/

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

    chart2.append('g')
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
    .text("Colleges Acceptance Rate vs SAT Average");
    

    // Plot the points & scale radius by speed - Enter and append
    var highSpeed = 100;
    chart2.append('g')
    .selectAll("dot")
    .data(csv)
    .enter()

    .append("circle")
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





    console.log(csv);
})

