'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Utils
 * @author jamiegilmartin@gmail.com
 */
OpenPath.Ui = {
	init : function(){
		this.videosView = document.getElementById('videosView');

		this.events();
		this.tooltips();
		this.removeQueryStringFromUrl();
		this.convertEventTimeInTitle();
	},
	events : function(){
		var self = this;

		window.addEventListener('resize',function(){
			self.windowResize();
		}, false);
	},
	windowResize : function(){
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		//set videos height
		this.videosView.style.height = this.h + 'px';
	},
	/**
	 * remove query string for URL
	 */
	tooltips : function(){
		var toolTips = document.getElementsByClassName('tooltip');
		/**
		 * @class tooltip
		 * @description small helper class to add event listeners
		 */
		function tooltip( btn ){
			var self = this;
			var over = false;
			var mousePos={};
			var delay = 800;

			console.log(btn.offsetLeft,btn.offsetTop)

			//make tip
			var tip = document.createElement('div');
			tip.classList.add('tip');
			tip.innerHTML = btn.getAttribute('title');
			tip.style.top = btn.offsetTop + btn.offsetHeight + 20 + 'px';
			tip.style.left = btn.offsetLeft  + 'px';

			document.body.appendChild(tip);

			btn.addEventListener('mouseover',function(e){
				over = true;
				mousePos = {
		            x: e.clientX,
		            y: e.clientY
		        };
				setTimeout(show, delay);
			},false);
			btn.addEventListener('mouseout',function(e){
				over = false;
				tip.style.display = 'none';
				tip.style.opacity = 0;
			},false);

			function show(){
				if(over){
					console.log('show');
					tip.style.display = 'block';
					tip.style.opacity = 1;
					tip.style.left = mousePos.x - (tip.offsetWidth/2)  + 'px';
				}
			}
		}

		//loop and make tip instances
		for(var i=0;i<toolTips.length;i++){
			new tooltip(toolTips[i]);
		}
	},
	/**
	 * tooltips
	 */
	removeQueryStringFromUrl : function(){
		if(window.location.search){
			history.pushState({query:window.location.search}, document.title, '/');
		}
	},
	/**
	 * convert event title time from 24 hour to 12 hour clock
	 */
	convertEventTimeInTitle : function(){
		var eventTitle  = document.getElementsByClassName('eventTitle')[0];
		if(eventTitle){
			var st = eventTitle.getElementsByClassName('startTime')[0];
			var et = eventTitle.getElementsByClassName('endTime')[0];

			st.innerHTML = OpenPath.Utils.formatTime(st.innerHTML);
			et.innerHTML = OpenPath.Utils.formatTime(et.innerHTML);
		}
	},
	renderMap : function(ele, lat, lng, reference, formattedAddress ){
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


	}
};