OpenPath = window.OpenPath || {};

OpenPath.EventsCollection = Backbone.Collection.extend({
	model : OpenPath.EventModel,
	url: '/events'
});