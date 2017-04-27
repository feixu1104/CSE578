/**
 * Created by aishpratap on 4/22/17.
 */
// setup x
var segmentsStacked = [ "win", "lose" ];

var selectedMatches = [], selectedMatchData = [];
var scatterPlot, barChart;
var color = d3.scale.ordinal().domain(segmentsStacked).range(
		[ "#0000CC", "#CC0000" ]);

function BarChart(container) {

	var defaults = {
		margin : {
			top : 20,
			right : 20,
			bottom : 30,
			left : 40
		},
		yAxisNumTicks : 10,
		yAxisTickFormat : ""
	}, model = Model(defaults), xAxis = d3.svg.axis().orient("bottom"), yAxis = d3.svg
			.axis().orient("left"),
	// zoom = d3.behavior.zoom()
	//     .scaleExtent([1, 10])
	//     .on("zoom", zoomed),
	svg = d3.select(container).append('svg')

	// Use absolute positioning on the SVG element
	// so that CSS can be used to position the div later
	// according to the model `box.x` and `box.y` properties.
	.attr("style", "width:50%;height:100%;"), g = svg.append("g"), xAxissvg = g
			.append('svg').style("overflow", "hidden"), yAxisG = g.append("g")
			.attr("class", "y axis"), stackG = xAxissvg.append("g"), xAxisG = xAxissvg
			.append("g").attr("class", "x axis"), yAxisText = yAxisG.append(
			"text").attr("transform", "rotate(-90)").attr("y", -40).attr("dy",
			".71em").style("text-anchor", "end");

	// Encapsulate D3 Conventional Margins.
	// See also http://bl.ocks.org/mbostock/3019563

	model.when([ "box", "margin" ], function(box, margin) {
		model.width = box.width - margin.left - margin.right,
				model.height = box.height - margin.top - margin.bottom;
	});
	model.when("margin", function(margin) {
		g
				.attr("transform", "translate(" + margin.left + ","
						+ margin.top + ")");
	});

	// Adjust Y axis tick mark parameters.
	// See https://github.com/mbostock/d3/wiki/Quantitative-Scales#linear_tickFormat
	model.when([ 'yAxisNumTicks', 'yAxisTickFormat' ], function(count, format) {
		yAxis.ticks(count, format);
	});

	// Respond to changes in size and offset.
	model.when("box", function(box) {

		// Resize the svg element that contains the visualization.
		svg.attr("width", box.width).attr("height", box.height);

		// Set the CSS `left` and `top` properties
		// to move the SVG element to `(box.x, box.y)`
		// relative to the container div to apply the offset.
		svg.style('left', box.x + 'px').style('top', box.y + 'px');
	});

	model.when("height", function(height) {
		xAxisG.attr("transform", "translate(0," + height + ")");
	});

	model.when([ "data", "xAttribute", "width" ], function(data, xAttribute,
			width) {

		xWidth = data[0].length * 54;

		svg.call(d3.behavior.zoom().scaleExtent([ 1, 1 ])
				.on(
						"zoom",
						function() {

							var e = d3.event, tx = Math.min(0, Math
									.max(e.translate[0]));

							tx = Math.max(tx, -54 * (data[0].length - 10));

							stackG
									.attr("transform", "translate(" + tx
											+ ", 0)");

							var currenty = d3.transform(xAxisG
									.attr("transform")).translate[1];

							xAxisG.attr("transform", "translate(" + tx + ", "
									+ currenty + ")");
						}));

		model.xScale = d3.scale.ordinal()
				.rangeRoundBands([ 0, xWidth ], 0.2, 0).domain(
						data[0].map(function(d) {
							return d.x;
						}));

	});

	model.when([ "data", "yAttribute", "height" ], function(data, yAttribute,
			height) {

		var yStackMax = d3.max(data, function(data) {
			return d3.max(data, function(d) {
				return d.y0 + d.y;
			});
		});

		model.yScale = d3.scale.linear().range([ height, 0 ]).domain(
				[ 0, yStackMax ])
	});

	model.when([ "xScale" ], function(xScale) {

		xAxis.scale(xScale)
		xAxisG.call(xAxis).selectAll("text").attr("y", 20).attr("x", 0).attr(
				"dy", ".35em").attr("transform", "rotate(-15)");
	});

	model.when([ "yScale" ], function(yScale) {
		yAxis.scale(yScale)
		yAxisG.call(yAxis);
	});

	model.when("yAxisLabel", yAxisText.text, yAxisText);

	model.when([ "data", "xAttribute", "yAttribute", "xScale", "yScale",
			"height" ], function(data, xAttribute, yAttribute, xScale, yScale,
			height) {

		var layer = stackG.selectAll(".layer").data(data);

		layer.enter().append("g").attr("class", "layer").style("fill",
				function(d, i) {
					return color(i);
				});

		var bars = layer.selectAll(".bar").data(function(d) {
			return d;
		});

		bars.enter().append("rect").attr("class", "bar");

		bars.attr("x", function(d) {
			return xScale(d.x);
		}).attr("width", function(d) {
			// if(data[0].length > 12){
			//     return 42;
			// }else{
			//     return xScale.ranger()
			// }
			return 50;

		}).attr("y", function(d) {
			return yScale(d.y0 + d.y);
		}).attr("height", function(d) {
			return yScale(d.y0) - yScale(d.y0 + d.y);
		});

		bars.exit().remove();
		layer.exit().remove();
	});

	return model;
}

function ScatterPlot(div) {
	var x = d3.scale.linear(), y = d3.scale.linear(), xAxis = d3.svg.axis()
			.scale(x).orient('bottom'), yAxis = d3.svg.axis().scale(y).orient(
			'left'),

	svg = d3.select(div).append('svg'), g = svg.append('g'), xAxisG = g.append(
			'g').attr('class', 'x axis'), yAxisG = g.append('g').attr('class',
			'y axis'), xAxisLabel = xAxisG.append('text')
			.attr('class', 'label').attr('y', -6).style('text-anchor', 'end'), yAxisLabel = yAxisG
			.append('text').attr('class', 'label').attr('transform',
					'rotate(-90)').attr('y', 6).attr('dy', '.71em').style(
					'text-anchor', 'end'),

	brushG = g.append('g').attr('class', 'brush'), dotsG = g.append('g').attr(
			'class', 'plots'), brush = d3.svg.brush().on('brush', brushed).on(
			'brushend', brushend), dots, quadtree, model = Model();

	model.when('xLabel', xAxisLabel.text, xAxisLabel);
	model.when('yLabel', yAxisLabel.text, yAxisLabel);

	model.when('margin', function(margin) {
		g
				.attr('transform', 'translate(' + margin.left + ','
						+ margin.top + ')');
	});

	model.when('box', function(box) {
		svg.attr('width', box.width).attr('height', box.height);

		svg.style('left', box.x + 'px').style('top', box.y + 'px')
	});

	model.when([ 'box', 'margin' ], function(box, margin) {
		model.width = box.width - margin.left - margin.right;
		model.height = box.height - margin.top - margin.bottom;
	});

	model.when('width', function(width) {
		xAxisLabel.attr('x', width);
	});

	model.when('height', function(height) {
		xAxisG.attr('transform', 'translate(0,' + height + ')');
	});

	model.when([ 'width', 'height' ], function(width, height) {
		brush.x(d3.scale.identity().domain([ 0, width ]));
		brush.y(d3.scale.identity().domain([ 0, height ]));
		brushG.call(brush).call(brush.event);
	});

	model.when([ 'width', 'height', 'data', 'xField', 'yField' ], function(
			width, height, data, xField, yField) {

		// Updated the scales
		x.domain(d3.extent(data, function(d) {
			return d[xField];
		})).nice();
		y.domain(d3.extent(data, function(d) {
			return d[yField];
		})).nice();

		x.range([ 0, width ]);
		y.range([ height, 0 ]);

		// update the quadtree
		quadtree = d3.geom.quadtree().x(function(d) {
			return x(d[xField]);
		}).y(function(d) {
			return y(d[yField]);
		})(data);

		// update the axes
		xAxisG.call(xAxis);
		yAxisG.call(yAxis);

		// Plot the data as dots
		dots = dotsG.selectAll('.dot').data(data);
		dots.enter().append('circle').attr('class', 'dot').attr('r', 3.5);
        dots.selectAll('title').remove();
		dots.attr('cx', function(d) {
			return x(d[xField]);
		}).attr('cy', function(d) {
			return y(d[yField]);
		}).attr('fill', function(d) {
			if (d.result == "lose")
				return "#cc0000";
			else
				return "#0000cc";
		}).on("mouseover", function(d) {
			d3.select(this).transition().duration(200).attr('r', 8);
		}).on("mouseout", function(d) {
			d3.select(this).transition().duration(300).attr('r', 3.5);
		}).append('title').text(
				function(d) {

					console.log("tittle added");

					var result;
					if (d.result == "win")
						result = "Match Won";
					else
						result = "Match Lost";

					return d.playerName + '\nRuns: ' + d.runsScored
							+ '\nBalls Faced: ' + d.ballsFaced + '\nResult: '
							+ result
				});

		dots.exit().remove();

		d3.selectAll('circle').classed("shown", true);
	});
	return model;

	function brushed() {
		var e = brush.extent(), selectedData;
		if (dots) {
			dots.each(function(d) {
				d.selected = false;
			});
			selectedData = search(e[0][0], e[0][1], e[1][0], e[1][1]);
			d3.selectAll('circle').classed("unselected", function(d) {

				var selectedEle = d3.select(this);

				if (selectedEle.classed('shown')) {
					return !d.selected;
				}
				return true;
			})
		}

		if (brush.empty()) {
			if (selectedMatchData.length == 0)
				model.selectedData = model.data;
			else if (selectedMatchData.length > 0) {
				model.selectedData = selectedMatchData;
			}
		} else {
			model.selectedData = selectedData;
		}
	}

	function brushend() {

		if (brush.empty()) {
			svg.selectAll(".unselected").classed("unselected", function(d) {

				var selectedEle = d3.select(this);
				return !selectedEle.classed('shown');

			});
		}
	}

	// Find the nodes within the specified rectangle.
	function search(x0, y0, x3, y3) {
		var selectedData = [];
		quadtree.visit(function(node, x1, y1, x2, y2) {
			var d = node.point, x, y;
			if (d) {
				x = node.x;
				y = node.y;
				d.visited = true;
				if (x >= x0 && x < x3 && y >= y0 && y < y3) {

					if (selectedMatches.length == 0
							|| selectedMatches.indexOf(d.match_id) > -1) {
						d.selected = true;
						selectedData.push(d);
					}

				}
			}
			return x1 >= x3 || y1 >= y3 || x2 < x0 || y2 < y0;
		});
		return selectedData;
	}

}

//Use this method to highlight the innings in a particular match based on the match id
function selectInningsByMatchId(matchIds) {

	selectedMatchData = [];

	selectedMatches = matchIds;

	if (matchIds.length > 0) {
		d3.selectAll('circle').classed("unselected", function(d) {

			if (matchIds.indexOf(d.match_id) > -1) {
				return false;
			}
			return true;
		}).classed('shown', function(d) {
			if (matchIds.indexOf(d.match_id) > -1) {
				d.selected = true;
				selectedMatchData.push(d);
				return true;
			}
			return false;
		})
	} else {
		d3.selectAll('circle').classed("unselected", false);
		d3.selectAll('circle').classed('shown', function(d) {
			d.selected = true;
			selectedMatchData.push(d);
			return true;
		});
	}

	//
	var playerCount = {};
	selectedMatchData.forEach(function(d) {

		if (!playerCount[d.playerName]) {
			playerCount[d.playerName] = [ 0, 0 ];
		}
		if (d.result == "win") {
			playerCount[d.playerName][0]++;
		} else {
			playerCount[d.playerName][1]++;
		}
	});

	// Flatten the object containing species counts into an array.
	// Update the bar chart with the aggregated data.
	var playerdata = Object.keys(playerCount).map(function(playerName) {
		return {
			players : playerName,
			count : playerCount[playerName][0] + playerCount[playerName][1],
			win : playerCount[playerName][0],
			lose : playerCount[playerName][1]
		};
	});

	barChart.data = d3.layout.stack()(segmentsStacked.map(function(component) {
		return playerdata.map(function(d) {
			return {
				x : d["players"],
				y : +d[component]
			}
		})
	}));


}

function callScatterPlot() {
	var country = getCountry()
	var oppositionCountry = getPlayedAgainst()
	if (oppositionCountry.toUpperCase() === "ALL")
		oppositionCountry = ""
	selectDataForTeamAndOpposition(country, oppositionCountry)
}

//responds to events such as team selection as well as opposition selection.
function selectDataForTeamAndOpposition(team, opposition) {
	console.log(team + ":" + opposition)
	d3.queue().defer(d3.csv, 'performanceTableEnhanced.csv', function(d) {
		if (d.team == team) {
			if (opposition == d.opposition || opposition.length == 0) {
				d.runsScored = +d.runsScored;
				d.ballsFaced = +d.ballsFaced;
				return d;
			}
		}
	}).await(loadData);

	function loadData(error, data) {
		// Set the data.
		scatterPlot.data = data;
	}
}

//used to wrap long texts of labels into multipe lines.
function wrap(text, width) {
	text
			.each(function() {
				var text = d3.select(this), words = text.text().split(/\s+/)
						.reverse(), word, line = [], lineNumber = 0, lineHeight = 1.1, // ems
				y = text.attr("y"), dy = parseFloat(text.attr("dy")), tspan = text
						.text(null).append("tspan").attr("x", 0).attr("y", y)
						.attr("dy", dy + "em");
				while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [ word ];
						tspan = text.append("tspan").attr("x", 0).attr("y", y)
								.attr("dy",
										++lineNumber * lineHeight + dy + "em")
								.text(word);
					}
				}
			});
}

// The main program that assembles the linked views.
//

function main(teamName, opposition) {
	// Grab the container div from the DOM.
	var div = document.getElementById('container');
	// Add both visualizations to the same div.
	// Each will create its own SVG element.
	scatterPlot = ScatterPlot(div), barChart = BarChart(div);

	// Configure the scatter plot to use the iris data.
	scatterPlot.set({
		xField : 'runsScored',
		yField : 'ballsFaced',
		xLabel : 'runs',
		yLabel : 'balls',
		margin : {
			'top' : 20,
			'right' : 20,
			'bottom' : 30,
			'left' : 40
		}
	});

	// Configure the bar chart to use the aggregated iris data.
	barChart.set({
		xAttribute : 'players',
		yAttribute : 'count',
		yAxisLabel : 'number of matches',
		margin : {
			'top' : 20,
			'right' : 20,
			'bottom' : 30,
			'left' : 40
		}
	});

	// Compute the aggregated iris data in response to brushing
	// in the scatter plot, and pass it into the bar chart.
	scatterPlot.when('selectedData', function(scatterData) {
		var playerCount = {};

		// Aggregate scatter plot data by counting
		// the number of irises for each species.
		scatterData.forEach(function(d) {
			if (!playerCount[d.playerName]) {
				playerCount[d.playerName] = [ 0, 0 ];
			}
			if (d.result == "win") {
				playerCount[d.playerName][0]++;
			} else {
				playerCount[d.playerName][1]++;
			}
		});

		// Flatten the object containing species counts into an array.
		// Update the bar chart with the aggregated data.
		var playerdata = Object.keys(playerCount).map(
				function(playerName) {
					return {
						players : playerName,
						count : playerCount[playerName][0]
								+ playerCount[playerName][1],
						win : playerCount[playerName][0],
						lose : playerCount[playerName][1]
					};
				});

		barChart.data = d3.layout.stack()(
				segmentsStacked.map(function(component) {
					return playerdata.map(function(d) {
						return {
							x : d["players"],
							y : +d[component]
						}
					})
				}));
	});

	// Load the iris data.

	d3.queue().defer(d3.csv, 'performanceTableEnhanced.csv', function(d) {
		if (d.team == teamName) {
			if (opposition == d.opposition || opposition.length == 0) {
				d.runsScored = +d.runsScored;
				d.ballsFaced = +d.ballsFaced;
				return d;
			}
		}
	}).await(loadData);

	function loadData(error, data) {

		// Set sizes once to initialize.
		setSizes();

		// Set sizes when the user resizes the browser.
		window.addEventListener('resize', setSizes);

		// Set the data.
		scatterPlot.data = data;
	}

	// Sets the `box` property on each visualization
	// to arrange them within the container div.
	function setSizes() {

		// Put the scatter plot on the left.
		scatterPlot.box = {
			x : 0,
			y : 0,
			width : div.clientWidth / 2,
			height : div.clientHeight
		};

		// Put the bar chart on the right.
		barChart.box = {
			x : div.clientWidth / 2,
			y : 0,
			width : div.clientWidth / 2,
			height : div.clientHeight
		};
	}

}
main("India", "");