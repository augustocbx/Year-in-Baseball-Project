// This factory pulls teams data from the API
baseballApp.factory('TeamsData', ['$http', function($http){
	var teams = [];

	teams.getData = function(){
		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/teams';
		return $http({ method: 'GET', url: endpoint });
	};

	return teams;
	
}])