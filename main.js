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

    console.log(csv);
})