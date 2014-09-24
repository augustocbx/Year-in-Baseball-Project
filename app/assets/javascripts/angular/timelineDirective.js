// -------- Timeline Directive -------- //

// In order for games to show a timeline of events and tie it to the controller, we build a directive for the svg element.

baseballApp.directive("timeline", function($window){
	return{
		restrict: "EA",
		template: "<svg width='800', 'height='20', id='timelineCanvas'></svg>",
		link: function(scope, elem, attrs){

			// ---- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			// Watch Days

			scope.$watch( 'events', function(){

				if (scope.events.length){
					setData();
					drawTimeline();
				}

			})


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
						.range([0,width-rightPadding]);

			
			// --- Data --- //

			var minX;
			var maxX;


			// --- Set Data --- //

			function setData(){

				// Parse each date to make it a JavaScript date
				scope.events.forEach(function(d){
						d.date = parseDate(d.date);
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

				// Draw the line
				svg.append("rect")
						.attr("class", "timeline")
						.attr("x", 0)
						.attr("y", 10)
						.attr("width", width-rightPadding)
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

		}
	}
})