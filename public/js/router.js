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

		//individual views

			//profile
		this.myProfile = document.querySelector('#myProfile');
		this.editProfile = document.querySelector('#editProfile');

		console.log(this.pages,this.views)

		//links to checkRoutes on
		this.routes = document.querySelectorAll('.route');
		//small helper class
		function route( route ){
			route.addEventListener('click',function(e){
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
			case 'profile':
				this.showProfile();
			break;
			case 'edit-profile':
				this.showEditProfile();
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
	},
	showProfile : function(){
		this.profile.style.display = 'block';
		this.myProfile.style.display = 'block';
	},
	showEditProfile : function(){
		this.profile.style.display = 'block';
		this.editProfile.style.display = 'block';
	}
};