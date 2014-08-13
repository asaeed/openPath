"use strict";

App.controller('eventsController', function($scope,$http,$state,eventService){
    $scope.currentEditEvent = null;

    //onload, default to upcoming
    if($state.current.name ==='events'){
        $state.go('.upcoming')
    }
    console.log('evevv')
    /**
     * get events
     */
    eventService.query(function(data){
        console.log('d',data);
        //$scope.content = data;

        $scope.events = data;
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

});
