//graph drawing basics
var graphDrawing = function(_graph, _svg)
{
	var g = {}
	g.cGraph = _graph
	g.svg = _svg

	g.draw = function()
	{
		//console.log("drawing....", g.cGraph.links())
		g.drawLinks()
		g.drawNodes()
		g.addInteraction()
	}

	g.addInteraction = function()
	{

		var h = g.svg.attr("height")
		var w = g.svg.attr("width")
		var buttonWidth = 131
		
		var xScale = d3.scale.linear().range([buttonWidth, w])
		var yScale = d3.scale.linear().range([0,h])

		console.log("svg element: ",g.svg, w, h)
		var node = g.svg.selectAll("g.node")

		g.svg.append("g")
		    .attr("class", "brush")
		    .call(d3.svg.brush().x(xScale).y(yScale)
		    .on("brushstart", brushstart)
		    .on("brush", brushmove)
		    .on("brushend", brushend))
		    .style('stroke', 'black')
		    .style('stroke-width', 2)
		    .style('fill-opacity', .125)
		    .style('shape-rendering', 'crispEdges')



		function brushstart() {
		  g.svg.classed("selecting", true);
		}

		function brushmove() {
		  var e = d3.event.target.extent();
		  node.classed("selected", function(d) {
			//console.log('object d ',d);
			//console.log('pos (',e,') against (',d.x/w,',',d.y/h);
		    wNorm = w - buttonWidth
		    d.selected = e[0][0] <= (d.x-buttonWidth+1)/wNorm && (d.x-buttonWidth+1)/wNorm <= e[1][0]
			&& e[0][1] <= d.y/h && d.y/h <= e[1][1];
		    return d.selected;
		  }).select("circle.node").style('fill', function(d){
			if (d.selected)
			{return 'red';
			}else{
			return 'steelblue';}
		})
		  
		}

		function brushend() {
		  g.svg.classed("selecting", !d3.event.target.empty());
		}



	}



	g.drawNodes = function()
	{
	

		var node = g.svg.selectAll("g.node")
			.data(g.cGraph.nodes(),function(d){return d.baseID}).enter().append("g")
			.attr("class", "node")
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

			.on("click", function(){
				var o = d3.select(this); 
				if (o.classed("selected"))
				{
					o.classed("selected",0)
					o.select("circle").style("fill","steelblue");
				}else{
					o.classed("selected",1)
					o.select("circle").style("fill","red");
				}
			})			
		       .on("mouseover", function(){d3.select(this).select("circle").style("fill","yellow"); })
		       .on("mouseout",function(){
				var o = d3.select(this); 
				if (o.classed("selected")) 
				{
					o.select("circle").style("fill","red");
				}else{
					o.select("circle").style("fill","steelblue");
				}
		       });

		
		node.append("circle").attr("class", "node").classed("circle", 1)
			//.attr("cx", function(d){return d.x})
			//.attr("cy", function(d){return d.y})
			.attr("r", 5)
			.style("fill", "steelblue")
			

		node.append("svg:text").attr("class", "node").classed("text", 1)
			//.attr("dx", function(d){return d.x})
			//.attr("dy", function(d){return d.y})
			.style("stroke", "black")
			.style("stroke-width", 0.5)
			.style("font-family", "Arial")
			.style("font-size", 12)
			.text(function(d) { return d.label; });		
	}


	g.drawLinks = function()
	{
		var link = g.svg.selectAll("g.link")
			.data(g.cGraph.links(),function(d){return d.baseID}).enter().append("g")
			.attr("class", "link")
			.attr("transform", function(d) { return "translate(" + d.source.x + "," + d.source.y + ")"; })
			.on("click", function(){
				var o = d3.select(this); 
				if (o.classed("selected"))
				{
					o.classed("selected",0)
					o.select("path").style("stroke","gray");
				}else{
					o.classed("selected",1)
					o.select("path").style("stroke","red");
				}
			})			
		       .on("mouseover", function(){d3.select(this).select("path").style("stroke","yellow"); })
		       .on("mouseout",function(){
				var o = d3.select(this); 
				if (o.classed("selected")) 
				{
					o.select("path").style("stroke","red");
				}else{
					o.select("path").style("stroke","gray");
				}
			});
			

		link.append("path").attr("class", "link").classed("path", 1)
			.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
			.style("stroke", "gray")
			.style("stroke-width", function(d) { return 1;}) //Math.sqrt(d.value); })

	}

	g.move = function(_graph, dTime)
	{
		g.cGraph = _graph

		var node = g.svg.selectAll("g.node")
			.data(g.cGraph.nodes(),function(d){return d.baseID})
			.transition().delay(dTime)
			.attr("transform", function(d) { /*console.log(d);*/ return "translate(" + d.x + "," + d.y + ")"; })

		var link = g.svg.selectAll("g.link")
			.data(g.cGraph.links(),function(d){return d.baseID})
			.transition().delay(dTime)
			.attr("transform", function(d) { /*console.log(d);*/ return "translate(" + d.source.x + "," + d.source.y + ")"; })
			.select("path")
				.attr("d", function(d) { return "M"+0+" "+0 +" L"+(d.target.x - d.source.x)+" "+(d.target.y - d.source.y); })
	}


	g.resize = function(_graph, dTime)
	{
		g.cGraph = _graph

		var node = g.svg.selectAll("g.node")
			.data(g.cGraph.nodes(),function(d){return d.baseID})
			.transition().delay(dTime)
		node.select("circle.node")
			.attr("r", function(d){return d.viewMetric*2})
			//.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })
			

	}


	g.show = function(_graph, dTime)
	{
		//g.cGraph = _graph

		var node = g.svg.selectAll("g.node")
			.data(g.cGraph.nodes(),function(d){return d.baseID})
			.transition().delay(500)
		node.select("circle.node")
			.attr("r", function(d){return 10})

		var node2 = g.svg.selectAll("g.node")
			.data(g.cGraph.nodes(),function(d){return d.baseID})
			.transition().delay(1000)
		node.select("circle.node")
			.style("fill", "pink")
			//.attr("transform", function(d) { console.log(d); return "scale(" + d.viewMetric + "," + d.viewMetric + ")"; })			

	}


	g.exit = function(_graph, dTime)
	{
		g.cGraph = _graph
		nodeIds = []
		linkIds = []
		_graph.nodes().forEach(function (d){nodeIds.push(d.baseID)})
		_graph.links().forEach(function (d){linkIds.push(d.baseID)})
		console.log(nodeIds)
		var node = g.svg.selectAll("g.node").data(_graph.nodes(),function(d){return d.baseID})
		node.exit().remove()

		var link = g.svg.selectAll("g.link").data(_graph.links(),function(d){return d.baseID})
		link.exit().remove()
	}

	g.clear = function()
	{
		var node = g.svg.selectAll("g.node").data([])
		node.exit().remove()

		var link = g.svg.selectAll("g.link").data([])
		link.exit().remove()
	}

	return g
}
