
/*************************************/
// PERSONA HANDLING
/*************************************/
navigator.id.watch({

    // this is the callback that persona triggers when the user logs in
    onlogin: function(assertion) {		
      var xhr = new XMLHttpRequest();
      xhr.open("POST", "/auth/status", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
      	var data = JSON.parse(this.responseText);

		if (data && data.status === "okay") {
			OpenPath.handleLogin(data.email);
        }
      }, false);
      xhr.send(JSON.stringify({
        assertion: assertion
      }));
    },

    // this is the callback that persona triggers when the user logs out
    onlogout: function() {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/auth/logout", true);
      xhr.addEventListener("loadend", function(e) {

	  var path = window.location.pathname;
	  console.log('onlogout path = ' + path);
	  if(path == '/main'){
		window.location = "/";
	  }
      }, false);
      xhr.send();
    }
});