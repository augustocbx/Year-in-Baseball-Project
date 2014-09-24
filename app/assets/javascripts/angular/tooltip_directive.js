// -------- Game Tooltip Directive -------- //

// In order for the x and y posisiton of the tooltip to be determined by the position of the day selected, we build a div with moveable top and left positions.

baseballApp.directive("gameTooltip", function($window){
	return{
		restrict: "E",
		templateUrl: "game_tooltip.html",
		link: function(scope, elem, attrs){

			scope.$watch( 'gameTooltipLeft', function(){
				elem.css({
					top: scope.gameTooltipTop,
					left: scope.gameTooltipLeft

				});
			});

		}
	}
});