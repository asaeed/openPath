OpenPath = window.OpenPath || {};

OpenPath.events = {
	init : function(){
		console.log('OpenPath.events..init');

		var self = this;
		//dom eles
		this.modal = $('#addEventsModal'); 
		this.form = this.modal.find('form');
		this.addEventsBtn = $('.addEventsBtn');

		//modal height FIX
		//on addEventsBtn click => set modal to < window height
		this.addEventsBtn.click(function(){
			self.modal.find('.modal-body').css({
				height : $(window).height() -350
			});
		});

		//TODO: auto populate 'creator' with auth email
		$("#location").geocomplete({
			autocomplete : 'on'
		})

		//submit form => validate => update user
		this.form.submit(function(e){
			var gradelevelsArr = [];
			//make grade levels array
			$(this).find('input:checkbox[name=gradelevel]:checked').each(function(){
				gradelevelsArr.push($(this).val());
			});


			var name = $(this).find('#name').val(),
				creator = $(this).find('#creator').val(),
				description = $(this).find('#description').val(),
				location = $(this).find('#location').val(),
				gradelevels = gradelevelsArr, //$(this).find('#gradelevel').val(),
				startTime = $(this).find('.startTime').val(),
				endTime = $(this).find('.endTime').val(),
				data = {
					'Name': name,
					'Creator': creator,
					'Description': description,
 					'Location': location,//[lat, long], //TODO!! 
					'Grade': gradelevels,
  					'StartTime': startTime,
  					'EndTime': endTime,
  					'Grades': gradelevels
				};
			
			OpenPath.events.add(data, function(d){
				console.log('event has been added', d);
			});
			
			
			return false;
		});
	/*

//TODO: aRRay!["PreK-2", "3-5", "6-8"]
  					//'Interests' : interests.split(',').join(', ')//,TODO : too many spaces, fix split join
  					 //["archaeology", "museums"]

 					//'LocationDescription': , ??
 					 HasPresenter: false,    
  // if they have a presenter, they can start multiple sessions in view-only mode
	// event creators would have this ability for their created event.
  InvitedUsers: ["sam@email.com", "jill@email.com", "greg@email.com"],
  Sessions: [10001, 10004, 10005]
	*/
	},
	get : function(){

	},
	add : function( d, callback){
		$.ajax({
			url: '/events/',
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