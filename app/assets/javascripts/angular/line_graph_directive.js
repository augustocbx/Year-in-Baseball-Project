// -------- Line Graph Directive -------- //

// In order to tie the line graph data to the svg element, we build a directive for the svg element.

baseballApp.directive("lineGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='700', height='750', id='lineGraphCanvas'></svg>",
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

			scope.$watch( 'date', function(){
	
				writeDate();

			});


			// --- Draw the SVG --- //

			var width = 700;
			var height = 150;

			var svg = d3.select("#lineGraphCanvas")
						.attr("width", width)
						.attr("height", height);

			// --- Date Formatting --- //

			var dateFormat = d3.time.format("%d %b %Y");

			// --- Color Function --- //

			// Color the lines according to their teams

			function colorTeam(data){
				if (data.id == "BSN"){
					return "rgba(245,170,26,1)"
				}
				else if (data.id == "BRO"){
					return "rgba(11,72,107,1)"
				}
				else if (data.id == "CHC"){
					return "rgba(50,124,203,1)"
				}
				else if (data.id == "CIN"){
					return "rgba(206,18,13,1)"
				}
				else if (data.id == "NYG"){
					return "rgba(255,102,0,1)"
				}
				else if (data.id == "PHI"){
					return "rgba(0,0,0,1)"
				}
				else if (data.id == "PIT"){
					return "rgba(255,221,0,1)"
				}
				else if (data.id == "STL"){
					return "rgba(128,15,37,1)"
				}
			};
			

			// --- Draw lines --- //

			// This function draws the lines for the data pulled in from the API. We will call it using a $scope.$watch function.

			function drawLines(){

				// Parse date function to turn date into JavaScript date
				var parseDate = d3.time.format("%Y-%m-%d").parse;

				// Set the X Scale
				var x = d3.time.scale()
							.range([0,width]);

				// Set the Y Scale
				var y = d3.scale.linear()
							.range([0, height]);

				// Line function to turn data into lines
				var line = d3.svg.line()
								.x(function(d){
									return x(d.date);
								})
								.y(function(d){
									return y(d.place);
								});

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
				y.domain([0, 10]);

				// Create a clip path for the curtain and lines
				var clip = svg.append("clipPath")
					.attr("id", "clip")
					
				var clipRect = clip.append("rect")
									.attr("x", 0)
									.attr("y", 0)
									.attr("height", height)
									.attr("width", 0)
									.attr("class", "curtain");
				
				// Draw the lines
				var graphLine = svg.selectAll("path")
								.data(scope.days)
								.enter()
								.append("path")
									.attr("d", function(d){
									return line(d.days);
									})
									.style("fill", "none")
									.style("stroke", function(d){
									return colorTeam(d);
									})
									.style("stroke-width", "2px")
									.attr("clip-path", "url(#clip)");

			};

			function writeDate(){

				svg.selectAll("g.date").select("text").remove();

				// Add dates to the bottom of the graph
				var dateGroup = svg
								.append("g")
								.attr("class", "date")
								.attr("height", "50px")

				var dateText = dateGroup.append("text")
								.text(dateFormat(scope.date))
								.attr("font-size", 36)
								.attr("font-family", "Oswald")
								.attr("fill", "rgba(0,0,0,.7)")
								.attr("text-anchor", "end")
								.attr("transform", "translate(" + (width - 100) + "," + (height - 50) + ")")

			};


			// --- Click Functions --- //

			document.getElementById("runSim").onclick = function(){
				runSimulation();

			};

			function runSimulation(){

				// Create the transition for the curtain
				var t = svg.transition()
								.delay(0)
								.duration(175000)
								.ease("linear");

				t.select("#clip").select("rect")
								.attr("width", width);

				scope.updateDate();

			}

		}
	}
})