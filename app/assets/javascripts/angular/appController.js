baseballApp.controller('BaseballController', ['$scope', '$http', '$resource', '$q', '$timeout', 'GamesData', 'DaysData', 'TeamsData', 'EventsData', function($scope, $http, $resource, $q, $timeout, GamesData, DaysData, TeamsData, EventsData){

	
	// -------- Views -------- //


	// Create a team view variable. Team info will show when this true;
	$scope.teamView = false;
	$scope.thisTeam;


	// -- Tool Tips -- //

	// Create a view for the gameTooltip
	$scope.gameTooltipView = false;

	// Create a view for the gameTooltip
	$scope.eventTooltipView = false;
	

	// ------ Initialize ------ //

	$scope.initialize = true;



	// -------- APIs -------- //

	// Year variable to know what year to get data for
	$scope.year = '2013';


	// --- Games API --- //

	// The games API contains information about the individual games played: teams involved, date, season, score, location, etc.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.games = [];

	// Get games data from the API
	GamesData.getData($scope.year).then(function(json){
		$scope.games = json.data;
	});


	// --- Days API --- //

	// The days API contains information about a day for each team, in particular, the team's record and the amount of games over a .500 win percentage that team was on that day.

	// This section pulls the data from the database so that it can be accessed as a scope variable.

	$scope.days = [];

	// Get days data from the API
	DaysData.getData($scope.year).then(function(json){
		$scope.days = json.data;
	});


	// --- Teams API --- //

	// The teams API contains information about a team in a given season, including its full name, city, stadium, and standing at the end of the season

	$scope.teams = [];

	// Get the teams data from the API
	TeamsData.getData($scope.year).then(function(json){
		$scope.teams = json.data;
	});


	// --- Events API --- //

	// The events API contains data on events that happened in a particular day, including data, text, and type.

	$scope.events = []

	// Get the events data from API
	EventsData.getData($scope.year).then(function(json){
		$scope.events = json.data;
	});


	// -------- Functions -------- //


	// --- Change Years --- //

	$scope.changeYear = function(year){

		

		// Get games data from the API
		GamesData.getData(year).then(function(json){
			$scope.games = json.data;
		});

		// Get the teams data from the API
		TeamsData.getData(year).then(function(json){
			$scope.teams = json.data;
			// Get days data from the API
			DaysData.getData(year).then(function(json){
				$scope.days = json.data;
			});
		});

		// Get the events data from API
		EventsData.getData(year).then(function(json){
			$scope.events = json.data;
		});

	};

	
	// --- Date Formatting --- //

	function formatDate(d){
		
		var fullDate = d.date;
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

		return  { 
					"year": new Date(fullDate).getFullYear(),
					"month": months[new Date(fullDate).getMonth()],
					"day": new Date(fullDate).getDate()
				}
	};



	// --- Color Function --- //

	// Color the lines according to their teams

	$scope.colorTeam = function(id, teams){

		if (teams.length == 8){
			var colors = ["#006837","#1a9850","#66bd63","#a6d96a","#fee08b", "#fdae61", "#f46d43", "#a50026"]  ;
		}
		else if (teams.length == 5){
			var colors = ["#006837","#66bd63","#fee08b", "#f46d43", "#a50026"]  ;
		}

		for (i = 0; i < $scope.days.length; ++i){
			if (id == $scope.days[i].id){
				return colors[i]
			}
		};

	};


	// --- Current Team --- //

	// When the user selects a given team, information will show on the team.

	$scope.currentTeam = "none";
	$scope.currentTeamCopy = "none";
	$scope.teamInfo;

	$scope.getTeamData = function(team){
		if (team){$scope.days.forEach(
			function(t){
				if (t.id == team){
					$scope.currentTeam = t;
					// Get full data on the team
					$scope.getTeamInfo(t);
				};
			});
			$scope.teamView = true;
		}
		else if (!team){
			$scope.teamView = false;
			$scope.currentTeam = "none";
		}
	};


	// Team tag button function
	$scope.getThisTeam = function(d){
		if ( $scope.currentTeam !== "none"){
			if ($scope.currentTeam.id == d){
				$scope.getTeamData();
			}
			else{
				$scope.getTeamData(d);
			}
		}
		else{
			$scope.getTeamData(d);
		}
		
	};

	// Get team info for graph text
	$scope.getTeamInfo = function(t){
		for (i = 0; i < $scope.teams.length; ++i){
			if ($scope.teams[i].id == t.id){
				$scope.teamInfo = $scope.teams[i]
			}
		}
	};

	// --- Current Day Data --- //

	// Name tooltip position variables
	$scope.gameTooltipLeft;
	$scope.gameTooltipTop;

	// Variable to store current day data
	$scope.currentDateData = [];

	// Variable to store data of games on this day
	$scope.currentGameData = [];

	$scope.getDayData = function(top, left, d){
		$scope.currentDateData = d;
		$scope.currentGameData = [];
		$scope.gameTooltipView = true;
		$scope.gameTooltipLeft = left - 75;
		$scope.gameTooltipTop = top - 80;
		
		// -- Data related to this day -- //

		// Search for a match
		for (i = 0; i < $scope.games.length-1; ++i){
			if ($scope.games[i].visitor_day_id == d.id || $scope.games[i].home_day_id == d.id){
				$scope.currentGameData.push($scope.games[i]);
			}
		}

		// Date Format

		$scope.cd_year = formatDate(d).year;
		$scope.cd_month = formatDate(d).month;
		$scope.cd_day = formatDate(d).day;


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



	};

	// - Remove Game Tooltip - //

	$scope.removeGameTooltip = function(){
		$scope.gameTooltipView = false;
	};


	// --- Event Data --- //

	// Name tooltip position variables
	$scope.eventTooltipLeft;
	
	$scope.getEventData = function(left, d){

		$scope.currentEventData = d;

		// Trigger the gameTooltip view
		$scope.eventTooltipView = true;

		// Change tooltip left position
		$scope.eventTooltipLeft = left;

		// Get Date
		$scope.ce_year = formatDate(d).year;
		$scope.ce_month = formatDate(d).month;
		$scope.ce_day = formatDate(d).day;

	};

	// - Remove Event Tooltip - //

	$scope.removeEventTooltip = function(){
		$scope.eventTooltipView = false;
	};


	// -------- Line Functions -------- //

	// --- Mouse Functions --- //

	// Highlight Line

	$scope.highlightLine = function(d){

		if (typeof d == "string"){
			var lineId = "path#" + d;
			var areaId = "path#" + d + "_area";
			$('team-tag').not($('team-tag#'+d)).css("opacity", ".1");
		}
		else {
			var lineId = "path#" + d.id;
			var areaId = "path#" + d.id + "_area";
			$('team-tag').not($('team-tag#'+d.id)).css("opacity", ".1");
		}

		d3.selectAll("path.line")
				.style("opacity", .15);

		d3.select(lineId)
				.style("stroke-width", "6px" )
				.style("opacity", 1)
				.moveToFront();
				
	};

	// Highlight All Lines

	$scope.highlightAll = function(){

		$('.teamTag').css("opacity", "1");

		d3.selectAll("path.line")
			.style("opacity", 1)
			.style("stroke-width", "2px");

		d3.selectAll("text.teamName").remove();

	};

}])