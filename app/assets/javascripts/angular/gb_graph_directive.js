// -------- Games Behind Directive -------- //

// In order to tie the games behind graph to the svg element, we build a directive for the svg element.

baseballApp.directive("gbGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='400', heigh='750', id='gbGraphCanvas'></svg>",
		link: function(scope, elem, attrs){

			// --- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			// Watch days to initialize graphs

			scope.$watch( 'days', function(){

				if (scope.days.length){

					drawGraph();
					drawCircle();

				}

			});

			// Watch date to update sliders			

			scope.$watch( 'date', function(){

				updateCircle();

			})

			// --- Draw the SVG --- //

			var width = 400;
			var height = 350;

			var svg = d3.select("#gbGraphCanvas")
						.attr("width", width)
						.attr("height", height);


			// --- Draw the Slider Graph --- //

			function drawGraph(){

				svg.selectAll("rect")
					.data(scope.days)
					.enter()
					.append("rect")
					.attr("width", 6)
					.attr("height", height)
					.attr("x", function(d,i){
						return i * (width/scope.days.length) + 10
					})
					.attr("fill", "black");
			};

			// --- Draw the Circles --- //

			function drawCircle(){

				
				svg.selectAll("circle.team")
					.data(scope.days)
					.enter()
					.append("circle")
					.attr("class", "team")
					.attr("cy", height/2)
					.attr("cx", function(d, i){
						return i * (width/scope.days.length) + 13
					})
					.attr("r", 10)
					.attr("fill", "blue");
			};

			// --- Update the Circles --- //

			function updateCircle(){

				// Find the minimum and maximum wins_over in the dataset
				var minY = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.wins_over; })});
				var maxY = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.wins_over; })});

				//y scale
				var y = d3.scale.linear()
						.domain([minY, maxY])
						.range([height, 0])


				var getWinsOver = function(i){
					for (j=0; j<scope.days[i].days.length; j++){
							date = scope.days[i].days[j].date;
							if (date.getTime() == scope.date.getTime()){
								return scope.days[i].days[j].wins_over
							};
					};
				};

				svg.selectAll("circle.team")
					.transition()
					.duration(750)
					.attr("cy", function(d,i){
						return y(getWinsOver(i));
					});
			}
		}
	}
});