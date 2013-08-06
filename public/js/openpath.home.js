OpenPath = window.OpenPath || {};


OpenPath.home = {
	init : function(){

		//TODO: clean below and add to name space
		console.log('openPath.home.init',this) 
				

	}

};


	  // Persona login button
	  $(document).ready(function() {
		$('#loginbtn').mouseup(function() {
			navigator.id.request();
		});
		// display guest login form
		$('#guestbtn').mouseup(function() {
			$("#login").fadeOut();
			$("#guestlogin").fadeIn();
		});
		
		// validate email and show main
		$('#guestloginbtn').mouseup(function() {
			var email = $('#email').val();
			var isValid = validateEmail(email);
			if(!isValid){
				$('#emailerror').modal();
			}else{
				// send email to API to authenticate
				var xhr = new XMLHttpRequest();
				xhr.open("GET", "/auth/guest", true);
				xhr.addEventListener("loadend", function(e) {
					var data = JSON.parse(this.responseText);
					if (data && data.status === "okay") {
						console.log('going to main');
						window.location = "/main";
					}
				}, false);
				xhr.send();
			};
		});
	  });