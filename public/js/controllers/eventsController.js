
App.controller('eventsController', function($scope,$http){
    /**
     * get events
     */
    $http({method: 'GET', url: '/events'}).success(function(data){
        console.log('d',data);
        $scope.events = data.events;
    }).error(function(){
        console.log('error');
    });

    //date filter
    $scope.dateFilter = function(item){
    	var today = new Date();
		var yesterday = today.setDate(today.getDate() - 1);
		return(Date.parse(item.date) > yesterday);//if today or in future
    }
});
