OpenPath = window.OpenPath || {};

OpenPath.events = {};
OpenPath.events.addEvent = {
	init : function(collection){
		console.log('OpenPath.events.addEvent.init');

		var self = this;

		// Events
		$('#starttime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		$('#endtime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		
		//dom eles
		this.modal = $('#addEventsModal'); 
		this.form = $('#addEventForm');
		this.addEventsBtn = $('.addEventsBtn');

		this.lat = 0;
		this.lng = 0;
		//modal height FIX
		//on addEventsBtn click => set modal to < window height
		this.addEventsBtn.click(function(){
			self.modal.find('.modal-body').css({
				height : $(window).height() -350
			});
		});


		
		
		//TODO: auto populate 'creator' with auth email
		//this.form.find('#creator').val(email)



		//autocomplete location
		var locationInput = document.getElementById("location");
		autocomplete = new google.maps.places.Autocomplete(locationInput);
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				// Inform the user that a place was not found and return.
				return;
			}

			self.lat = place.geometry.location.mb;
			self.lng = place.geometry.location.nb;

			/*
			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				// Use the viewport if it is provided.
				map.fitBounds(place.geometry.viewport);
			} else {
				// Otherwise use the location and set a chosen zoom level.
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}
			*/
		});


		//submit form => validate => update user
		this.form.validate({
			submitHandler: function(form) {
			// do other things for a valid form
			
			var gradelevelsArr = [];
			//make grade levels array
			self.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
				gradelevelsArr.push($(this).val());
			});


			var name = self.form.find('#name').val(),
				creator = self.form.find('#creator').val(),
				description = self.form.find('#description').val(),
				location = self.form.find('#location').val(),
				locationDescription = '',//TODO
				gradelevels = gradelevelsArr, //$(this).find('#gradelevel').val(),
				startTime = self.form.find('.startTime').val(),
				endTime = self.form.find('.endTime').val(),
				data = {
					name: name,
					creator: creator,
					description: description,
 					location: [self.lat, self.lng], 
					grade: gradelevels,
  					startTime: startTime,
  					endTime: endTime
				};
			console.log('event add',data);
			alert('total bit')
				/**
			var ev = new OpenPath.EventModel();
			ev.save(data, {
		        success: function (evv) {
		            console.log('ev added', evv.toJSON());
		        }
		    });
			*/
			collection.add(new OpenPath.EventModel(data));
    		debugger;
			return false;

			/*
			OpenPath.events.add(data, function(d){
				console.log('event has been added', d);
				//hide modal
				$('#addEventsModal').modal('hide');
				//reload events
				//openpath.events.get(function(d){
				//	openpath.events.populate(d);
				//});
			});
			*/

			//return false;
			//form.submit();

			}
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


	}

};