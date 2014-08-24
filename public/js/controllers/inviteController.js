'use strict';

/**
 * invite controller
 */
App.controller('inviteController', function($scope,$http,$state){
	//show footer fix header
    $("#mainHeader").css({width:100+'%'});
    $('#mainFooter').show();
    
    //if no $scope user yet
    if(!$scope.user) $state.go('home');

    //set scope name
    $scope.name;
    if($scope.user.firstName != undefined){
        $scope.name = $scope.user.firstName+ ' '+$scope.user.lastName;
    }else{
        $scope.name = $scope.user.email;
    }
    
    //set invite url 
    $scope.invite_url;
    if($scope.user.currentEvent){
        $scope.invite_url = '?e='+$scope.user.currentRoom;
    }else{
        $scope.invite_url = '?r='+$scope.user.currentRoom;
    }

});