baseballApp.controller('BaseballController', ['$scope', '$http', '$timeout', 'GamesData', 'DaysData', 'TeamsData', 'EventsData', function($scope, $http, $timeout, GamesData, DaysData, TeamsData, EventsData){

	
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
		$scope.teams = json.data;
	});


	// --- Events API --- //

	// The events API contains data on events that happened in a particular day, including data, text, and type.

	$scope.events = []

	// Get the events data from API
	EventsData.getData().then(function(json){
		$scope.events = json.data;
	});


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
		$scope.tooltipLeft = left - 75;
		$scope.tooltipTop = top - 250;
		
		// -- Data related to this day -- //

		// Search for a match
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

		// Won, Lost, or Tied?

		$scope.currentGameData.forEach(function(g){
			function homeOrAway(d){
				if (g.team_visitor_id == d.team_id){
					visitorResult(g);
				}
				else if (g.team_home_id == d.team_id){
					homeResult(g);
				}

				function visitorResult(game){
					if (game.score_visitor > game.score_home){
						game.result = "W"
					}
					else if (game.score_home > game.score_visitor){
						game.result = "L"
					}
					else{
						game.result = "T"
					}
				}

				function homeResult(game){
					if (game.score_visitor > game.score_home){
						game.result = "L"
					}
					else if (game.score_home > game.score_visitor){
						game.result = "W"
					}
					else{
						game.result = "T"
					}
				}
			}

			homeOrAway(d);
		});

		console.log($scope.currentGameData);



	}

	// - Remove Tooltip - //

	$scope.removeTooltip = function(){
		$scope.tooltipView = false;
	}

}])