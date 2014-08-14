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
	//get all
	service.get = function(){
		var deferred = $q.defer();
		$http({method: 'GET', url: url }).success(function(data){
	    	deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	}
	//get one by id
	service.getOne = function(id){
		var deferred = $q.defer();
		$http({method: 'GET', url: url+id}).success(function(data){
	    	deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	}
	//update one by id
	service.update = function(id,data){
		var deferred = $q.defer();
		$http({method: 'PUT', url: url+id, data: data }).success(function(data){
	    	deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	}

	return service;
})