// This factory pulls teams data from the API
baseballApp.factory('TeamsData', ['$http', function($http){
	var teams = [];

	teams.getData = function(value){
		var url = 'http://yearinbaseball.herokuapp.com/';
		var endpoint = url + 'api/years/' + value + '/teams';
		return $http({ method: 'GET', url: endpoint });
	};

	return teams;
	
}])