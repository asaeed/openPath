'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Utils
 * @author jamiegilmartin@gmail.com
 */
OpenPath.Utils = {};

OpenPath.Utils.renderMap = function(ele, lat, lng, reference, formattedAddress ){
	var ele = ele;
	var request = {
		location : new google.maps.LatLng(lat, lng),
		reference : reference,
		formatted_address : formattedAddress
	};
	//console.log(request)
	
	var mapOptions = {
		center: new google.maps.LatLng(lat, lng),
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(ele, mapOptions);
	
	var infowindow = new google.maps.InfoWindow();
	/*
	var marker = new google.maps.Marker({
		map: map
	});*/
	var service = new google.maps.places.PlacesService( map );
	
	//called?
    service.getDetails( request, function(place, status) {
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
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  // Why 17? Because it looks good.
			}
			
			marker.setIcon(({
				//url: place.icon,
				url: 'images/marker.png',
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
		}
    });


};

