// -------- Line Graph Directive -------- //

// In order to tie the line graph data to the svg element, we build a directive for the svg element.

baseballApp.directive("lineGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='800', height='500', id='lineGraphCanvas'></svg>",
		link: function(scope, elem, attrs){

			// --- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			// Watch Days

			scope.$watch( 'days', function(){

				//do not run until scope.days has data
				if (scope.days.length){
					
					setData();
					drawLines();
				};
			});

			// Watch Date

			// scope.$watch( 'date', function(){
	
			// 	writeDate();

			// });


			// --- Draw the SVG --- //

			var width = 800;
			var height = 500;
			var topPadding = 200;
			var rightPadding = 70;
			var bottomPadding = 40;

			var svg = d3.select("#lineGraphCanvas")
						.attr("width", width)
						.attr("height", height);

			// --- Reference Functions --- //

			d3.selection.prototype.moveToFront = function() {
				return this.each(function(){
					this.parentNode.appendChild(this);
				});
			};


			// --- Color Function --- //

			// Color the lines according to their teams

			function colorTeam(id){
				var colors = ["#006837","#1a9850","#66bd63","#a6d96a","#fee08b", "#fdae61", "#f46d43", "#a50026"]  ;

				return colors[scope.days.indexOf(id)];

			};


			// --- Date Functions --- //

			// Parse date function to turn date into JavaScript date
			var parseDate = d3.time.format("%Y-%m-%d").parse;

			// Format date for presentation
			var dateFormat = d3.time.format("%b %d, %Y");

			// Set the X Scale
			var x = d3.time.scale()
						.range([0,width-rightPadding]);

			// Set the Y Scale
			var y = d3.scale.linear()
						.range([height-bottomPadding, topPadding]);

			// Line function to turn data into lines
			var line = d3.svg.line()
						.interpolate("basis")
						.x(function(d){
							return x(d.date);
						})
						.y(function(d){
							return y(d.wins_over);
						});

			// Fold lines function
			var foldLines = d3.svg.line()
								.interpolate("basis")
								.x(function(d){
									return x(d.date);
								})
								.y(function(d){
									return y(0);
								});

			// Remove the area under the lines
			var removeArea = d3.svg.area()
							.interpolate("basis")
							.x(function(d) { return x(d.date) })
							.y0(function(d) { return y(d.wins_over)})
							.y1(function(d) { return y(d.wins_over)});

			// Declare variables that can be accessed by functions
			var area;
			var daySelected;

			var minX;
			var maxX;

			var minY;
			var maxY;

			// --- Set Data --- //

			// Runs after the data loads

			function setData(){
				
				// Parse each date to make it a JavaScript date
				scope.days.forEach(function(kv){
					kv.days.forEach(function(d){
						d.date = parseDate(d.date);
					})
				});

				// Find the minimum and maximum dates in the dataset
				minX = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.date; })});
				maxX = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.date; })});
				
				// Get minimum and maximum wins over .500
				minY = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.wins_over; })});
				maxY = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.wins_over; })});

				// Set the x and y domains
				x.domain([minX, maxX]);
				y.domain([minY, maxY]);

				// Set area
				area = d3.svg.area()
							.interpolate("basis")
							.x(function(d) { return x(d.date) })
							.y0(height + y(maxY - minY) - topPadding - bottomPadding)
							.y1(function(d) { return y(d.wins_over)});
			};

			
			// --- Hover Functions --- //

			// Highlight Line

			scope.highlightLine = function(d){

				var lineId = "path#" + d.id;
				var areaId = "path#" + d.id + "_area";


				d3.selectAll("path.line")
						.style("opacity", .15);

				d3.select(lineId)
						.style("stroke-width", "8px" )
						.style("opacity", 1)
						.moveToFront();

				svg.append("text")
						.datum(d)
						.text(function(d){
							return d.id
						})
						.attr("class", "teamName")
						.attr("x", width - rightPadding - 20)
						.attr("y", y(d.days[d.days.length-1].wins_over) - 20)
						.attr("font-family", "Open Sans Condensed")
						.attr("font-size", "20px");

						
			};

			// Highlight All Lines

			function highlightAll(){

				d3.selectAll("path.line")
					.style("opacity", 1)
					.style("stroke-width", "2px");

				d3.selectAll("text.teamName").remove();

			};

			// Remove individual day area on area path

			function removeDayArea(){
							svg.select("path.dayArea").remove();
						};


			// --- Click Functions --- //


			// Click team to get data on team
			function selectTeam(keepLine, d){

				scope.getTeamData(d);

				// Find the minimum and maximum wins_over in the dataset
				var teamMin = d3.min(d.days, function(d){ return d.wins_over; });

				// Remove lines		
				svg.selectAll("path.line")
						.transition()
						.duration(1000)
						.style("opacity", 0)
						.attr("d", function(d){
							return foldLines(d.days)
						})
						.remove();

				// Remove ares
				svg.selectAll("g.areaGroup").remove();

				// Remove Y axis numbers
				svg.selectAll("text.yAxisNum")
						.attr("fill", "rgba(0,0,0,1)")
						.transition()
						.duration(1000)
						.attr("fill", "rgba(0,0,0,0)");

				// Remove team name from line
				svg.select("text.teamName")
						.attr("fill", "rgba(0,0,0,1)")
						.transition()
						.duration(1000)
						.attr("fill", "rgba(0,0,0,0)")
						.remove();


				// Generate the area
				var graphArea = svg.append("g")
									.attr("class", "areaGroup");

				graphArea.append("path")
										.datum(d)
										.attr("d", function(d){
											return removeArea(d.days)
										})
										.attr("class", "area")
										.attr("id", function(d){
											return d.id
										})
										.attr("fill", function(d){
											return colorTeam(d);
										})
										.style("opacity", 1)
										.style("cursor", "pointer")
										.on("click", function(){
											redrawLines();
										})
										.on("mousemove", function(d){
											getDayGames(this, d);
										})
										.transition()
										.duration(1000)
										.attr("d", function(d){
											return area(d.days)
										})
										.each("end", function(){
											svg.select("g.areaGroup")
												.transition()
												.duration(1000)
												.attr("transform", "translate(0," + (height - y(teamMin) - bottomPadding) + ")")

											// Move Y axis label
											svg.select("text.yAxis")
												.transition()
												.duration(1000)
												.attr("y", (height - bottomPadding - 70) )
												.attr("transform", "rotate(270 " + (width - 10) + "," + (height - bottomPadding - 70) + ")");

											// Move Y axis 0
											svg.select("text.yAxisZero")
												.transition()
												.duration(1000)
												.attr("transform", function(){
													return (teamMin < -1 ) ? "translate(0," + ((height - y(teamMin)) - bottomPadding) + ")" : "translate(0," + (((height - topPadding- bottomPadding)/2) + 5) + ")"
												});

										});

				graphArea.on("mouseleave", function(){
					removeDayArea();
					scope.removeGameTooltip();
				});
			};


			// --- Mouse Move Functions --- //

			function getDayGames(t, d){

				// Turn on tooltip
				var top = d3.mouse(document.getElementById("lineGraphCanvas"))[1];
				var left = d3.mouse(document.getElementById("lineGraphCanvas"))[0];
				
				// Find date position
				var posX = d3.mouse(t)[0];
					
				// Set empty data array to push dates to
				var dayData = [];

				// Find day objects to be incnluded in data
				var dayPosition = (posX/(width-rightPadding)) * d.days.length;
				var dayObject = d.days[Math.floor(dayPosition)]
				var priorDayObject = d.days[Math.floor(dayPosition)-1];

				if (dayObject != daySelected){

					// Run get day data function
					scope.getDayData(top, left, dayObject);

					// Set the day selected variable to the day object
					daySelected = dayObject;

					// Push dates to array
					dayData.push(priorDayObject);
					dayData.push(dayObject);

					removeDayArea();

					// Build a new path using new data
					svg.select("g.areaGroup").append("path")
											.attr("class", "dayArea")
											.attr("d", function(d){
												return area(dayData)
											})
											.attr("fill", "rgba(255,255,255,.5")
											.style("opacity", 1)
											.style("cursor", "pointer")
											.on("click", function(){
												removeDayArea();
												redrawLines();
											});
				};

			};


			// --- Redraw Lines --- //

			// Click are to redraw the lines on the graph
			function redrawLines(){

				// Get data on teams
				scope.getTeamData();

				// Remove the tooltip
				scope.removeGameTooltip();

				// Move Y Axis
				svg.select("text.yAxis")
						.transition()
						.duration(1000)
						.attr("y", ((height + y(maxY - minY) - topPadding - bottomPadding)))
						.attr("transform", "rotate(270 " + (width - 10) + "," + (height + y(maxY - minY) - topPadding - bottomPadding) + ")");

				// Move Y Axis Text
				svg.select("text.yAxisZero")
						.transition()
						.duration(1000)
						.attr("transform", "translate(0,0)");

				// Redraw Y Axis Numbers
				svg.selectAll("text.yAxisNum")
						.transition()
						.duration(1000)
						.attr("fill", "rgba(0,0,0,1)");

				svg.selectAll("g.areaGroup")
							.transition()
							.duration(1000)
							.attr("transform", "translate(0,0)")
							.each("end", function(){
								
								// Run these functions after area moves back up.

								svg.selectAll("path.area")
									.attr("d", function(d){
										return foldLines(d.days);
									})
									.transition()
									.duration(1000)
									.attr("d", function(d){
										return removeArea(d.days)
									})
									.each("end", function(){
										svg.selectAll("g.areaGroup").remove()
									});

								var graphLine = svg.selectAll("path.line")
											.data(scope.days)
											.enter()
											.append("path")
												.attr("d", function(d){
													return foldLines(d.days)
												})
												.attr("class", "line")
												.attr("id", function(d){
													return d.id;
												})
												.style("fill", "none")
												.style("stroke", function(d){
													return colorTeam(d);
												})
												.style("opacity", 0)
												.on("mouseover", function(d){
													scope.highlightLine(d);
												})
												.on("mouseout", function(){
													highlightAll()
												})
												.on("click", function(d){
													var keepLine = this;
													selectTeam(keepLine, d);
												})
												.transition()
												.duration(1000)
												.attr("d", function(d){
													return line(d.days);
												})
												.style("stroke-width", "2px")
												.style("opacity", 1)
												.attr("clip-path", "url(#clip)")
												.style("cursor", "pointer");
							});

				

			};
			

			// --- Initialize Functiones --- //
			
			
			// ====== Draw Lines ======

			// This function draws the lines for the data pulled in from the API. We will call it using a $scope.$watch function.

			function drawLines(){


				// Draw Y Axis
				var yAxis = svg.append("text")
								.attr("class", "yAxis")
								.attr("x", width - 10)
								.attr("y", ((height + y(maxY - minY) - topPadding - bottomPadding)))
								.attr("transform", "rotate(270 " + (width - 10) + "," + (height + y(maxY - minY) - topPadding - bottomPadding) + ")")
								.attr("text-anchor", "middle")
								.attr("font-family", "Open Sans Condensed")
								.text("WINS - LOSSES");

				// Draw Y Axis Numbers
				svg.append("text")
						.attr("class", "yAxisZero")
						.attr("x", width - 50)
						.attr("y", ((height + y(maxY - minY) - topPadding - bottomPadding + 5)))
						.attr("text-anchor", "middle")
						.attr("font-family", "Open Sans Condensed")
						.text("0");

				svg.append("text")
						.attr("class", "yAxisNum")
						.attr("x", width - 50)
						.attr("y", (y(maxY)))
						.attr("text-anchor", "middle")
						.attr("font-family", "Open Sans Condensed")
						.text(maxY);

				svg.append("text")
						.attr("class", "yAxisNum")
						.attr("x", width - 50)
						.attr("y", (y(minY)))
						.attr("text-anchor", "middle")
						.attr("font-family", "Open Sans Condensed")
						.text(minY);


				// Draw X Axis
				svg.append("text")
						.attr("class", "xAxis")
						.attr("x", 0)
						.attr("y", height - 5)
						.text(dateFormat(minX));

				svg.append("text")
						.attr("class", "xAxis")
						.attr("x", width - rightPadding - 60)
						.attr("y", height - 5)
						.text(dateFormat(maxX));


				var graphLine = svg.selectAll("path.line")
								.data(scope.days)
								.enter()
								.append("path")
									.attr("class", "line")
									.attr("id", function(d){
										return d.id;
									})
									.attr("d", function(d){
										return line(d.days);
									})
									.style("fill", "none")
									.style("stroke", function(d){
										return colorTeam(d);
									})
									.style("stroke-width", "2px")
									.style("cursor", "pointer")	
									.on("mouseover", function(d){
										scope.highlightLine(d);
									})
									.on("mouseout", function(){
										highlightAll()
									})
									.on("click", function(d){
										var keepLine = this;
										selectTeam(keepLine, d);
									});

				
				//Create a clip path for the curtain and lines
				// var clip = svg.append("clipPath")
				// 	.attr("id", "clip")
				// 	.append("rect")
				// 		.attr("width", width)
				// 		.attr("height", height)
					
				svg.append("rect")
									.attr("x", -1 * width)
								    .attr("y", -1 * height)
								    .attr("height", height)
								    .attr("width", width)
								    .attr("class", "curtain")
								    .attr("transform", "rotate(180)")
								    .style("fill", "#ffffff");

				svg.select("rect.curtain")
								.transition()
								.duration(300)
								.attr("width", 0)
								.ease("linear");

			};

			

		}
	}
})