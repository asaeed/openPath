OpenPath = window.OpenPath || {};

OpenPath.EventView = Backbone.View.extend({
	//model: new OpenPath.EventModel,
	tagName:"li",
	className:"event",
	template:$("#eventTemplate").html(),
	initialize:function () {
		//init
		//console.log(this.model.attributes.date, new Date() );
	},
	render:function () {
		var self = this;
		/**
		 * check if creator
		 */
		function checkCreator(){
			if(self.model.attributes.creator === OpenPath.email){
				return true;
			}else{
				return false;
			}
		}
		//console.log(checkCreator())
		
		var vars = { isCreator: checkCreator() }
		
		var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
		this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
		 //$(this.el).html(_.template(html)($.extend({}, this.model.toJSON(), App.lists.toJSON())))
		
		this.mapWrap = this.el.querySelector(".mapWrap");

		//load map after a few
		setTimeout(function(){self.loadMap()},100);
		
		return this;
	},
	events : {
		'click #invite':'invite',
		'click #join':'join'
	},
	invite: function(){
		console.log('#/events/invite');
		window.scrollTo(0,0);
		
		
		//show invite
		$('#inviteToEvent').show();
		//hide form
		$('#addEvent').hide();
		//hide list
		$('#eventslist').hide();
		
		//set header copy
		$('#eventsmenu h2').html('Invite');
		
		var inviteToEvent = new OpenPath.inviteToEventView({ model : this.model });
		//render
		$("#inviteToEvent").html(inviteToEvent.render().el);
		
		//window.location.hash = '#/events/invite';
		
		//TODO: pass id or something.
	},
	join : function(){
		console.log('join event', this.model.attributes._id);
		window.location = "/main" +"?room=" + this.model.attributes._id;
	},
	loadMap : function(){
		var ele = this.mapWrap,
			location = this.model.attributes.location;
			
		//console.log(location)
		
		var mapOptions = {
			center: new google.maps.LatLng(-33.8688, 151.2195),
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(ele, mapOptions);
		
		var infowindow = new google.maps.InfoWindow();
		/*
		var marker = new google.maps.Marker({
			map: map
		});*/
		var service = new google.maps.places.PlacesService(map);
		
	    service.getDetails( location, function(place, status) {
			if (status == google.maps.places.PlacesServiceStatus.OK) {
				var marker = new google.maps.Marker({
					map: map,
					position: place.geometry.location
				});
				
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(place.name);
					infowindow.open(map, this);
				});
				
				// If the place has a geometry, then present it on a map.
				if (place.geometry.viewport) {
				//if(1==2){
					map.fitBounds(place.geometry.viewport);
				} else {
					map.setCenter(place.geometry.location);
					map.setZoom(17);  // Why 17? Because it looks good.
				}
		
				marker.setIcon(({
					//url: place.icon,
					url: 'img/marker.png',
					size: new google.maps.Size(71, 71),
					origin: new google.maps.Point(0, 0),
					anchor: new google.maps.Point(17, 34),
					scaledSize: new google.maps.Size(35, 35)
				}));
				marker.setPosition(place.geometry.location);
				marker.setVisible(true);
			}
	    });
		/*
		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
		//if(1==2){
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);  // Why 17? Because it looks good.
		}
		
		marker.setIcon(({
			url: place.icon,
			size: new google.maps.Size(71, 71),
			origin: new google.maps.Point(0, 0),
			anchor: new google.maps.Point(17, 34),
			scaledSize: new google.maps.Size(35, 35)
		}));
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);
		
		var address = '';
		if (place.address_components) {
			address = [
				(place.address_components[0] && place.address_components[0].short_name || ''),
				(place.address_components[1] && place.address_components[1].short_name || ''),
				(place.address_components[2] && place.address_components[2].short_name || '')
			].join(' ');
		}

		//infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
		//infowindow.open(map, marker);
		*/
	}
});
