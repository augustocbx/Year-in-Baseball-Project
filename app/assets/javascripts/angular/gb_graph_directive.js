// -------- Games Behind Directive -------- //

// In order to tie the games behind graph to the svg element, we build a directive for the svg element.

baseballApp.directive("gbGraph", function($window){
	return{
		restrict: "EA",
		template: "<svg width='400', heigh='750', id='gbGraphCanvas'></svg>",
		link: function(scope, elem, attrs){

			// --- Watch Functions --- //

			// The watch functions make it so that the graph does not draw until after the data has been pulled in from the API.

			scope.$watch( 'days', function(){

				if (scope.days.length){

					drawGraph();
					drawCircle();

				}

			});

			scope.$watch( 'date', function(){

				updateCircle();

			})

			// --- Draw the SVG --- //

			var width = 400;
			var height = 350;

			var svg = d3.select("#gbGraphCanvas")
						.attr("width", width)
						.attr("height", height);


			function drawGraph(){

				svg.append("rect")
					.attr("width", 6)
					.attr("height", height)
					.attr("x", 30)
					.attr("fill", "black");
			};

			function drawCircle(){

				var pit = scope.days.filter(function(d){
					return d.id == "PIT";
				});

				svg.selectAll("circle.team")
					.data(pit)
					.enter()
					.append("circle")
					.attr("class", "team")
					.attr("cy", height/2)
					.attr("cx", 33)
					.attr("r", 10)
					.attr("fill", "blue");
			};

			function updateCircle(){

				// Find the minimum and maximum wins_over in the dataset
				var minY = d3.min(scope.days, function(kv){ return d3.min(kv.days, function(d){ return d.wins_over; })});
				var maxY = d3.max(scope.days, function(kv){ return d3.max(kv.days, function(d){ return d.wins_over; })});

				//y scale
				var y = d3.scale.linear()
						.domain([minY, maxY])
						.range([height, 0])

				var pit = scope.days.filter(function(d){
					return d.id == "PIT";
				});



				var dayData;

				var dateObject = function(){
					for (i=0; i<pit[0].days.length; i++){
						date = pit[0].days[i].date;
						if (date.getTime() == scope.date.getTime()){
							dayData = pit[0].days[i]
						}
					}
				}

				dateObject();

				svg.selectAll("circle.team")
					.transition()
					.duration(750)
					.attr("cy", y(dayData.wins_over));
			}
		}
	}
});