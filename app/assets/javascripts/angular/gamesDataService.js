// This factory pulls games data from the API
baseballApp.factory('GamesData', ['$http', function($http){
	var games = [];

	games.getData = function(){
		var url = 'http://yearinbaseball.herokuapp.com/';
		var endpoint = url + 'api/games';
		return $http({ method: 'GET', url: endpoint});
	};

	return games;

}]);