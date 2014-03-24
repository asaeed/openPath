'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Router
 * @author jamiegilmartin@gmail.com
 * @description a front end router to hide / show different views
 */
OpenPath.Router = {
	init : function(){
		var self = this;

		//all pages & all views 
		this.pages = document.querySelectorAll('.page');
		this.views = document.querySelectorAll('.view');

		//individual pages
		this.videos = document.querySelector('#videos');
		this.invite = document.querySelector('#invite');
		this.events = document.querySelector('#events');
		this.profile = document.querySelector('#profile');

		//individual views ( || sub pages )
			//profile
		this.myProfile = document.querySelector('#myProfile');
		this.editProfile = document.querySelector('#editProfile');
		this.myPath = document.querySelector('#myPath');
		this.notifications = document.querySelector('#notifications');
		this.settings = document.querySelector('#settings');
			//events
		this.upcomingEvents = document.querySelector('#upcomingEvents');
		this.nearbyEvents = document.querySelector('#nearbyEvents');
		this.addNewEvent = document.querySelector('#addNewEvent');


		console.log(this.pages,this.views)

		//links to checkRoutes on
		this.routes = document.querySelectorAll('.route');
		/**
		 * @class route
		 * @description small helper class to add event listener
		 */
		function route( route ){
			route.addEventListener('click',function(e){
				//remove active from btns
				for(var i=0;i<self.routes.length;i++){
					self.routes[i].classList.remove('active');
				}
				//add active to btn
				route.classList.add('active');
				self.checkRoute( route.getAttribute('href') );//not working on first click cuz....
			},false);
		}
		//make route instances
		for(var i=0;i<this.routes.length;i++){
			new route( this.routes[i] );
		}

	},
	checkRoute : function( route ){
		//hide all
		this.hideAll();

		console.log(route, 'router', window.location.hash.split('#/')[1]);

		var route = route ? route.split('#/')[1] : window.location.hash.split('#/')[1];

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
			case 'events':
				this.showEvents();
			break;
			case 'nearby-events':
				this.showNearbyEvents();
			break;
			case 'add-new-event':
				this.showAddNewEvent();
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
			default:
				this.showVideos();
			break;
		}
	},
	hideAll : function(){
		//pages
		for(var i=0;i<this.pages.length;i++){
			this.pages[i].style.display = 'none';
		}
		//views
		for(var j=0;j<this.views.length;j++){
			this.views[j].style.display = 'none';
		}
	},
	showVideos : function(){
		this.videos.style.display = 'block';
	},
	showInvite : function(){
		this.invite.style.display = 'block';
	},
	showEvents :  function(){
		this.events.style.display = 'block';
		this.upcomingEvents.style.display = 'block';
	},
	showNearbyEvents :  function(){
		this.events.style.display = 'block';
		this.nearbyEvents.style.display = 'block';
	},
	showAddNewEvent :  function(){
		this.events.style.display = 'block';
		this.addNewEvent.style.display = 'block';

		/**
		 * autocompleteLocationInput
		 */
		function autocompleteLocationInput(){

			var locationInput = document.getElementById("location"),
				longitudeInput = document.getElementById("longitude"),
				latitudeInput = document.getElementById("latitude");

			console.log('locationInput',locationInput);
			var autocomplete = new google.maps.places.Autocomplete(locationInput);
			
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				//infowindow.close();
				
				var place = autocomplete.getPlace();
				if (!place.geometry) {
					// Inform the user that a place was not found and return.
					alert('location not found')
					return;
				}else{
					longitudeInput.value = place.geometry.location.lng();
					latitudeInput.value = place.geometry.location.lat();
					console.log('location value',locationInput.value , longitudeInput.value, latitudeInput.value, place.geometry)
				}
			});
		}

		autocompleteLocationInput();
		

	},
	showProfile : function(){
		this.profile.style.display = 'block';
		this.myProfile.style.display = 'block';
	},
	showEditProfile : function(){
		this.profile.style.display = 'block';
		this.editProfile.style.display = 'block';
	},
	showMyPath : function(){
		this.profile.style.display = 'block';
		this.myPath.style.display = 'block';
	},
	showNotifications : function(){
		this.profile.style.display = 'block';
		this.notifications.style.display = 'block';
	},
	showSettings : function(){
		this.profile.style.display = 'block';
		this.settings.style.display = 'block';
	}
};