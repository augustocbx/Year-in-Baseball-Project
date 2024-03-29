// -------- Timeline Directive -------- //

// In order for games to show a timeline of events and tie it to the controller, we build a directive for the svg element.

baseballApp.directive("timeline", function($window){
	return{
		restrict: "EA",
		template: "<svg width='800', 'height='20', id='timelineCanvas'></svg>",
		link: function(scope, elem, attrs){

			// ---- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			// Watch Run Events
			scope.$watch( 'runEvents', function(){

				if (scope.runEvents = true && scope.events.length > 0){
					setData();
					drawTimeline();
					scope.runEvents = false;
				}
			});

			// Watch Events
			scope.$watch( 'events', function(){

				if (scope.runEvents = true && scope.events.length > 0){
					setData();
					drawTimeline();
					scope.runEvents = false;
				}

				
			});


			// Watch current team
			scope.$watch( 'currentTeam', function(){

				if (scope.teamView == true){
					colorNodes()
				}
				else{
					unColorNodes()
				}

			});


			// --- Draw SVG --- //

			var width = 800;
			var height = 20;
			var rightPadding = 70;

			var svg = d3.select("#timelineCanvas")
						.attr("width", width)
						.attr("height", height);

			// --- Date Formatting --- //

			
			// Parse date function to turn date into JavaScript date
			var parseDate = d3.time.format("%Y-%m-%d").parse;

			// Set the X Scale
			var x = d3.time.scale()
						.range([11,width-rightPadding]);

			
			// --- Data --- //

			var minX;
			var maxX;


			// --- Set Data --- //

			function setData(){

				// Parse each date to make it a JavaScript date
				scope.events.forEach(function(d){
						if (typeof d.date == "string"){
							d.date = parseDate(d.date);
						}
				});

				// Find the minimum and maximum dates in the dataset
				minX = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.date; })});
				maxX = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.date; })});

				// Set date domain
				x.domain([minX, maxX]);

			};

			// --- Mouseover Functions --- //

			function selectDate(d){

				// Find tooltip location
				var left = d3.mouse(document.getElementById("visContainer"))[0];

				scope.getEventData(left, d);

				circleSelection = "circle#event" + d.id;

				svg.select(circleSelection)
					.transition()
					.duration(300)
					.attr("r", 8)
					.attr("stroke-width", 1)
			}

			// --- Mouseout Functions --- //


			function unselectDate(){

				// Remove tooltip
				scope.removeEventTooltip();

				svg.selectAll("circle")
					.transition()
					.duration(300)
					.attr("r", 6)
					.attr("stroke-width", 3)
			}


			// --- Draw Timeline --- //

			function drawTimeline(){

				svg.selectAll("rect").remove();
				svg.selectAll("circle.event").remove();

				// Draw the line
				svg.append("rect")
						.attr("class", "timeline")
						.attr("x", 10)
						.attr("y", 10)
						.attr("width", width-rightPadding-10)
						.attr("height", 2)
						.attr("fill", "rgba(70,70,70,1)");

				svg.selectAll("circle.event")
						.data(scope.events)
						.enter()
						.append("circle")
						.attr("class", "event")
						.attr("id", function(d){
							return "event" + d.id
						})
						.attr("cx", function(d){
							return x(d.date) - 3
						})
						.attr("cy", 10)
						.attr("r", 6)
						.attr("fill", "#fdae61")
						.attr("stroke", "white")
						.attr("stroke-width", 3)
						.attr("cursor", "pointer")
						.on("mouseover", function(d){
							selectDate(d);
						})
						.on("mouseout", function(){
							unselectDate();
						});

			};

			// --- Color Nodes --- //

			function colorNodes(){

				svg.selectAll("circle.event")
						.transition()
						.duration(1000)
						.attr("fill", function(d){
							if (d.team_home_id == scope.currentTeam.id){
								return scope.colorTeam(d.team_home_id, scope.teams);
							}
							else if (d.team_visitor_id == scope.currentTeam.id){
								return scope.colorTeam(d.team_visitor_id, scope.teams);
							}
							else{
								return "#aaaaaa"
							};
						});


			}

			// --- Color Nodes --- //

			function unColorNodes(){

				svg.selectAll("circle.event")
						.transition()
						.duration(1000)
						.attr("fill", "#fdae61");


			}

		}
	}
})