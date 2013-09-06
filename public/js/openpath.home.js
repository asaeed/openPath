OpenPath = window.OpenPath || {};


OpenPath.home = {
	init : function(){				
		this.events();
	},
	events : function(){
		// Persona login button
		$('#loginbtn').mouseup(function() {
			navigator.id.request();
		});

	}

};
