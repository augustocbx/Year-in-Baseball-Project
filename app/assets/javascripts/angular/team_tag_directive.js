// -------- Team Tag Directive -------- //

// In order to color the team tag buttons with their line color we create a directive for each tag.

baseballApp.directive("teamTag", function($window){
	return{
		restrict: "E",
		template: "",
		link: function(scope, elem, attrs){

			scope.$watch( 'days', function(){

				elem.css({
					background: scope.colorTeam(attrs.id ,scope.teams)
				});

			});

			$('.teamTag').mouseover(function(){
				scope.highlightLine($(this).attr("id"));
			});

			$('.teamTag').mouseout(function(){
				scope.highlightAll()
			});

		}
	}
});