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
        });
});

App.controller('eventsController', function($scope,$element){

	console.log('app events')

});
