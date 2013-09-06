OpenPath = window.OpenPath || {};


OpenPath.home = {
	init : function(){				
		this.events();
	},
	events : function(){
		/**
		 * TODO: determine if we are adding guest back in
		 */
		// Persona login button
		$('#loginbtn').mouseup(function() {
			navigator.id.request();
		});

	}

};
