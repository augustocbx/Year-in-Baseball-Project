baseballApp.controller('BaseballController', ['$scope', '$http', 'GamesData', function($scope, $http, GamesData){

	
	// --- Games API --- //

	// The games API contains information about the individual games played: teams involved, date, season, score, location, etc.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.games = [];

	//Get games data from the API
	GamesData.getData().then(function(json){
		$scope.games = json.data;
	})

}])