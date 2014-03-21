'use strict';

OpenPath = window.OpenPath || {};

OpenPath.Router = {
	init : function(){
		console.log();
		switch(window.location.hash.split('#/')[1]){
			case 'invite':
				this.invite();
			break;
			case 'events':
				this.events();
			break;
			case 'profile':
				this.profile();
			break;
			case 'edit-profile':
				this.editProfile();
			break;
		}
	},
	profile : function(){
		console.log('route profile')
	},
	editProfile : function(){
		console.log('route  edit profile')
	}
};