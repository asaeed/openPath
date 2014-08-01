'use strict';

var App = angular.module('openPath', ['ui.router']);

App.config(function($stateProvider, $urlRouterProvider){
	//routing
	//@see http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	$urlRouterProvider.otherwise('/home');
	$stateProvider
        .state('home', {
            url: '/home',
            template: '<div style="font-size:100px;">HOMe</div>'
        })
        .state('events', {
            url: '/events',
            templateUrl: 'templates/events.html'     
        })
        //PROFILE ROUTES
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller : 'profileController'
        })
        //nested profile states
        .state('profile.myProfile', {
            url: '/myprofile',
            templateUrl: 'templates/profile/myprofile.html'     
        })
        .state('profile.editProfile', {
            url: '/editprofile',
            templateUrl: 'templates/profile/editprofile.html'     
        })
        .state('profile.myPath', {
            url: '/mypath',
            templateUrl: 'templates/profile/mypath.html'     
        })
        .state('profile.notifications', {
            url: '/notifications',
            templateUrl: 'templates/profile/notifications.html'     
        })
        .state('profile.settings', {
            url: '/settings',
            templateUrl: 'templates/profile/settings.html'     
        })

});

App.controller('eventsController', function($scope,$element){

	console.log('app events')

});

App.controller('profileController', function($scope,$http){

    console.log('app events');
    $http({method: 'GET', url: '/user/'+document.getElementById('email').value }).success(function(data){
        console.log('d',data);
        $scope.user = data;
    }).error(function(){
        console.log('error');
    });

    
    
});
