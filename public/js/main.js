'use strict';

var OpenPath = window.OpenPath || {};

/**
 * OpenPath
 * @author jamiegilmartin@gmail.com
 */
OpenPath = {
	init : function(){
		console.log('OpenPath init');

		//configs
		this.peerKey = 'w8hlftc242jzto6r';
		this.socketConnection = 'http://localhost';

		//you :)
		this.user = {};
		
		//set peers array (other's videos)
		this.peers = [];

		//video holder elements
		this.presenter = document.getElementById('presenter');
		this.peersList = document.getElementById('peersList');

		//init ui 
		this.Ui.init();

		//hanlder routes
		this.Router.init();
		this.Router.checkRoute();
		

		//connect to peer, socket
		this.connect();

		//get usermedia, get location
		//this.getUserMedia();
		//this.getUserLocation();


		//stubs
		//this.setPresenter();
		for(var i=4;i>0;i--){
			//this.setPeer();
		}
	},
	connect : function(){
		var self = this,
			peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
			socket = io.connect(this.socketConnection);
		/**
		 * user obj to send to others
		 */
		this.user = {
			name :  document.getElementById('userName').value,
			email :  document.getElementById('email').value,
			room_id : document.getElementById('roomId').value,
			event_id : document.getElementById('eventId').value,
			peer_id : null,
			stream :  null,
			location : {
				coords: {
					latitude : null,
					longitude : null
				}
			}
		};


		self.checkIfPresenter( self.user , function( isPresenter ){
			if(isPresenter){
				console.log('am presenter')
			}else{
				console.log('am not presenter')
			}
		});





		/**
		 * socket connect
		 */
		socket.on('connect', function() {
			console.log("connected to socket");
			//socket.emit("connected", self.user );
		});

		/**
		 * socket sending 
		 */

		/**
		 * Get an ID from the PeerJS server		
		 */
		peer.on('open', function(id) {
		  self.user.peer_id = id;

		  //send peer id
		  socket.emit("peer_id", self.user );
		  console.log('sending peer_id',self.user);

		});

		/**
		 * bind call event, called in socket on peer id
		 */
		peer.on('call', function( incoming_call ) {
			console.log("Got a call!");

			if(self.user.stream)
			incoming_call.answer(self.user.stream); // Answer the call with our stream from getUserMedia
			//TODO else - you're in view only mode modal

			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller

				//check if presenter

				// And attach it to a video object
				//var ovideoElement = document.getElementById('othervideo');
				//ovideoElement.src = window.URL.createObjectURL(remoteStream) || remoteStream;
				//ovideoElement.play();

				//TODO
				//add new video instances to list
				//mute or unmute depending on room


			});
		});

		/**
		 * getUserMedia
		 */
		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if(navigator.getUserMedia) {
			navigator.getUserMedia( {video: true, audio: true}, function(stream) {

				console.log('sending stream', stream)
				//set user stream
				self.user.stream = stream;

				//send stream
		  		socket.emit("stream", self.user);

		  		/**
		  		 * now that we have your video
		  		 */
		  		
				/*
				var videoElement = document.getElementById('myvideo');
				videoElement.src = window.URL.createObjectURL(stream) || stream;
				videoElement.play();
				*/

				//TODO
				//new video
				//if presenter of event
				//if room creator -> start on main -> on other join go to small
				//mute if not
				
				//hide not yet created modal about clicking allow

			},
			function(err) {
				console.log('Failed to get local stream' ,err);
			});
		}		 

		/**
		 * get user location
		 */
		function setLocation(position){
			self.user.location.coords.latitude = position.coords.latitude;
			self.user.location.coords.longitude  = position.coords.longitude;

			console.log("Latitude: " + position.coords.latitude + 
						" Longitude: " + position.coords.longitude );

			//TODO: maps etc
			//save to db

			//send location
		 	socket.emit("location", self.user );
		 	console.log('sending location',self.user);

		 	//self.renderMyMap();
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


		/**
		 * socket receiving
		 */


		//Receive other folks peer_ids
		socket.on('peer_id', function (data) {
			console.log("Got a new peer: " + data);

			/*
			// Call them with our stream, my_stream
			console.log("Calling peer: " + data);		

			if(self.user.stream)				
			var call = self.peer.call(data, self.user.stream);
			console.log(call, peer)
			//if allowed ... else call undefined

			// After they answer, we'll get a 'stream' event with their stream	
			call.on('stream', function(remoteStream) {
				console.log("Got remote stream");
				document.getElementById('othervideo').src = window.URL.createObjectURL(remoteStream) || remoteStream;
			});
			*/

		});		

		socket.on('location', function (data) {
			console.log('got a new location',data);
		});

		socket.on('stream', function (data) {
			console.log('got a new stream',data);
		});
		


		/*
		socket.on('userConnected', function (data) {
			console.log('userConnected',data); //seems to return a list of all users ever connected
		});
		
		socket.on('userDisconnected', function (data) {
			console.log('userDisconnected',data.self.user.email);
		});
		*/


	},
	checkIfPresenter : function( presenter, done ){

		//create modal instance
		var presenterMondal = new OpenPath.Model();
		presenterMondal.url = '/presenter/'+this.user.room_id+'/'+presenter.email;
		//get data
		presenterMondal.get();
		presenterMondal.got = function(data){
			console.log('eventsModal got',data)
			done(data);
		};


	},
	setPresenter : function(){

		new OpenPath.Video( this.presenter );

	},
	setPeer : function(){
		var li = document.createElement('li');

		new OpenPath.Video( li );

		this.peersList.appendChild(li);
	},
	renderMyMap : function(){
		console.log('render my map')
	}
};

//try 	document.addEventListener("DOMContentLoaded", function() {
window.onload = function(){

	/*

	//count to check for reload testing - delete
	var c = 0;
	function count(){
		c++;
		console.log(c);
		setTimeout(function(){
			count();
		},1000)
	}
	count();

	*/

	OpenPath.init();
};