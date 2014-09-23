baseballApp.factory('EventsData', ['$http', function($http){
	var events = [];

	events.getData = function(){
		var url = 'http://localhost:3000/';
		var endpoint = url + 'api/events';
		return $http({ method: 'GET', url: endpoint });
	};

	return events;
	
}])