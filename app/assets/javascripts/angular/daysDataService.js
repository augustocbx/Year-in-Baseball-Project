// This factory pulls days data from the API
baseballApp.factory('DaysData', ['$http', function($http){
	var days = [];

	days.getData = function(){
		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/days';
		return $http({ method: 'GET', url: endpoint });
	};

	return days;

}])