OpenPath = window.OpenPath || {};

OpenPath.events = {
	init : function(){
		console.log('OpenPath.events..init');

		var self = this;
		//dom eles
		this.modal = $('#addEventsModal'); 
		this.form = this.modal.find('form');
		this.addEventsBtn = $('.addEventsBtn');

		//on addEventsBtn click => set modal to < window height
		this.addEventsBtn.click(function(){
			self.modal.css({
				height:window.height() - 300
			});
			console.log('hey modal modl')
		});

		//submit form => validate => update user
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var firstName = $(this).find('.firstName').val(),
				lastName = $(this).find('.lastName').val(),
				gradelevel = $(this).find('.gradelevel').val(),
				interests = $(this).find('.interests').val(),
				colearners = $(this).find('.colearners').val(),
				data = {
					//'Email':email,
					'Name': {'First' : firstName, 'Last' : lastName},
					'Grade': gradelevel,
					'Interests': interests.split(',').join(', ')//,TODO : too many spaces, fix split join
					//'HomeLocation': [lat, long],
					//'Locations': [],
					//'EventsInvitedTo': [],
					//'SessionsInvitedTo': [],
					//'EventsCreated': [],
					//'SessionsCreated': []
				}
			
			
			OpenPath.user.update(data, function(d){
				self.populate(d);
				//dom hide/show change on success
				self.showDisplayView();
			});
			
			
			return false;
		});
	},
	get : function(){

	},
	add : function(){
		$.ajax({
			url: '/events/',
			data: {$set:d}, 
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