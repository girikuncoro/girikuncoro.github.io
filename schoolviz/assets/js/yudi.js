function us_map(){
	//Width and height
	var w = 1000;
	var h = 600;

	//Define map projection
	var projection = d3.geo.albersUsa()
						   .translate([w/2, h/2])
						   .scale([1000]);

	//Define path generator
	var path = d3.geo.path()
					 .projection(projection);
					 
	//Define quantize scale to sort data values into buckets of color
	var color = d3.scale.quantize()
		.range(["rgb(237,248,233)","rgb(186,228,179)","rgb(116,196,118)","rgb(49,163,84)","rgb(0,109,44)"]);

		//Colors taken from colorbrewer.js, included in the D3 download

	//Create SVG element
	var svg = d3.select("#map")
				.append("svg")
				.attr("width", w)
				.attr("height", h);

	var legendCircles = [
	    { "x_axis": w-200, "y_axis": h-110, "radius": 7, "color" : "#2F544D", "texts": "> $20,000" },
	    { "x_axis": w-200, "y_axis": h-90, "radius": 7, "color" : "#53937C", "texts": "between $15,000 and $20,000" },
	    { "x_axis": w-200, "y_axis": h-70, "radius": 7, "color" : "#4FB791", "texts": "between $10,000 and $15,000" },
	    { "x_axis": w-200, "y_axis": h-50, "radius": 7, "color" : "#74CFAE", "texts": "between $5,000 and $10,000" },
	    { "x_axis": w-200, "y_axis": h-30, "radius": 7, "color" : "#A4FEDA", "texts": "< $5,000" }
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
	                .style("fill", "black")
	                .style("dominant-baseline", "middle")
	                .text(function(d){ return d.texts; });

	//Load in agriculture data
	d3.csv("Dataset/averagecost.csv", function(data) {

		//Set input domain for color scale
		color.domain([
			d3.min(data, function(d) { return d.value; }), 
			d3.max(data, function(d) { return d.value; })
		]);

		//Load in GeoJSON data
		d3.json("Dataset/us-states.json", function(json) {

			//Merge the ag. data and GeoJSON
			//Loop through once for each ag. data value
			for (var i = 0; i < data.length; i++) {
		
				//Grab state name
				var dataState = data[i].state;
				
				//Grab data value, and convert from string to float
				var dataValue = parseFloat(data[i].value);
		
				//Find the corresponding state inside the GeoJSON
				for (var j = 0; j < json.features.length; j++) {
				
					var jsonState = json.features[j].properties.name;
		
					if (dataState == jsonState) {
				
						//Copy the data value into the JSON
						json.features[j].properties.value = dataValue;
						
						//Stop looking through the JSON
						break;
						
					}
				}		
			}
            
			//Bind data and create one path per GeoJSON feature
			svg.selectAll("path")
			   .data(json.features)
			   .enter()
			   .append("path")
			   .attr("d", path)

				 .attr("id", function (d, i) {
				                         return d.id
				                      })
				                      .attr("id", function (d, i) { return d.id})
			   .style("stroke", "#f2f2f2")
			   .style("fill", function(d) {
			   		//Get data value
			   		var value = d.properties.value;

			   		if (value > 20000){ return "#2F544D"; } 
			        else if (value  > 15000){ return "#53937C"; } 
			        else if (value  > 10000){ return "#4FB791"; } 
			        else if (value  > 5000){ return "#74CFAE"; } 
			        else {return "#A4FEDA";}
			   });
		});
	});
}