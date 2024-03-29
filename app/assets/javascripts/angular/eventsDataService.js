baseballApp.factory('EventsData', ['$http', function($http){
	var events = [];

	events.getData = function(value){
		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/years/' + value + '/events';
		return $http({ method: 'GET', url: endpoint });
	};

	return events;
	
}])