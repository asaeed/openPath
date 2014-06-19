'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Utils
 * @author jamiegilmartin@gmail.com
 */
OpenPath.Ui = {
	init : function(){
		this.videosView = document.getElementById('videosView');

		//call onload ui methods
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

		//footer link modals
		var tosLink = document.getElementById('tosLink'),
			privacyPolicyLink = document.getElementById('privacyPolicyLink'),
			aboutLink = document.getElementById('aboutLink'),
			tos = document.getElementById('tos'),
			privacyPolicy = document.getElementById('privacyPolicy'),
			about = document.getElementById('about');

		tosLink.addEventListener('click',function(e){
			e.preventDefault();
			self.modal(tos);
		},false);
		privacyPolicyLink.addEventListener('click',function(e){
			e.preventDefault();
			self.modal(privacyPolicy);
		},false);
		aboutLink.addEventListener('click',function(e){
			e.preventDefault();
			self.modal(about);
		},false);

		//NB: allow in user.js with navigator code
	},
	windowResize : function(){
		this.w = window.innerWidth;
		this.h = window.innerHeight;

		//set videos height
		//if(this.videos) this.videosView.style.height = this.h + 'px';
	},
	/**
	 * tool tips
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

			//make tip
			var tip = document.createElement('div');
			tip.classList.add('tip');
			tip.innerHTML = btn.dataset.title;
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
	 * remove query string for URL (called from intro as well)
	 */
	removeQueryStringFromUrl : function(){
		if(window.location.search){
			history.pushState({query:window.location.search}, document.title, '/');
		}
	},
	updateHeader : function(data){
		///update main header
		var headerTitle = document.getElementById('headerTitle');
		//compile template
		var source = document.getElementById('headerTitleTemplate').innerHTML;
		var template = Handlebars.compile(source);

		headerTitle.innerHTML = template( data );
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
	/**
	 * renders google map (called from video class, router.showEvents)
	 */
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
		if(reference){
			var service = new google.maps.places.PlacesService( map );
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
		}else{
			var marker = new google.maps.Marker({
				map: map,
				position: mapOptions.center
			});
			marker.setIcon(({
				url: 'images/marker.png',
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(mapOptions.center);
			marker.setVisible(true);
		}
	},
	modal : function( modal ){
		var self = this;
		this.modalWrap = document.getElementById('modalWrap');
		this.modals = document.getElementsByClassName('modal');
		this.modalCloseBtn = modalWrap.getElementsByClassName('closeBtn')[0];

		window.scrollTo(0,0);
		
		this.modalWrap.style.display = 'block';
		this.modalWrap.style.height = document.body.offsetHeight +200 + 'px'; //shameless hack to make about fit

		for(var i=0;i<this.modals.length;i++){
			if(this.modals[i] === modal){
				this.modals[i].style.display = 'block';
			}else{
				this.modals[i].style.display = 'none';
			}
		}
		
		this.modalCloseBtn.addEventListener('click',function(e){
			e.preventDefault();
			self.closeModals();
		},false);
	},
	closeModals : function(){
		if(this.modalWrap.classList.contains('alertModal')) this.modalWrap.classList.remove('alertModal');
		this.modalWrap.style.display = 'none';
		for(var i=0;i<this.modals.length;i++){
			this.modals[i].style.display = 'none';
		}
	}
};