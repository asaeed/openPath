"use strict";

/*
usage

{
	'get':    {method:'GET'},
	'save':   {method:'POST'},
	'query':  {method:'GET', isArray:true},
	'remove': {method:'DELETE'},
	'delete': {method:'DELETE'}
};
//https://docs.angularjs.org/api/ngResource/service/$resource
//@see http://tylermcginnis.com/angularjs-factory-vs-service-vs-provider/

App.factory('eventFactory', function($resource) {
	return $resource('/events/:id', null, {
		'update': {method: 'PUT'}
	});
});*/

App.factory('eventFactory', function($http,$q) {
	var service = {};
	var url = '/events/';
	
	service.get = function(){
		var deferred = $q.defer();
		$http({method: 'GET', url: '/events/'}).success(function(data){
	    	deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	}
	
	service.getOne = function(id){
		var deferred = $q.defer();
		$http({method: 'GET', url: '/events/'+id}).success(function(data){
	    	deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	}

	return service;
})