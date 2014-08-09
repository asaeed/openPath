
App.controller('eventsController', function($scope,$http){
    /**
     * get events
     */
    $http({method: 'GET', url: '/events'}).success(function(data){
        console.log('d',data);
        $scope.events = data.events;

        init();
    }).error(function(){
        console.log('error');
    });


    function init(){
    	
    }
});
