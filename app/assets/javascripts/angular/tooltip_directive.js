// -------- Tooltip Directive -------- //

// In order for the x and y posisiton of the tooltip to be determined by the position of the day selected, we build a div with moveable top and left positions.

baseballApp.directive("tooltip", function($window){
	return{
		restrict: "E",
		templateUrl: "tooltip.html",
		link: function(scope, elem, attrs){

			scope.$watch( 'tooltipLeft', function(){
				elem.css({
					top: scope.tooltipTop,
					left: scope.tooltipLeft

				});
			});

		}
	}
})