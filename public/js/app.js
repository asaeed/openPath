'use strict';

var App = angular.module('openPath', ['ui.router','ngResource']);

App.config(function($stateProvider, $urlRouterProvider){
	//routing
	//@see http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	$urlRouterProvider.otherwise('/home');
	$stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/videos.html',
            controller : 'videosController'
        })

        //INVITE ROUTES
        .state('invite', {
            url: '/invite',
            templateUrl: 'templates/invite.html',
            controller : 'inviteController'
        })
        //EVENTS ROUTES
        .state('events', {
            url: '/events',
            templateUrl: 'templates/events.html',
            controller : 'eventsController'
        })
        //nested events states
        .state('events.upcoming', {
            url: '/upcoming',
            templateUrl: 'templates/events/upcoming.html',
            controller : 'upcomingEventsController'      
        })
        .state('events.nearby', {
            url: '/nearby',
            templateUrl: 'templates/events/nearby.html',
            controller : 'nearbyEventsController'   
        })
        .state('events.addNewEvent', {
            url: '/addNewEvent',
            templateUrl: 'templates/events/addNewEvent.html',
            controller : 'addNewEventController'     
        })
        .state('events.editEvent', {
            url: '/editEvent/:eventId',
            templateUrl: 'templates/events/editEvent.html',
            controller : 'editEventController'      
        })
        .state('events.inviteToEvent', {
            url: '/inviteToEvent',
            templateUrl: 'templates/events/inviteToEvent.html'     
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
            templateUrl: 'templates/profile/mypath.html',
            controller : 'myPathController'    
        })
        .state('profile.notifications', {
            url: '/notifications',
            templateUrl: 'templates/profile/notifications.html'     
        })
        .state('profile.settings', {
            url: '/settings',
            templateUrl: 'templates/profile/settings.html',
            controller : 'settingsController'     
        })
    ;//end state provider

});
/**
 * mainController
 */
App.controller('mainController', function($scope,$element,$state,$stateParams){
    //console.log($scope, $element);
    //console.log($state.current,$element)


    // $scope.$watch('$state',function(){
    //     console.log('$state change',$state)
    // });
});




