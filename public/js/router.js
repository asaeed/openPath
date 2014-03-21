'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Router
 * @author jamiegilmartin@gmail.com
 * @description a front end router to hide / show different views
 */
OpenPath.Router = {
	init : function(){
		//all pages 
		this.pages = document.querySelectorAll('.page');
		this.views = document.querySelectorAll('.view');

		//individual pages
		this.videos = document.querySelector('#videos');
		this.profile = document.querySelector('#profile');

		//individual views
		this.myProfile = document.querySelector('#myProfile');

		console.log(this.pages,this.views)

		//links to checkRoutes on
		

	},
	checkRoute : function(){
		//hide all
		this.hideAll();

		console.log('router',window.location.hash.split('#/')[1]);

		switch(window.location.hash.split('#/')[1]){
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
	showProfile : function(){
		this.profile.style.display = 'block';
		this.myProfile.style.display = 'block';
	},
	showEditProfile : function(){
		console.log('route  edit profile')
	}
};