'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Router
 * @author jamiegilmartin@gmail.com
 * @description a front end router to hide / show different views
 *   			bind events and templates
 */
OpenPath.Router = {
	init : function(){

		//header
		this.header = document.querySelector('#mainHeader');
		this.footer = document.querySelector('#mainFooter');
		//all pages & all views 
		this.pages = document.querySelectorAll('.page');
		this.views = document.querySelectorAll('.view');

		//individual pages
		this.videos = document.querySelector('#videos');
		this.invite = document.querySelector('#invite');
		this.events = document.querySelector('#events');
		this.profile = document.querySelector('#profile');
		this.err = document.querySelector('#error');


		//individual views ( || sub pages )
		this.videosView = document.querySelector('#videosView');
		this.inviteView = document.querySelector('#inviteView');
			//profile
		this.myProfile = document.querySelector('#myProfile');
		this.editProfile = document.querySelector('#editProfile');
		this.myPath = document.querySelector('#myPath');
		this.notifications = document.querySelector('#notifications');
		this.settings = document.querySelector('#settings');
			//events
		this.upcomingEvents = document.querySelector('#upcomingEvents');
		this.nearbyEvents = document.querySelector('#nearByEvents');
		this.addNewEvent = document.querySelector('#addNewEvent');
		this.inviteToEvent = document.querySelector('#inviteToEvent');


		//console.log(this.pages,this.views)

		this.helpers();
		this.bindRoutes();
	},
	helpers : function(){
		//@see http://stackoverflow.com/a/16315366/1308629
		Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
		    switch (operator) {
		        case '==':
		            return (v1 == v2) ? options.fn(this) : options.inverse(this);
		        case '===':
		            return (v1 === v2) ? options.fn(this) : options.inverse(this);
		        case '<':
		            return (v1 < v2) ? options.fn(this) : options.inverse(this);
		        case '<=':
		            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
		        case '>':
		            return (v1 > v2) ? options.fn(this) : options.inverse(this);
		        case '>=':
		            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
		        case '&&':
		            return (v1 && v2) ? options.fn(this) : options.inverse(this);
		        case '||':
		            return (v1 || v2) ? options.fn(this) : options.inverse(this);
		        default:
		            return options.inverse(this);
		    }
		});
	},
	bindRoutes : function(){
		var self = this;

		//links to checkRoutes on
		this.routes = document.querySelectorAll('.route');


		/**
		 * @class route
		 * @description small helper class to add event listener
		 */
		function route( route ){
			//event function to remove later
			function routeEvent(e){
				//remove active from btns
				for(var i=0;i<self.routes.length;i++){
					self.routes[i].classList.remove('active');
				}
				//add active to btn
				route.classList.add('active');
				self.checkRoute( route.getAttribute('href') );
			}
			if(route._hasEventListener) return;
			//remove event first
			route.addEventListener('click',routeEvent,false);
			route._hasEventListener = true;
		}
		//make route instances
		for(var i=0;i<this.routes.length;i++){
			new route( this.routes[i] );
		}
	},
	checkRoute : function( route ){
		//reset a.k.a. hide all
		this.reset();

		console.log(route, 'router', window.location.hash.split('#/')[1]);
	
		var route = route ? route.split('#/')[1] : window.location.hash.split('#/')[1];

		if(route){
			var id = route.split('/')[1];
			route = route.split('/')[0];
		}


		/**
		 * all our routes switch
		 */
		switch(route){
			case 'videos':
				this.showVideos();
			break;
			case 'invite':
				this.showInvite();
			break;
			case 'invited':
				this.showInvited();
			break;
			case 'events':
				this.showEvents();
			break;
			case 'nearby-events':
				this.showNearbyEvents();
			break;
			case 'add-new-event':
				this.showAddNewEvent();
			break;
			case 'edit-event':
				this.showEditEvent( id );
			break;
			case 'invite-to-event':
				this.showInviteToEvent( id );
			break;
			case 'profile':
				this.showProfile();
			break;
			case 'edit-profile':
				this.showEditProfile();
			break;
			case 'myPath':
				this.showMyPath();
			break;
			case 'notifications':
				this.showNotifications();
			break;
			case 'settings':
				this.showSettings();
			break;
			case 'error':
				this.showError();
			break;
			default:
				this.showVideos();
			break;
		}
	},
	reset : function(){
		//reset header
		this.header.style.width = 100+'%';
		this.footer.style.display = 'block';

		//hide pages
		for(var i=0;i<this.pages.length;i++){
			this.pages[i].style.display = 'none';
			this.pages[i].style.opacity = 0;
		}
		//hide views
		for(var j=0;j<this.views.length;j++){
			this.views[j].style.display = 'none';
			this.views[j].style.opacity = 0;
		}
	},
	show : function(ele){
		ele.style.display = 'block';
		ele.style.opacity = 1;
	},
	showVideos : function(){
		this.show(this.videos);
		this.show(this.videosView);

		this.header.style.width = 75+'%';
		this.footer.style.display = 'none';
		//handle video views in main
	},
	showInvite : function(){
		this.show(this.invite);
		this.show(this.inviteView);

		var inviteMsg = document.getElementById('inviteMsg');
		//compile template
		var source = document.getElementById('addParticipantsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		inviteMsg.innerHTML = template(OpenPath.user.obj);
	},
	showInvited : function(){
		this.show(this.invite);
		this.show(this.inviteView);

		var inviteMsg = document.getElementById('inviteMsg');
		//compile template
		var source = document.getElementById('addParticipantsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		
		inviteMsg.innerHTML = template();

		//TODO: modal
		alert('Your email has been sent.')
	},
	showEvents : function(){
		var self = this;
		this.show(this.events);
		this.show(this.upcomingEvents);

		var content = this.upcomingEvents.getElementsByClassName('content')[0];
		//compile template
		var source = document.getElementById('EventsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		if(OpenPath.eventsController.data === null){
			OpenPath.eventsController.get();
			OpenPath.eventsController.got = function(data){
				console.log('ev',data);
				this.data = data;
				content.innerHTML = template( data );

				initEvents();
			};
		}else{
			content.innerHTML = template( OpenPath.eventsController.data );

			initEvents();	
		}
		
		/**
		 * init event views
		 */
		function initEvents(){
			var events = content.getElementsByClassName('event');

			/**
			 * Event helper class
			 * individual event instance
			 */
			function eventView(element){
				var me = this;
				this.element = element;
				this.joinBtn = this.element.getElementsByClassName('joinBtn')[0]

				this.eventHandler(this.joinBtn,'click',function(e){
					e.preventDefault();
					console.log('join',me.joinBtn.getAttribute('href'));
					//set url and post
					me.url = "/gotoevent/"+ me.joinBtn.getAttribute('href');
					me.post({"data":null});
				});
			}
			//inherits OpenPath.View
			eventView.prototype = new OpenPath.View();
			eventView.prototype.constructor = eventView;
			
			//when posted, join event
			/***
			 *** JOIN EVENT ******
			 ***/
			eventView.prototype.posted = function(data){
				if(data){
					self.checkRoute('#/videos');
					//remove #/events from url
					history.pushState({query:window.location.search}, document.title, '#/videos');
					
					OpenPath.switchRoom(data);
				}
			};


			/**
			 * events loop
			 */
			for(var i=0; i<events.length; i++){

				
				var mapwrap = events[i].getElementsByClassName('mapWrap')[0];
				//render map
				OpenPath.Ui.renderMap(mapwrap, mapwrap.dataset.latitude, mapwrap.dataset.longitude, mapwrap.dataset.reference, mapwrap.dataset.formattedaddress );

				//TODO :  don't remake on events page load
				new eventView(events[i]);
			}

			//console.log(OpenPath.eventArr,'fix this! duplicating dom items')

			//rebind routes
			self.bindRoutes();	
		}
	},
	showNearbyEvents :  function(){
		var self = this;
		this.show(this.events);
		this.show(this.nearbyEvents);
		
		//store all event's locations
		var locations = [];

		var content = this.nearbyEvents.getElementsByClassName('content')[0];
		var aside = content.getElementsByTagName('aside')[0];
		var nearbyMap = document.getElementById('nearByMap');
		nearbyMap.style.height = window.innerHeight - 200 + 'px';

		//compile template
		var source = document.getElementById('EventsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		//if already have events from other 'page'
		if(OpenPath.eventsController.data === null){
			OpenPath.eventsController.get();
			OpenPath.eventsController.got = function(data){
				console.log('nearbyev',data);
				this.data = data;
				//add to locations array
				for(var i=0;i<data.events.length;i++){
					locations.push(data.events[i].location)
				}

				aside.innerHTML = template( data );
				

				initMap();
				//initEvents();
			};
		}else{
			aside.innerHTML = template( OpenPath.eventsController.data );

			initEvents();	
		}


		/**
		 * init event views - copied from above TODO: merge with above
		 */
		function initEvents(){
			var events = content.getElementsByClassName('event');

			/**
			 * Event helper class
			 * individual event instance
			 */
			function eventView(element){
				var me = this;
				this.element = element;
				this.joinBtn = this.element.getElementsByClassName('joinBtn')[0]

				this.eventHandler(this.joinBtn,'click',function(e){
					e.preventDefault();
					console.log('join',me.joinBtn.getAttribute('href'));
					//set url and post
					me.url = "/gotoevent/"+ me.joinBtn.getAttribute('href');
					me.post({"data":null});
				});
			}
			//inherits OpenPath.View
			eventView.prototype = new OpenPath.View();
			eventView.prototype.constructor = eventView;
			
			//when posted, join event
			/***
			 *** JOIN EVENT ******
			 ***/
			eventView.prototype.posted = function(data){
				if(data){
					self.checkRoute('#/videos');
					//remove #/events from url
					history.pushState({query:window.location.search}, document.title, '#/videos');
					
					OpenPath.switchRoom(data);
				}
			};


			/**
			 * events loop
			 */
			for(var i=0; i<events.length; i++){
				//TODO :  don't remake on events page load
				new eventView(events[i]);
			}

			//console.log(OpenPath.eventArr,'fix this! duplicating dom items')

			//rebind routes
			self.bindRoutes();	
		}

		/**
		 * MAP
		 */
		function initMap(){
			console.log(locations,OpenPath.user.obj.location.coords.latitude, OpenPath.user.obj.location.coords.longitude)



			var pins = [];
			var mapOptions = {
				zoom: 3,
				center: new google.maps.LatLng(OpenPath.user.obj.location.coords.latitude, OpenPath.user.obj.location.coords.longitude),
				mapTypeId: google.maps.MapTypeId.TERRAIN
			};
			var map = new google.maps.Map(nearbyMap,mapOptions);
			
			//loop locations
			for(var i=0;i<locations.length;i++){
				pins.push(new google.maps.LatLng(locations[i].latitude,locations[i].longitude));
			}


			var pinsMap = new google.maps.Polyline({
				path: pins,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});

			pinsMap.setMap(map);
			/*
			marker.setIcon(({
				url: place.icon,
				//url: 'images/marker.png',
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
			*/

			//if onload this page location not saved to server so load at great pyramid		
			if(OpenPath.user.obj.location.coords.latitude!==null && OpenPath.user.obj.location.coords.longitude!==null){
				//OpenPath.Ui.renderMap(nearbyMap, OpenPath.user.obj.location.coords.latitude, OpenPath.user.obj.location.coords.longitude );
			}else{
				//OpenPath.Ui.renderMap(nearbyMap, 29.979252, 31.133874 );
			}
		}
		
	},
	showAddNewEvent :  function(){
		var self = this;
		this.show(this.events);
		this.show(this.addNewEvent);

		/**
		 * Event helper class
		 * create individual event modal instance
		 */
		function eventModel(data){
			var me = this;
			me.url = '/events';
			me.post(data);
		}
		//inherits OpenPath.View
		eventModel.prototype = new OpenPath.Model();
		eventModel.prototype.constructor = eventModel;
		
		//when posted
		eventModel.prototype.posted = function(data){
			console.log('posted',data)
			self.checkRoute('#/events');
		};


		var form = document.getElementById("addNewEventForm"),
			name = document.getElementById("name"),
			link = document.getElementById("link"),
			date = document.getElementById("date"),
			startTime = document.getElementById("startTime"),
			endTime = document.getElementById("endTime"),
			description = document.getElementById("description"),
			locationInput = document.getElementById("location"),
			longitudeInput = document.getElementById("longitude"),
			latitudeInput = document.getElementById("latitude"),
			referenceInput = document.getElementById("reference"),
			formattedAddressInput = document.getElementById("formattedAddress"),
			saveEventBtn = document.getElementById('saveEventBtn');


		//reset form
		form.reset();
		//try dom hack //form.onkeypress = console.log( OpenPath.Utils.checkEnter() );
		/**
		 * autocompleteLocationInput
		 */
		function autocompleteLocationInput(){
			var autocomplete = new google.maps.places.Autocomplete(locationInput);
			
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				//infowindow.close();
				

				var place = autocomplete.getPlace();
				if (!place.geometry) {
					// Inform the user that a place was not found and return.
					alert('location not found')
					return;
				}else{
					console.log('adding',place)
					longitudeInput.value = place.geometry.location.lng();
					latitudeInput.value = place.geometry.location.lat();
					referenceInput.value = place.reference;
					formattedAddressInput.value = place.formatted_address;
					console.log(place.reference);	
				}
			});
		}
		//call auto complete
		autocompleteLocationInput();
		
		/**
		 * grade level //TODO
		 */
		var gradelevelsArr = [];
		/*
		this.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
			gradelevelsArr.push( $(this).val() );
		});
		*/

		this.postNewEvent = function(e){
			e.preventDefault();
			var dSplit = date.value.split('-');
			var newDate = new Date( dSplit[0], dSplit[1]-1, dSplit[2] );
			//create model (above) auto post
			new eventModel({
				name: name.value,
				link: link.value,
				description: description.value,
				location : {
					name : locationInput.value,
					longitude : longitudeInput.value ,
					latitude : latitudeInput.value,
					reference : referenceInput.value,
					formattedAddress : formattedAddressInput.value
				},
				date : newDate,
				startTime:  startTime.value,
				endTime : endTime.value
			});
		}

		//don't add more that one event listener
		if(saveEventBtn._hasEventListener) return;
		saveEventBtn.addEventListener('click',this.postNewEvent,false);
		saveEventBtn._hasEventListener = true;
	},
	showEditEvent : function(){
		this.show(this.events);
		this.show(this.addNewEvent);
	},
	showInviteToEvent : function( id ){
		var self = this;
		this.show(this.invite);
		this.show(this.inviteView);

		//create view instance
		var inviteToEventView = new OpenPath.View();
		inviteToEventView.url = '/events/'+id;
		//get data
		inviteToEventView.get();

		var inviteMsg = document.getElementById('inviteMsg');
		//compile template
		var source = document.getElementById('inviteToEventTemplate').innerHTML;
		var template = Handlebars.compile(source);

		inviteToEventView.got = function(data){
			console.log('inviteToEventView got', data );
			data.user = OpenPath.user.obj;
			console.log(data)
			inviteMsg.innerHTML = template( data );
		};
	},
	showProfile : function(){
		this.show(this.profile);
		this.show(this.myProfile);

		console.log(OpenPath.user.obj);
		var content = this.myProfile.getElementsByClassName('content')[0];
		//compile template
		var source = document.getElementById('ProfileTemplate').innerHTML;
		var template = Handlebars.compile(source);

		content.innerHTML = template( OpenPath.user.obj );

		//var editBtn = content.getElementsByClassName('editBtn')[0];
		this.bindRoutes();//bind edit btn
	},
	showEditProfile : function(){
		this.show(this.profile);
		this.show(this.editProfile);

		var content = this.editProfile.getElementsByClassName('content')[0];
		//compile template
		var source = document.getElementById('EditProfileTemplate').innerHTML;
		var template = Handlebars.compile(source);

		content.innerHTML = template( OpenPath.user.obj );

		//gradelevel
		var gradelevel = content.getElementsByClassName('gradelevel')[0];


	},
	showMyPath : function(){
		this.show(this.profile);
		this.show(this.myPath);
	},
	showNotifications : function(){
		this.show(this.profile);
		this.show(this.notifications);
	},
	showSettings : function(){
		this.show(this.profile);
		this.show(this.settings);

		var content = this.settings.getElementsByClassName('content')[0];
		//compile template
		var source = document.getElementById('ProfileSettingsTemplate').innerHTML;
		var template = Handlebars.compile(source);

		content.innerHTML = template( OpenPath.user.obj );
		console.log(OpenPath.user.obj)
	},
	showError : function(){
		this.show(this.err);
	}
};