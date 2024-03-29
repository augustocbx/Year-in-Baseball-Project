// This factory pulls games data from the API
baseballApp.factory('GamesData', ['$http', function($http){
	var games = [];

	games.getData = function(value){

		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/years/' + value + '/games';
		return $http({ method: 'GET', url: endpoint});
	};

	return games;

}]);