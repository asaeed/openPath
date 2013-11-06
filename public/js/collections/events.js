OpenPath = window.OpenPath || {};

OpenPath.EventsCollection = Backbone.Collection.extend({
	model : OpenPath.EventModel,
	url: '/events',
	comparator: function(m){

        var date = new Date(m.get('date'));
		console.log(date.getTime())
        return -date.getTime();

    }
});