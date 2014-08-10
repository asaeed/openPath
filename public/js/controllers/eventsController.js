"use strict";

App.controller('eventsController', function($scope,$http,$state,$stateParams,eventService){
    $scope.currentEditEvent = null;

    console.log('state',$state)
    if($state.current.name ==='events'){
        $state.go('.upcoming')
    }
    /**
     * get events
     */
    eventService.get(function(data){
        console.log('d',data);
        //$scope.content = data;

        $scope.events = data.events;
    });

    //date filter
    $scope.dateFilter = function(item){
    	var today = new Date();
		var yesterday = today.setDate(today.getDate() - 1);
		return(Date.parse(item.date) > yesterday);//if today or in future
    }

    //watch for edit event
    /*
    $scope.$watch('currentEditEventId',function(){
        console.log('ev change')
        angular.forEach($scope.events, function(item) {          
            if($scope.currentEditEventId === item.id){
                $scope.currentEditEvent = item;
                if($scope.currentEditEventId)
                console.log($scope.currentEditEventId,$scope.currentEditEvent.name)
            }
        });
    });
    */
    console.log($stateParams)
    var eventId = $stateParams.eventId;
    if($stateParams.eventId)
    angular.forEach($scope.events, function(item) {          
        if(item.id === $stateParams.eventId){
            $scope.currentEditEvent = item;
            if($scope.currentEditEventId)
            console.log('cuur ev',$scope.currentEditEvent.name)
        }
    });
});
