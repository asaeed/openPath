OpenPath = window.OpenPath || {};

//collection view
OpenPath.EventsView = Backbone.View.extend({
	el:"#eventslist",
    initialize:function(){
        this.collection = new OpenPath.EventsCollection();
        this.collection.fetch();

        //set up modal and handle form submission
		this.setModal();

        this.render();
        this.collection.on("add", this.renderEvent, this);
        this.collection.on("reset", this.render, this);
    },
    render: function(){
        var self = this;
        _.each(this.collection.models, function(item){
            self.renderEvent(item);
        }, this);
    },
    renderEvent:function(item){
        var eventView = new OpenPath.EventView({
            model: item
        });
        this.$el.append(eventView.render().el);
    },
    /**
     * custom form setup & submission - unbackbone way
     */
    setModal : function(){
    	var self = this;
    	this.form = $('#addEvent');
		this.modal = $('#addEventsModal');

		//set date pickers
    	$('#starttime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		$('#endtime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		//populate creator
		$('#creator').val(OpenPath.email);

		//fix modal height so that dates won't get cut off
    	this.modal.find('.modal-body').css({
			height : $(window).height() -350
		});


    	//autocomplete location
		var lat = null,
			lng = null,
			locationInput = document.getElementById("location");
		autocomplete = new google.maps.places.Autocomplete(locationInput);

		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			var place = autocomplete.getPlace();
			if (!place.geometry) {
			// Inform the user that a place was not found and return.
			return;
			}

			lat = place.geometry.location.lat();
			lng = place.geometry.location.lng();
			//console.log('new',lat,lng)
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

    	//submit and validate
		this.form.validate({
			submitHandler: function(form) {
				
				//make grade levels array
				var gradelevelsArr = [];
				self.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
					gradelevelsArr.push( $(this).val());
				});
				//make location arr
				var locationArr = [];
				if(lat && lng  ){
					locationArr = [lat,lng];
				}else{
					locationArr = [40.7142, -74.0064];//lat, lng NYC
				}


				var name = self.form.find('#name').val(),
					creator = self.form.find('#creator').val(),
					description = self.form.find('#description').val(),
					//location = self.form.find('#location').val(),
					//locationDescription = '',//TODO
					gradelevels = gradelevelsArr, 
					startTime = self.form.find('.startTime').val(),
					endTime = self.form.find('.endTime').val(),
					data = {
						name: name,
						creator: creator,
						description: description,
	 					location: locationArr, 
						grade: gradelevels,
	  					startTime: startTime,
	  					endTime: endTime
					};

				//self.collection.add(new OpenPath.EventModel(data));
				self.collection.create(data);//send to server

				self.modal.modal('hide');
				self.form.find('input,textarea').val('');
				return false;
			}
		});
    }
});