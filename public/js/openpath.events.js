OpenPath = window.OpenPath || {};

OpenPath.events = {
	init : function(){
		//init add event form
		OpenPath.events.addEvent.init();

		console.log('OpenPath.events..init');

		var self = this;
		this.get(function(d){
			self.populate(d);
		});

		

	},
	populate : function( data ){
		var self = this;
		//console.log(data)
		// parse and display list      
      	var output = "";
		var evt;
		for(var i in data){
			evt = data[i];
			output += '<li>';
			output += '<article>';
			output += '<h3><a href="'+ evt.link +'" target="_blank">' + evt.name + '</a></h3>';
			output += '<p class="time">'+evt.startTime + ' to ' + evt.endTime + '</p>';
			output += '<p class="location">'+evt.locationDescription + '</p>';
			output += '<p>' + evt.description + '</p>'+evt.location[0]+' '+evt.location[1];
			output += '</article>';
			output += '<div class="mapWrap" id="event_'+i+'" data-lat="'+evt.location[0]+'" data-lng="'+evt.location[1]+'"></div>';//map
			output += '</li>';

			
		}
		// write to both event lists
		$('.eventslist').html(output);
		$('.eventslist li').each(function(i){
			var $mapWrap = $(this).find('.mapWrap');
			//init map
			self.getMap('event_'+i,$mapWrap.data('lat'),$mapWrap.data('lng'));
		})
	},
	get : function( callback ){
		console.log('get events');
		$.ajax({
			url: '/events',
			dataType:'json',
			type:'GET',
			async:false,
			success: function(data) {
				console.log('events got ',data)
				//call populate
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
	//make this a class
	getMap : function(ele,lat,lng){
		var pos = new google.maps.LatLng(lat, lng);
		var options = {
			zoom: 6,
    		center: new google.maps.LatLng(-34.397, 150.644),
    		mapTypeId: google.maps.MapTypeId.ROADMAP/*
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			mapTypeControl: true,
			mapTypeControlOptions: {
				style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
				position: google.maps.ControlPosition.BOTTOM_RIGHT
			},
			center: pos,
			panControl: true,
			panControlOptions: {
				position: google.maps.ControlPosition.RIGHT_BOTTOM
			},
			*/
		};
		eventsMap = new google.maps.Map(document.getElementById(ele), options);
		eventsmapmarker = new google.maps.Marker({
			position: options.center,
			map: eventsMap,
			icon: 'img/marker.png',
			center: options.center
		});
	},
	/**
	 * Parses and displays events
	 * @param array of json objects - 0ld
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