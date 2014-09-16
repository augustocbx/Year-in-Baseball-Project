baseballApp.controller('BaseballController', ['$scope', '$http', '$timeout', 'GamesData', 'DaysData', function($scope, $http, $timeout, GamesData, DaysData){

	
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
	});

	// --- Date Counter --- //

	// The date counter changes the date plus one day every second. The date is displayed on the graph.

	var daySeconds = 24 * 60 * 60 * 1000;

	$scope.date = new Date(1908, 03, 14);

	function addDay(date){
		var nextDayTime = date.getTime() + daySeconds;
		var year = new Date(nextDayTime).getFullYear();
		var month = new Date(nextDayTime).getMonth();
		var day = new Date(nextDayTime).getDate();
		return new Date(year, month, day);
	};

	endDate = new Date(1908, 09, 08);
	
	updateDate();
	
	function updateDate(){
		if ($scope.date.getTime() < endDate.getTime()){
			$timeout(function(){
				$scope.date = addDay($scope.date);
				$scope.$digest();
				updateDate();
			}, 1000);
		}
	}
	

}])