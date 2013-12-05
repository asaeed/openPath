OpenPath = window.OpenPath || {};

OpenPath.EventsCollection = Backbone.Collection.extend({
	model : OpenPath.EventModel,
	url: '/events',
	init : function(){
		this.sort_order = 'desc';
	},
	comparator: function( collection ){
	    var date = new Date(collection.get('date'));
	    var returnD = this.sort_order == 'desc' ? -date.getTime() :  date.getTime();
		console.log('comparator',date)
		return returnD;
	}
	/*comparator: function(c){
		var sorted = c.toArray().sort(function(a, b) {
		    a = a.get('date');
		    b = b.get('date');
		    if(a > b)
		        return -1;
		    if(a < b)
		        return 1;
		    return 0;
		});
		console.log(sorted);
		
        var date = new Date(m.get('date'));
		console.log(date.getTime())
        return -date.getTime();
		
    }*/
});