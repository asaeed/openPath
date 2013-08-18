OpenPath = window.OpenPath || {};

OpenPath.events = {
	init : function(){
		console.log('OpenPath.events..init');

		var self = this;
		this.addEvent.init();

	},
	get : function( callback ){
		$.ajax({
			url: '/events',
			data: d, 
			dataType:'json',
			type:'GET',
			async:false,
			success: function(data) {
				callback(data);
			},
			error: function(msg){
				console.log('event not added',msg);
			}
		});
	},
	add : function( d, callback){
		$.ajax({
			url: '/events',
			data: d, 
			dataType:'json',
			type:'POST',
			async:false,
			success: function(new_data) { 
				callback(new_data.$set );
			},
			error: function(msg){
				console.log('event not added',msg);
			}
		});
	},
	update : function(){

	},
	/**
	 * Parses and displays events
	 * @param array of json objects
	 */
	initEventsList : function (){
		// get events list from API
		$.ajax({
			url: '/events',
		    dataType:'json',
		    type:'GET',
		    async:false,
			success: function(list) {  
				// parse and display list      
		      	var output = "";
				var evt;
				for(var i in list){
					evt = list[i];
					output += '<article>';
					output += '<a href="'+ evt.link +'" target="_blank"><h3>' + evt.name + '</h3></a>';
					output += evt.startTime + ' to ' + evt.endTime + '<br>';
					output += evt.locationDescription + '<br>';
					output += '<p>' + evt.description + '</p>';
					output += '</article>';
				}
				// write to both event lists
				$('.eventsholder').html(output);
		    },
		    error: function(list){
				console.log("events not found");
				$('.eventsholder').html('No Events Found');
			}
		});
	}
};