OpenPath = {
	init : function(){

		//TODO: clean layout.html and add js to name space
		//console.log(this) 
		
		//this = OpenPath		
		
		
		if(	$('#mainheader').length > -1 ){
			this.main.init();
		}
	}
};


//TODO:namespace below

 var username;
  var email;
  var sessionID;
  var room = "";

  /*************************************/
  // PAGE LOAD
  /*************************************/
  $(document).ready(function() {
	
	// retreives room number based on query string
	if (getParameterByName('room') != null && getParameterByName('room') != "") {
		room = getParameterByName('room');
		console.log("Room Number: " + room);
	}
	
	
	// call auth/status when page first loads to see if user is logged in already
    var xhr = new XMLHttpRequest();
      xhr.open("POST", "/auth/status", true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.addEventListener("loadend", function(e) {
        var data = JSON.parse(this.responseText);
        if (data && data.status === "okay") {
		  handleLogin(data.email);
        }
      }, false);
      xhr.send(JSON.stringify({
        //assertion: assertion
      }));
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
			handleLogin(data.email);
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
});
/*************************************/
// FUNCTION DEFINITIONS
/*************************************/
/**
* Display username in interface
*/
var showUsername = function(user, idHash){
 email = user;
 //alert("showUsername email = " + email);
 if(user != "guest"){
	// pull username from front of email address and display in interface
	// will allow user to change in future version; will store in user data along w prefs
	username = user.match(/^([^@]*)@/)[1];		
}else{
	username = user;
};
document.querySelector("#username1").textContent = username;
document.querySelector("#profileUsername").textContent = username;	

// change invitation message
var msg = document.querySelector("#text").value;
msg = msg.replace("USERNAME", username);
msg = msg.replace("LINK", "http://www.openpath.me#" + idHash);
document.querySelector("#text").value = msg;
};
/**
* Determines actions after login based on URL path.
*/
function handleLogin(email){
var path = window.location.pathname;
console.log('handleLogin path = ' + path);
if(path == '/'){
	// ON LOGIN: do homepage handling
	console.log('ON LOGIN: do homepage handling');
	
	//window.location = "/main" +'#'+getHash();
	if(room != ""){
		room = "?room=" + room;
	}
	var hash = getHash();
	if(hash != ""){
		hash = "#" + hash;
	}
	
	window.location = "/main" + hash + room;
	
}else if(path == '/main'){
	// ON LOGIN: do main handling
	console.log('ON LOGIN: do main handling');
	getSessionIdHash(email);
}
}
/**
* Checks URL for hash containing session id.
* @param email - email of user to pass to username.
*/
function getSessionIdHash(email){
var id = getHash();
if (id != '') {	
	// call API and check for id in database
	$.ajax({
		url: '/sessions/' + id,
		dataType:'json',
		type:'GET',
		async:false,
		success: function() {
			// session id found, proceed to display username
			console.log('session id found');
			showUsername(email, id);
		},
		error: function(){
			// no id found, create new session
			createNewSession(email);
		}
	});
}else{
	// no hash present, create new session
	createNewSession(email);
}
}
/**
* Creates new session in database.
*/
function createNewSession(email){
console.log("createNewSession");
var sessionObj = { 
  /*
  'id': #, // id is auto-generated 
  */
  'creator': email,
  'EventId': null,
  'startTime': getDateTimeStamp(), 
  'privacy': "public",
  'type': "default",
  'invitedUsers': [],
  'users': [
    { 'userId': email, 'startTime': getDateTimeStamp(), 'endTime': "5/18/2014 18:00:00" }
  ]
};
// call API and insert session
//showUsername(email, '');

$.ajax({
	url: '/sessions',
	dataType:'json',
	data: sessionObj,
	type:'POST',
	async:false,
	success: function(data) {
		console.log('new session created and session id = ' + data._id);
		showUsername(email, data._id);
	},
	error: function(data){
		console.log('there was an error creating a new session' + data);
	}
});
}
/*************************************/
// GLOBAL UTILITY FUNCTIONS
/*************************************/
/**
* Retrives query string
*/
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
/**
* Validates Email
* @param	email
*/
var validateEmail = function(email) { 
var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
return re.test(email);
}
/**
* Retrieves and returns formatted date time
*/
function getDateTimeStamp(){
	var dateobj=new Date();
    var year = dateobj.getFullYear();
    var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
    var day = ("0" + dateobj.getDate()).slice(-2);
    var hours = ("0" + dateobj.getHours()).slice(-2);
    var minutes = ("0" + dateobj.getMinutes()).slice(-2);
    var seconds = ("0" + dateobj.getSeconds()).slice(-2);
    converted_date = parseInt(month) + "/" + parseInt(day) + "/" + year;
	converted_time = hours + ":" + minutes + ":" + seconds;
    return converted_date + " " + converted_time;
  }
/**
* Gets and returns hash value, otherwise, returns empty string.
*/
function getHash(){
	var hash = "";
	var url = document.location.toString();
	if (url.match('#')) {
		// hash found, retrieve id
	    hash = url.split('#')[1];
	};
	return hash;
}
