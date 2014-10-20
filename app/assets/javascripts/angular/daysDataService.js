// This factory pulls days data from the API
baseballApp.factory('DaysData', ['$http', function($http){
	var days = [];

	days.getData = function(value){
		var url = 'http://yearinbaseball.herokuapp.com/';
		var endpoint = url + 'api/years/' + value + '/days';
		return $http({ method: 'GET', url: endpoint });
	};

	return days;

}])