"use strict";

/**
 * user factory
 */
App.factory('userFactory', function($http,$q){
	var service = {};
	var url = '/user/';

	service.getByEmail = function(email){
		var deferred = $q.defer();
		$http({method: 'GET', url: url+email }).success(function(data){
	        deferred.resolve(data);
	    }).error(function(){
	        deferred.reject('There was an error');
	    });
	    return deferred.promise;
	};


	//return service
	return service;	
});

/**
 * event factory
 */
App.factory('eventFactory', function($http,$q){
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
	service.update = function(id,data,done){
		$http({method: 'PUT', url: url+id, data: data }).success(function(d){
			done(d);
	    }).error(function(){
	        console.log('service putting error')
	    });
	}
	//update one by id
	service.delete = function(id,done){
		$http({method: 'DELETE', url: url+id }).success(function(d){
			done(d);
	    }).error(function(){
	        console.log('service deletin error')
	    });
	}

	//return service
	return service;
});
