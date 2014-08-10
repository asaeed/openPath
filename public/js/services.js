/*
usage

{
	'get':    {method:'GET'},
	'save':   {method:'POST'},
	'query':  {method:'GET', isArray:true},
	'remove': {method:'DELETE'},
	'delete': {method:'DELETE'}
};
https://docs.angularjs.org/api/ngResource/service/$resource
*/

App.factory('eventService', function($resource) {
	return $resource('/events/:id', null, {
		//'update': {method: 'PUT'}
	});
});