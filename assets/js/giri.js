function donut_race(){
  var radius = 74,
    padding = 10;

  // color for races
  var color = d3.scale.ordinal()
      .range(["#B9FFDB", "#A4FEDA", "#74CFAE", "#4FB791", "#53937C", "#2F544D" ]);

  // color for gender
  var color1 = d3.scale.ordinal()
      .range(["#4FB791", "#2F544D" ]);

  var arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(radius - 30);

  var pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d.percentage; });

  d3.csv("Dataset/private_races.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

    data.forEach(function(d) {
      d.races = color.domain().map(function(name) {
        return {name: name, percentage: +d[name]};
      });
    });

  var legend = d3.select("#donut1").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 2)
      .attr("height", radius * 2.5)
    .selectAll("g")
      .data(color.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  var svg = d3.select("#donut1").selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 3)
      .attr("height", radius * 2.5)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie(d.races); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.name); });

  svg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.Year; });

});

d3.csv("Dataset/private_sex.csv", function(error, data) {
  color1.domain(d3.keys(data[0]).filter(function(key) { return key !== "Year"; }));

  data.forEach(function(d) {
    d.races = color1.domain().map(function(name) {
      return {name: name, percentage: +d[name]};
    });
  });

  var legend = d3.select("#donut2").append("svg")
      .attr("class", "legend")
      .attr("width", radius * 2)
      .attr("height", radius * 2.5)
    .selectAll("g")
      .data(color1.domain().slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color1);

  legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function(d) { return d; });

  var svg = d3.select("#donut2").selectAll(".pie")
      .data(data)
    .enter().append("svg")
      .attr("class", "pie")
      .attr("width", radius * 3)
      .attr("height", radius * 2.5)
    .append("g")
      .attr("transform", "translate(" + radius + "," + radius + ")");

  svg.selectAll(".arc")
      .data(function(d) { return pie(d.races); })
    .enter().append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .style("fill", function(d) { return color1(d.data.name); });

  svg.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .text(function(d) { return d.Year; });

  });
}

function bubble_school(){
  var diameter = 650,
    format = d3.format(",d"),
    color = d3.scale.category10();

  var bubble = d3.layout.pack()
      .sort(null)
      .size([diameter, diameter])
      .padding(1.5);

  var svg = d3.select("#bubbles").append("svg")
      .attr("width", diameter)
      .attr("height", diameter)
      .attr("class", "bubble");

  d3.json("Dataset/schoolnumber.json", function(error, root) {
    var node = svg.selectAll(".node")
        .data(bubble.nodes(classes(root))
        .filter(function(d) { return !d.children; }))
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    node.append("title")
        .text(function(d) { return d.className + ": " + format(d.value); });

    node.append("circle")
        .attr("r", function(d) { return d.r; })
        .style("fill", function(d) { 
          if(d.value > 3000){return "#377F65"}
          else if(d.value > 2000){return "#429980"}
          else if(d.value > 1000){return "#4DE8C6"}
          else {return "#9BFFEE"}; 
        });

    node.append("text")
        .attr("dy", ".3em")
        .style("text-anchor", "middle")
        .style("fill", function(d){ if (d.value > 3000) { return "white"; } else { return "black";}})
        .text(function(d) { return d.className.substring(0, d.r); });
  });

  var legendCircles = [
    { "x_axis": 30, "y_axis": 30, "radius": 7, "color" : "#377F65", "texts": "> 3,000 schools" },
    { "x_axis": 30, "y_axis": 50, "radius": 7, "color" : "#429980", "texts": "2,001 - 3,000 schools" },
    { "x_axis": 30, "y_axis": 70, "radius": 7, "color" : "#4DE8C6", "texts": "1,001 - 2,000 schools" },
    { "x_axis": 30, "y_axis": 90, "radius": 7, "color" : "#9BFFEE", "texts": "< 1,000 schools" }
    ];

  var legend = svg.selectAll("circle")
                  .data(legendCircles)
                  .enter()
                .append("circle")
                  .attr("cx", function(d){ return d.x_axis; })
                  .attr("cy", function(d){ return d.y_axis; })
                  .attr("r", function(d){ return d.radius; })
                  .style("fill", function(d){ return d.color; });

  var legendText = svg.selectAll("text")
                  .data(legendCircles)
                  .enter()
                .append("text")
                  .attr("x", function(d){ return d.x_axis + 15; })
                  .attr("y", function(d){ return d.y_axis; })
                  .style("fill", "white")
                  .style("dominant-baseline", "middle")
                  .text(function(d){ return d.texts; });

  // Returns a flattened hierarchy containing all leaf nodes under the root.
  function classes(root) {
    var classes = [];

    function recurse(name, node) {
      if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
      else classes.push({packageName: name, className: node.name, value: node.size});
    }

    recurse(null, root);
    return {children: classes};
  }

  d3.select(self.frameElement).style("height", diameter + "px");
}

function hie_tuition(){
  var margin = {top: 100, right: 120, bottom: 80, left: 120},
      width = 960 - margin.left - margin.right,
      height = 1100 - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .range([0, width]);

  var barHeight = 15;

  var duration = 0,
      delay = 0;

  var partition = d3.layout.partition()
      .value(function(d) { return d.size; });

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("top");

  var svg1 = d3.select("#hie_tuition").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg1.append("g")
      .attr("class", "x axis");

  svg1.append("g")
      .attr("class", "y axis")
    .append("line")
      .attr("y1", "100%");

  svg1.append("text")
      .attr("x", width + 20)
      .attr("y", -9)
      .text("USD");

  d3.json("Dataset/average.json", function(error, d) {
    partition.nodes(d);
    var i = 0;

    // Per above, entering bars are immediately visible.
    var enter = bar1(d)
        .attr("transform", stack(i));

    // Update the x-scale domain.
    x.domain([0, d3.max(d.children, function(d) { return d.value; })]).nice();

    // Update the x-axis.
    svg1.selectAll(".x.axis")
        .call(xAxis);

    // Transition entering bars to their new position.
    var enterTransition = enter.transition()
        .duration(duration)
        .attr("transform", function(d, i) { return "translate(0," + barHeight * i * 1.2 + ")"; });

    // Transition entering rects to the new x-scale.
    enterTransition.select("rect")
        .attr("width", function(d) { return x(d.value); })
        .style("fill", function(d) {
          if (d.value > 20000){ return "#39715D"; } 
          else if (d.value > 15000){ return "#4FB791"; } 
          else if (d.value > 10000){ return "#5BD4A8"; } 
          else if (d.value > 5000){ return "#69F2CD"; } 
          else { return "#91FADF";}
        });
  });

  // Creates a set of bars for the given data node, at the specified index.
  function bar1(d) {
    var bar1 = svg1.insert("g", ".y.axis")
        .attr("class", "enter")
        .attr("transform", "translate(0,5)")
      .selectAll("g")
        .data(d.children)
      .enter().append("g")
        .style("cursor", function(d) { return !d.children ? null : "pointer"; })

    bar1.append("text")
        .attr("x", -6)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.name; });
    
    bar1.append("rect")
        .attr("width", function(d) { return x(d.value); })
        .attr("height", barHeight);

    bar1.append("text")
        .attr("x", function(d) { return x(d.value)/24200 - 5; })
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("fill", function(d) { if (d.value > 10000) { return "white"; }else{ return "#397162"; }} )
        .text(function(d) { return (d.value / 1000).toFixed(1) + 'k'; });
    return bar1;
  }

  // A stateful closure for stacking bars horizontally.
  function stack(i) {
    var x0 = 0;
    return function(d) {
      var tx = "translate(" + x0 + "," + barHeight * i * 1.2 + ")";
      x0 += x(d.value);
      return tx;
    };
  }

}