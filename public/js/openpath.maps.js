OpenPath = window.OpenPath || {};

OpenPath.maps = {
	map1 : null,
	map1marker : null,
	map2 : null,
	map2marker : null,
	geolocate : function(target) {
		var self = this;
		console.log('initUserMap.target = ' + target);
		// Try HTML5 geolocation
		if(navigator.geolocation) {

			navigator.geolocation.getCurrentPosition(function(position) {
				var targetMap;
				var pos = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
				//updateUser(position.coords.latitude,  position.coords.longitude);  //fake func anyway
				var mapOptions = {
					zoom: 6,
					center: pos,
					mapTypeId: google.maps.MapTypeId.ROADMAP,
					mapTypeControl: true,
					mapTypeControlOptions: {
						style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
						position: google.maps.ControlPosition.RIGHT_BOTTOM
					}
				};

				if(target == "other_video"){
					self.map2 = new google.maps.Map(document.getElementById('usermap2'), mapOptions);

					self.map2marker = new google.maps.Marker({
						position: pos,
						map: self.map2,
						title: ''
					});
					self.map2.setCenter(pos);

					// get and display street address 
					this.codeLatLng(pos, "#userlocation2");
					targetMap = self.map2;
				}else{
					self.map1 = new google.maps.Map(document.getElementById('usermap1'), mapOptions);

					self.map1marker = new google.maps.Marker({
						position: pos,
						map: self.map1,
						title: ''
					});
					self.map1.setCenter(pos);

					// get and display street address 
					this.codeLatLng(pos, "#userlocation1");
					targetMap = self.map1;
				}			
			}, function() {
				this.handleNoGeolocation(true, targetMap);
			});

		} else {
			// Browser doesn't support Geolocation
			this.handleNoGeolocation(false, targetMap);
		}
	},
	handleNoGeolocation : function(errorFlag, map) {
		if (errorFlag) {
			var content = 'Error: The Geolocation service failed.';
		} else {
			var content = 'Error: Your browser doesn\'t support geolocation.';
		}
		//set map to nyc
		var nycPos = new google.maps.LatLng(40.7142, -74.0064);
		var options = {
			map: map,
			center: nycPos,
			position: nycPos,
			content: content
		};
	},
	/**
	* Returns reverse-geocoded location
	* @param pos		Lat/Long object
	* @param target	target HTML element to write to
	*/
	codeLatLng : function(pos, target) {
	  this.geocoder = new google.maps.Geocoder();
	  this.geocoder.geocode({'latLng': pos}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
			$(target).html(results[1].formatted_address);
	      } else {
	        console.log('No results found');
	      }
	    } else {
	      console.log('Geocoder failed due to: ' + status);
	    }
	  });
	}
};



  



  /**
  * Initializes Map displaying local events
  
  var eventsMap, eventsmapmarker;

  function initEventsMap(){

	var pos = new google.maps.LatLng(40.7142, -74.0064);
	var options = {
	    map: eventsMap,
		zoom: 6,
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
	  };
	  eventsMap = new google.maps.Map(document.getElementById('eventsmap'), options);
	  eventsmapmarker = new google.maps.Marker({
	      position: options.center,
	      map: eventsMap,
	      icon: 'img/marker.png',
		  center: options.center
	  });	
  }
*/

  /**
  * Initializes Map displaying local events
    var myPathMap, myPathMapMarker;
  function initMyPathMap(){

	var pos = new google.maps.LatLng(41.8500, -87.6500);
	var options = {
	    map: myPathMap,
		zoom: 6,
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
	  };
	  myPathMap = new google.maps.Map(document.getElementById('mypathmap'), options);
	  myPathMapMarker = new google.maps.Marker({
	      position: options.center,
	      map: myPathMap,
	      icon: 'img/marker.png',
		  center: options.center
	  });	
  }

*/
