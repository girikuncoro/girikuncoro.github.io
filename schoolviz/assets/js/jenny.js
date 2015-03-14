function line_graph(){
    var margin = {top: 20, right: 20, bottom: 80, left: 50},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(d3.format("d"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line_private = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Private); });
    
var line_private_elem = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.PrivateElem); });

var line_private_sec = d3.svg.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.PrivateSec); });

var svg_private_grades = d3.select("#lines").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("Dataset/private_vs_public.json", function(error, data) {
  data.forEach(function(d) {
    d.Year = +d.Year;
    d.PrivateElem = +d.PrivateElem;
    d.PrivateSec = +d.PrivateSec;
    d.Private = +d.Private;
  });

  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain([0,
            d3.max(data, function(d) { return d.Private; })]);

  svg_private_grades.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg_private_grades.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Students (in thousands)");

  svg_private_grades.append("path")
      .datum(data)
      .attr("class", "line sec")
      .attr("data-legend", "Secondary")
      .attr("d", line_private_sec);
      
  svg_private_grades.append("path")
      .datum(data)
      .attr("class", "line elem")
      .attr("data-legend", "Elementary")
      .attr("d", line_private_elem);

  svg_private_grades.append("path")
      .datum(data)
      .attr("class", "line private")
      .attr("data-legend", "Total")
      .attr("d", line_private);
      
  svg_private_grades.append("g")
    .attr("class","legend")
    .attr("transform","translate(50,30)")
    .style("font-size","12px")
    .call(d3.legend);
});
}

function ratio_graph() {
    var margin = {top: 20, right: 20, bottom: 80, left: 40},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(d) { return d + "%"; });

var svg = d3.select("#ratio").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("Dataset/student-teacher.json", function(error, data) {
    
data.forEach(function(d) {
    d.Year = +d.Year;
    d.Private = +d.Private;
    d.Public = +d.Public;
  });
  x.domain(data.map(function(d) { return d.Year; }));
  y.domain([0, d3.max(data, function(d) { return d.Private; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-65)" 
                });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end");
      //.text("Frequency");

  svg.selectAll(".public_bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "public_bar")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Public); })
      .attr("height", function(d) { return height - y(d.Public); })
      .attr("data-legend", "Public")
      .style("opacity", "0.5");

  svg.selectAll(".private_bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "private_bar")
      .attr("x", function(d) { return x(d.Year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.Private); })
      .attr("height", function(d) { return height - y(d.Private); })
      .attr("data-legend", "Private")
      .style("opacity", "0.5");

svg.append("g")
    .attr("class","legend")
    .attr("transform","translate("+(width-100)+",30)")
    .style("font-size","12px")
    .call(d3.legend);
    
});
}