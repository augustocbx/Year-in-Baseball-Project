// -------- Line Graph Directive -------- //

// In order to tie the line graph data to the svg element, we build a directive for the svg element.

baseballApp.directive("lineGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='800', height='750', id='lineGraphCanvas'></svg>",
		link: function(scope, elem, attrs){

			// --- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			scope.$watch( 'days', function(){

				//do not run until scope.days has data
				if (scope.days.length){
					drawLines();
				};
			});

			// --- Draw the SVG --- //

			var width = 800;
			var height = 500;

			var svg = d3.select("svg")
						.attr("width", width)
						.attr("height", height);

			

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
				y.domain([-50, 50]);

				// Draw the lines
				var graphLine = svg.selectAll("path")
								.data(scope.days)
								.enter()
								.append("path")
								.attr("d", function(d){
									return line(d.days);
								})
								.style("fill", "none")
								.style("stroke", "red");

			};

		}
	}
})