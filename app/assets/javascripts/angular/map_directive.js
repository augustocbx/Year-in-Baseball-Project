// -------- Map Directive -------- //

// In order to tie the map to the data, we build a directive for the svg element.

baseballApp.directive("gamesMap", function($window){
	return{
		restrict: "EA",
		template: "<svg width='960', height='500', id='gamesMap'></svg>",
		link: function(scope, elem, attrs){

			// --- Draw the SVG ---//

			var width = 960;
			var height = 500;
			var centered;

			var projection = d3.geo.albersUsa()
				.scale(1070)
				.translate([width / 2, height / 2]);

			var path = d3.geo.path()
    			.projection(projection);

			var g = d3.select("#gamesMap").append("g");

			//dummy data
			var data = [
				{
					lon: -84.536667,
					lat: 39.116944
				}
			]

			d3.json("/us.json", function(error, us){
				g.append("g")
					.attr("id", "states")
					.selectAll("path")
						.data(topojson.feature(us, us.objects.states).features)
						.enter()
						.append("path")
						.attr("d", path)
						.style("fill", "#ccc");

			g.append("path")
				.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
				.attr("id", "state-borders")
				.attr("d", path)
				.style("stroke", "#fff")
				.style("fill", "none");

			g.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(1.7)translate(-600,-150)")
				

			})

			g.select("#states")
				.selectAll("circle")
				.data(data)
				.enter()
				.append("circle")
				.attr("cx", function(d){
					return projection([d.lon, d.lat])[0];
				})
				.attr("cy", function(d){
					return projection([d.lon, d.lat])[1];
				})
				.attr("r", 5)
				.style("fill", "red")

		}
	}
})