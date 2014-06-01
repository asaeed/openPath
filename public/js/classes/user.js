'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class User, you :)
 */
OpenPath.User = function( email ){
	//console.log('new User');

	this.obj = {
		name :  null,
		email :  email, //value passed by server to hidden input
		room_id : null,
		event_id : null,
		peer_id : null,
		stream :  null,
		location : {
			coords: {
				latitude : null,
				longitude : null
			}
		}
	};
	this.url = '/user/'+this.obj.email;
	//get data
	this.get();



};
//inherits View
OpenPath.User.prototype = new OpenPath.Model();
OpenPath.User.prototype.constructor = OpenPath.User;

OpenPath.User.prototype.got = function(data){
	var self = this;
	this.obj.name = data.firstName + ' ' +data.lastName;
	this.obj.room_id = data.currentRoom;
	this.obj.event_id = data.currentEvent;
	//console.log('get user',this.obj, data);

	//if event id, join event
	if(this.obj.event_id){
		OpenPath.joinEvent(this.obj.event_id);
	}

	//create video
	this.video = new OpenPath.Video(this);

	/**
	 * check if this.user is presenter
	 */
	this.checkIfPresenter(function( isPresenter ){
		if(isPresenter){
			console.log('I\'m presenter');
			//set userVideo to presenter
			OpenPath.presenterElement.appendChild(self.video.element);
		}else{
			console.log('I\'m not presenter');
			//add to peer list
			var li = document.createElement('li');
			li.appendChild(self.video.element);
			OpenPath.peersList.appendChild(li);
		}

		self.connect();
	});
};

OpenPath.User.prototype.connect = function(){
	//if(!this.obj.stream) this.getMyMedia();
	//if(!this.obj.location) this.getMyLocation();
	this.getMyMedia();
	this.getMyLocation();
};
/**
 * getMyMedia, send to socket
 */
OpenPath.User.prototype.getMyMedia = function(){
	var self = this;
	if(navigator.getUserMedia) {
		navigator.getUserMedia( {video: true, audio: true}, function(stream) {

			console.log('got my stream')
			//set user stream
			self.obj.stream = stream;

			OpenPath.onMyStreamAllowed();

			//send stream
	  		//OpenPath.socket.emit("stream", self.obj);

	  		//render video
			self.video.render();
		},
		function(err) {
			console.log('Failed to get local stream' ,err);
			//did not join, pressed no allow
			//TODO msg
		});
	}else{
		console.log('can\'t get user media');
	}
};
/**
 * getMyLocation, send to socket
 */
OpenPath.User.prototype.getMyLocation = function(){
	var self = this;

	function setLocation(position){
		self.obj.location.coords.latitude = position.coords.latitude;
		self.obj.location.coords.longitude  = position.coords.longitude;

		console.log("got my location - Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude );

		//send location
	 	OpenPath.socket.emit("location", self.obj );

	 	//re-render video
		self.video.render();
	}
	//location error
	function showLocationError(error){
		switch(error.code){
			case error.PERMISSION_DENIED:
				console.log("User denied the request for Geolocation.");
			break;
			
			case error.POSITION_UNAVAILABLE:
				console.log("Location information is unavailable.");
			break;
			case error.TIMEOUT:
				console.log("The request to get user location timed out.");
			break;
			case error.UNKNOWN_ERROR:
				console.log("An unknown error occurred.");
			break;
		}
	}
	//get location
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition( setLocation, showLocationError );
	}else{
		console.log("Geolocation is not supported by this browser.");
	}
};
/**
 * check if I'm presenter, return a callback function
 */
OpenPath.User.prototype.checkIfPresenter = function( done ){
	var self = this;
	//create modal instance
	var presenterMondal = new OpenPath.Model();
	presenterMondal.url = '/presenter/'+this.obj.room_id+'/'+this.obj.email;
	//get data
	presenterMondal.get();
	presenterMondal.got = function( isPresenter ){
		self.isPresenter = isPresenter;
		done(isPresenter);
	};
};
/**
 * update peer_id
 */
OpenPath.User.prototype.updatePeerId = function(id){
	this.obj.peer_id = id;
};
/**
 * update location
 */
OpenPath.User.prototype.updateLocation = function(obj){
 	this.obj.location = obj.location;
 	//re-render video
	this.video.render();
};
/**
 * update stream 
 */
OpenPath.User.prototype.updateStream = function(stream){
	this.obj.stream = stream;
 	//re-render video
	this.video.render();		
};
