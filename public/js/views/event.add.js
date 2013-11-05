OpenPath = window.OpenPath || {};

OpenPath.AddEventView = Backbone.View.extend({
	//model: new OpenPath.EventModel,
    el : '#addEvent',
    //template:$("#addEventTemplate").html(),
    initialize:function () {
       //init
       this.collection = new OpenPath.EventsCollection();
	   this.map();
	   console.log('add event here')
    },
    render:function () {
        var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        
        this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
		
		
        return this;
    },
	events : {
		'submit #addEventForm':'addEvent'
	},
	map :function(){
		//map
		this.locationData = null;
		var self = this;
		var locationInput = document.getElementById("location");
		var autocomplete = new google.maps.places.Autocomplete(locationInput);
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			//infowindow.close();
			
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				// Inform the user that a place was not found and return.
				alert('location not found')
				return;
			}
			self.locationData = place;
			console.log(self.locationData)
		});
	},
	addEvent : function(e){
		e.preventDefault();
		
		//set form
		this.form = $('#addEventForm');
		//make grade levels array
		var gradelevelsArr = [];
		this.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
			gradelevelsArr.push( $(this).val() );
		});
		
		
		//data to send
		var name = this.form.find('#name').val(),
			description = this.form.find('#description').val(),
			gradelevels = gradelevelsArr, 
			date = this.form.find('#date').val(),
			data = {
				name: name,
				creator: OpenPath.email,
				description: description,
				location: this.locationData, 
				grades: gradelevelsArr,
				date: date
			};
		
		//TODO: need a check here
		this.collection.create(new OpenPath.EventModel(data));
		//TODO: need to relocate to events or some other page
		alert('event submitted',data);
	}
});
