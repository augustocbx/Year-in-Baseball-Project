// -------- Game Tooltip Directive -------- //

// In order for the x and y posisiton of the tooltip to be determined by the position of the event selected, we build a div with moveable top and left positions.

baseballApp.directive("eventTooltip", function($window){
	return{
		restrict: "E",
		templateUrl: "event_tooltip.html",
		link: function(scope, elem, attrs){

			scope.$watch( 'currentEventData', function(){
				elem.css({
					left: scope.eventTooltipLeft - 100

				});

			});

		}
	}
});