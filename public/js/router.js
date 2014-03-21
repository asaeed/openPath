'use strict';

OpenPath = window.OpenPath || {};

OpenPath.Router = {
	init : function(){
		console.log();
		switch(window.location.hash.split('#/')[1]){
			case 'portfolio':
				this.portfolio();
			break;
		}
	},
	portfolio : function(){
		console.log('route portfolio')
	}
};