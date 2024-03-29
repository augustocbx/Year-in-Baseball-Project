// This factory pulls year data from the API
baseballApp.factory('YearData', ['$http', function($http){
	var year = [];

	year.getData = function(value){
		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/years/' + value;
		return $http({ method: 'GET', url: endpoint });
	};

	return year;
	
}])