// -------- Line Graph Directive -------- //

// In order to tie the line graph data to the svg element, we build a directive for the svg element.

baseballApp.directive("lineGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='800', height='600', id='lineGraphCanvas'></svg>",
		link: function(scope, elem, attrs){

			// --- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			// Watch Days

			scope.$watch( 'days', function(){

				//do not run until scope.days has data
				if (scope.days.length){
					drawLines();
				};
			});

			// Watch Date

			// scope.$watch( 'date', function(){
	
			// 	writeDate();

			// });


			// --- Draw the SVG --- //

			var width = 800;
			var height = 600;

			var svg = d3.select("#lineGraphCanvas")
						.attr("width", width)
						.attr("height", height);

			// --- Date Formatting --- //

			var dateFormat = d3.time.format("%d %b %Y");


			// --- Reference Functions --- //

			d3.selection.prototype.moveToFront = function() {
				return this.each(function(){
					this.parentNode.appendChild(this);
				});
			};


			// --- Color Function --- //

			// Color the lines according to their teams

			function colorTeam(id){
				var colors = ["#006837","#1a9850", "#fee08b","#66bd63","#a6d96a","#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"]  ;

				return colors[scope.days.indexOf(id)];

			};



			// Parse date function to turn date into JavaScript date
			var parseDate = d3.time.format("%Y-%m-%d").parse;

			// Set the X Scale
			var x = d3.time.scale()
						.range([0,width-50]);

			// Set the Y Scale
			var y = d3.scale.linear()
						.range([height, 0]);

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

			// Area function to create the area under the lines
			var area = d3.svg.area()
							.interpolate("basis")
							.x(function(d) { return x(d.date) })
							.y0(height/2)
							.y1(function(d) { return y(d.wins_over)});

			// Remove the area under the lines
			var removeArea = d3.svg.area()
							.interpolate("basis")
							.x(function(d) { return x(d.date) })
							.y0(function(d) { return y(d.wins_over)})
							.y1(function(d) { return y(d.wins_over)});


			
			// --- Hover Functions --- //

			// Highlight Line

			scope.highlightLine = function(d){

				var lineId = "path#" + d.id;
				var areaId = "path#" + d.id + "_area";


				d3.selectAll("path.line")
						.attr("opacity", .15);

				d3.select(lineId)
						.style("stroke-width", "8px" )
						.attr("opacity", 1)
						.moveToFront();

				svg.append("text")
						.datum(d)
						.text(function(d){
							return d.id
						})
						.attr("class", "teamName")
						.attr("x", width-40)
						.attr("y", y(d.days[d.days.length-1].wins_over) + 5)
						.attr("font-family", "Open Sans Condensed")
						.attr("font-size", "20px");

						
			};

			// Highlight All Lines

			function highlightAll(){

				d3.selectAll("path.line")
					.attr("opacity", 1)
					.style("stroke-width", "2px");

				d3.selectAll("text.teamName").remove();

			};


			// --- Click Functions --- //


			// Click team to get data on team
			function selectTeam(keepLine, d){
						
				svg.selectAll("path.line")
							.transition()
							.duration(1000)
							.attr("d", function(d){
								return (this === keepLine) ? line(d.days) : foldLines(d.days);
							})
							.attr("class", function(d){
								return (this === keepLine) ? "line" : "line remove"
							})
							.each('end', function(){
								svg.selectAll("path.remove").remove();
							});

				var graphArea = svg.append("path")
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
										.attr("opacity", 1)
										.style("cursor", "pointer")
										.on("click", function(){
											redrawLines();
										})
										.transition()
										.duration(1000)
										.attr("d", function(d){
											return area(d.days)
										});

						
			};


			// --- Redraw Lines --- //

			// Click are to redraw the lines on the graph
			function redrawLines(){

				

				svg.selectAll("path.area")
							.attr("d", function(d){
								return foldLines(d.days);
							})
							.transition()
							.duration(1000)
							.attr("d", function(d){
								return removeArea(d.days)
							})
							.remove();

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
											.attr("clip-path", "url(#clip)")
											.style("cursor", "pointer");

			};
			

			// --- Initialize Functiones --- //
			
			
			// ====== Draw Lines ======

			// This function draws the lines for the data pulled in from the API. We will call it using a $scope.$watch function.

			function drawLines(){


				
				// Parse each date to make it a JavaScript date
				scope.days.forEach(function(kv){
					kv.days.forEach(function(d){
						d.date = parseDate(d.date);
					})
				});


				// Find the minimum and maximum dates in the dataset
				var minX = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.date; })});
				var maxX = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.date; })})

				// Set the x and y domains
				x.domain([minX, maxX]);
				y.domain([-60, 60]);

				//Create a clip path for the curtain and lines
				var clip = svg.append("clipPath")
					.attr("id", "clip")
					
				var clipRect = clip.append("rect")
									.attr("x", 0)
									.attr("y", 0)
									.attr("height", height)
									.attr("width", 0)
									.attr("class", "curtain");

				var t = svg.transition()
								.delay(0)
								.duration(300)
								.ease("linear");

				t.select("#clip").select("rect")
								.attr("width", width);

				
				// Draw the lines
				// var graphArea = svg.selectAll("path.area")
				// 				.data(scope.days)
				// 				.enter()
				// 				.append("path")
				// 				.attr("class", "area")
				// 				.attr("id", function(d){
				// 					return d.id
				// 				})
				// 				.attr("d", function(d){
				// 					return area(d.days)
				// 				})
				// 				.attr("fill", function(d, i){
				// 					return colorTeam(d,i);
				// 				})
				// 				.attr("opacity", 0)
				// 				.on("mouseout", function(d){
				// 					highlightAll();
				// 				});
								

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
									.attr("clip-path", "url(#clip)")
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

			};

				

			// function writeDate(){

			// 	svg.selectAll("g.date").select("text").remove();

			// 	// Add dates to the bottom of the graph
			// 	var dateGroup = svg
			// 					.append("g")
			// 					.attr("class", "date")
			// 					.attr("height", "50px")

			// 	var dateText = dateGroup.append("text")
			// 					.text(dateFormat(scope.date))
			// 					.attr("font-size", 36)
			// 					.attr("font-family", "Oswald")
			// 					.attr("fill", "rgba(0,0,0,.7)")
			// 					.attr("text-anchor", "end")
			// 					.attr("transform", "translate(" + (width - 100) + "," + (height - 50) + ")")

			// };


			// --- Click Functions --- //

			document.getElementById("runSim").onclick = function(){
				runSimulation();

			};

			// Run simulation

			function runSimulation(){

				// Create the transition for the curtain
				
				scope.updateDate();

			};

			

		}
	}
})