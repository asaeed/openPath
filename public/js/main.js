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
		
		//init ui 
		this.Ui.init();

		//hanlder routes
		this.Router.init();
		this.Router.checkRoute();
		

		/**
		 * init videos
		 */
		this.userVideo = null; //your video :)
		this.peers = []; //set peers array (other's videos)
		this.presenter =  new OpenPath.Video();
		this.presenter.init( document.getElementById('presenter') );
		this.peersList = document.getElementById('peersList');

		//create top spot for either you or other peer
		var li = document.createElement('li');
		this.topSpot = new OpenPath.Video();
		this.topSpot.init( li );
		this.peersList.appendChild(li);


		/**
		 * connect to peer, socket, get usermedia, get location
		 * communicate with socket
		 */
		this.connect();

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

		/**
		 * check if this.user is presenter
		 */
		self.checkIfPresenter( self.user , function( isPresenter ){
			if(isPresenter){
				console.log('I\'m presenter');
				//set userVideo to presenter
				self.userVideo = self.presenter;

				//¿ remove topSpot ?
			}else{
				console.log('I\'m not presenter');
				//set user video to topSpot
				self.userVideo = self.topSpot;
			}

			//render user video
			self.userVideo.render( 'peer_id', self.user );
		});



		/**
		 * socket sending 
		 */

		/**
		 * socket connect
		 */
		socket.on('connect', function() {
			console.log("connected to socket");
			socket.emit('adduser',  self.user );
		});

		/**
		 * Get an ID from the PeerJS server		
		 */
		peer.on('open', function(id) {
			self.user.peer_id = id;

			
			
			//send peer id
			socket.emit("peer_id", self.user );
			console.log('sending my ('+self.user.email+') peer_id',self.user.peer_id);

			getUserMedia();
			getUserLocation();
		});

		/**
		 * getUserMedia
		 */
		function getUserMedia(){
			
			window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if(navigator.getUserMedia) {
				navigator.getUserMedia( {video: true, audio: true}, function(stream) {

					console.log('sending my stream')
					//set user stream
					self.user.stream = stream;

					//send stream
			  		socket.emit("stream", self.user);

			  		//re-render user video
					self.userVideo.render( 'stream', self.user );

				},
				function(err) {
					console.log('Failed to get local stream' ,err);
				});
			}	
		}
	 

		/**
		 * get user location
		 */
		function getUserLocation(){
			function setLocation(position){
				self.user.location.coords.latitude = position.coords.latitude;
				self.user.location.coords.longitude  = position.coords.longitude;

				console.log("got location - Latitude: " + position.coords.latitude + 
							" Longitude: " + position.coords.longitude );

				//send location
			 	socket.emit("location", self.user );
			 	console.log('sending my location');

			 	//re-render user video
				self.userVideo.render( 'location', self.user );
			 	
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
		}



		/**
		 * socket receiving
		 */
		socket.on('updateconnection', function (username, data, users) {
			console.log(username + ': ' + data + '',users);
			for(var i=0;i<users.length;i++){

				console.log('users',i,users[i].email)		
			}
		});

		/**
		 * receive peer_ids of others THEN CALL them
		 */
		socket.on('peer_id', function (aPeer) {
			console.log("Got a new peer: " , aPeer.email);

			
			//if me
			if(aPeer.email == self.user.email){
				console.log('it\'s me!!')
				return;
			} 
			/**
			 * check if aPeer is in same room 
			 * not in same room, no call //TODO: figure out socket way on backend
			 */
			if(aPeer.room_id != self.user.room_id)  return;
			console.log("peer in my room" , aPeer.room_id, aPeer.peer_id);

			/**
			 * check if we already have your peer
			 */
			if( self.findPeer( aPeer ) ) return;

			/**
			 * check if aPeer is presenter, then call them
			 */
			self.checkIfPresenter( aPeer , function( isPresenter ){

				if(isPresenter){
					//set peer to presenter
					//render presenter
					if( self.findPeer( aPeer ) ) return;

					console.log('aPeer is presenter, adding peer');
					
					self.presenter.render( 'peer_id', aPeer );
					//add presenter to peers array
					self.peers.push( self.presenter );
					

				}else{
					if( self.findPeer( aPeer ) ) return;

					console.log('aPeer is not presenter, adding peer');

					//create a peer
					var li = document.createElement('li');
					var peerVideo = new OpenPath.Video();
					peerVideo.init(li);
					peerVideo.render( 'peer_id', aPeer );
					//add to array
					self.peers.push( peer );	
					//append to list
					self.peersList.appendChild(li);
				}

				//call them
				callPeer( aPeer );
			});			
		});

		/**
		 * callPeer
		 */
		function callPeer( aPeer ){
			var call = null;

			if(self.user.stream){
				// Call them with our stream, my_stream
				console.log("Calling peer: " , aPeer.peer_id);	

				//now that we have your peer_id, we're calling you with our stream
				call = peer.call( aPeer.peer_id, self.user.stream );


				// After they answer, we'll get a 'stream' event with their stream	
				call.on('stream', function(remoteStream) {
					console.log("Got remote stream", remoteStream, aPeer.stream);

					var peervid = self.findPeer( aPeer );
					if( peervid ){
						peervid.render( 'stream', aPeer );
					}

				});

			}else{
				console.log('no call, call='+call+ ' you need to allow vid to make a call');

				
				//TODO:hide not yet created modal about clicking allow
			}
		}

		/**
		 * INCOMING CALL
		 * bind call event, called in socket on peer id
		 */
		peer.on('call', function( incoming_call ) {
			console.log("Got a call!",incoming_call);

			if(self.user.stream){
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
			}

		});

		/**
		 * receive location of others
		 */
		socket.on('location', function (aPeer) {
			/**
			 * check if aPeer is in same room 
			 */
			if(aPeer.room_id != self.user.room_id)  return;

			console.log('got a new location', aPeer.email, 'peer', self.findPeer( aPeer ));
			
		});

		/**
		 * receive stream of others
		 */
		socket.on('stream', function (aPeer) {
			/**
			 * check if aPeer is in same room 
			 */
			if(aPeer.room_id != self.user.room_id)  return;

			console.log('got a new stream',aPeer.email,'peer', self.findPeer( aPeer ));
			
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
			done(data);
		};
	},
	findPeer : function( aPeer ){
		console.log('find a peer',this.peers.length);
		var self = this;
		//if me
		if(aPeer.email == this.user.email){
			console.log('it\'s me!!')
			return;
		} 
		//if no peers
		if(this.peers.length !== 0){
			//find peer in list of peers videos
			for(var i=0;i<this.peers.length;i++){
				if(this.peers[i].peer_id == aPeer.peer_id){
					//matched a peer
					return this.peers[i];
				}else{
					//no match
					return false;
				}
			}
		}else{
			//we don't have any peers
			return false;
		}
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