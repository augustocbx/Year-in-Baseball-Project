baseballApp.controller('BaseballController', ['$scope', '$http', 'GamesData', 'DaysData', function($scope, $http, GamesData, DaysData){

	
	// --- Games API --- //

	// The games API contains information about the individual games played: teams involved, date, season, score, location, etc.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.games = [];

	//Get games data from the API
	GamesData.getData().then(function(json){
		$scope.games = json.data;
	})

	// --- Days API --- //

	// The days API contains information about a day for each team, in particular, the team's record and the amount of games over a .500 win percentage that team was on that day.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.days = [];

	//Get days data from the API
	DaysData.getData().then(function(json){
		$scope.days = json.data;
	})

}])