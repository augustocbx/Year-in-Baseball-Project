baseballApp.controller('BaseballController', ['$scope', '$http', '$timeout', 'GamesData', 'DaysData', 'TeamsData', function($scope, $http, $timeout, GamesData, DaysData, TeamsData){

	
	// -------- Views -------- //


	// Create a team view variable. Team info will show when this true;
	$scope.teamView = false;


	// -- Tool Tip -- //

	// Create a view for the tooltip
	$scope.tooltipView = false;




	// -------- APIs -------- //


	// --- Games API --- //

	// The games API contains information about the individual games played: teams involved, date, season, score, location, etc.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.games = [];

	// Get games data from the API
	GamesData.getData().then(function(json){
		$scope.games = json.data;
	})


	// --- Days API --- //

	// The days API contains information about a day for each team, in particular, the team's record and the amount of games over a .500 win percentage that team was on that day.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.days = [];

	// Get days data from the API
	DaysData.getData().then(function(json){
		$scope.days = json.data;
	});


	// --- Teams API --- //

	// The teams API contains information about a team in a given season, including its full name, city, stadium, and standing at the end of the season

	$scope.teams = [];

	// Get the teams data from the API
	TeamsData.getData().then(function(json){
		$scope.teams = json.data
	});


	// --- Date Counter --- //

	// The date counter changes the date plus one day every second. The date is displayed on the graph.

	// var daySeconds = 24 * 60 * 60 * 1000;

	// $scope.date = new Date(1908, 03, 14);

	// function addDay(date){
	// 	var nextDayTime = date.getTime() + daySeconds;
	// 	var year = new Date(nextDayTime).getFullYear();
	// 	var month = new Date(nextDayTime).getMonth();
	// 	var day = new Date(nextDayTime).getDate();
	// 	return new Date(year, month, day);
	// };

	// endDate = new Date(1908, 09, 08);
	
	// $scope.updateDate = function(){
	// 	if ($scope.date.getTime() < endDate.getTime()){
	// 		$timeout(function(){
	// 			$scope.date = addDay($scope.date);
	// 			$scope.$digest();
	// 			$scope.updateDate();
	// 		}, 1000);
	// 	}
	// }


	// -------- Functions -------- //

	// --- Current Team --- //

	// When the user selects a given team, information will show on the team.

	$scope.currentTeam = [];

	$scope.getTeamData = function(team){
		if (team){$scope.teams.forEach(
			function(t){
				if (t.id == team.id){
					$scope.currentTeam = t;
				};
			});
			$scope.teamView = true;
		}
		else if (!team){
			$scope.teamView = false;
		}
	};

	// --- Current Day Data --- //

	$scope.tooltipLeft;
	$scope.tooltipTop;

	// Variable to store current day data
	$scope.currentDateData = [];

	// Variable to store data of games on this day
	$scope.currentGameData = [];

	$scope.getDayData = function(top, left, d){
		$scope.currentGameData = [];
		$scope.tooltipView = true;
		$scope.tooltipLeft = left - 50;
		$scope.tooltipTop = top - 300;

		console.log(d);
		console.log($scope.games[1])
		
		// -- Data related to this day -- //
		for (i = 0; i < $scope.games.length-1; ++i){
			if ($scope.games[i].visitor_day_id == d.id || $scope.games[i].home_day_id == d.id){
				$scope.currentGameData.push($scope.games[i]);
			}
		}


		// Date
		var fullDate = d.date;
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		$scope.cd_year = new Date(fullDate).getFullYear();
		$scope.cd_month = months[new Date(fullDate).getMonth()];
		$scope.cd_day= new Date(fullDate).getDate();

		// Search day for games by game id
		console.log($scope.currentGameData)

	}

	// - Remove Tooltip - //

	$scope.removeTooltip = function(){
		$scope.tooltipView = false;
	}

}])