'use strict';

var OpenPath = window.OpenPath || {};

/**
 * OpenPath
 * @author jamiegilmartin@gmail.com
 */
OpenPath = {
	init : function(){
		console.log('OpenPath init');
		var self = this;

		//configs
		this.peerKey = 'w8hlftc242jzto6r';
		this.socketConnection = 'http://localhost:3000'; //http://openpath.me/

		//init ui 
		this.Ui.init();

		//hanlder routes
		this.Router.init();
		this.Router.checkRoute();
		
		/**
		 * dom elemets
		 */
		this.presenterElement = document.getElementById('presenter')
		this.peersList = document.getElementById('peersList');
		this.chat = document.getElementById("chat");
		this.chatInput = document.getElementById("chatinput");
		this.chatmsg = document.getElementById("chatmsg");
		this.chatwindow = document.getElementById("chatwindow");
		this.chatmessages = document.getElementById("chatmessages");
		this.chatToggler = document.getElementById("chatToggler");

		/*chat toggle event*/
		this.chatToggler.addEventListener('click',function(){
			if(self.chat.classList.contains('open')){
				self.chat.classList.remove('open');
			}else{
				self.chat.classList.add('open');
				self.chatmsg.innerHTML = 'Chat';
			}
		});

		/**
		 * init 2 videos
		 */
		this.presenter =  new OpenPath.Video();
		this.presenter.init( this.presenterElement );

		//create top spot for either you or other peer
		var li = document.createElement('li');
		this.topSpot = new OpenPath.Video();
		this.topSpot.init( li );
		this.peersList.appendChild(li);


		/**
		 * user obj to send to others - you :)
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
		this.userVideo = null; //your video :)
		//array of other's videos
		this.peers = [];

		/**
		 * check if this.user is presenter
		 */
		this.checkIfPresenter( this.user , function( isPresenter ){
			if(isPresenter){
				console.log('I\'m presenter');
				//set userVideo to presenter
				self.userVideo = self.presenter;

				//¿ remove topSpot ?

				//add top spot to first peers
				self.peers.push(self.topSpot)
			}else{
				console.log('I\'m not presenter');
				//set user video to topSpot
				self.userVideo = self.topSpot;
			}

			//render user video
			//self.userVideo.render( 'peer_id', self.user );

			/**
			 * connect to peer, socket, get usermedia, get location
			 * communicate with socket
			 */
			self.connect();
		});



	},
	connect : function(){
		var self = this,
			peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
			socket = io.connect(this.socketConnection);

		/**
		 * getUserMedia
		 */
		function getUserMedia(){
			window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if(navigator.getUserMedia) {
				navigator.getUserMedia( {video: true, audio: true}, function(stream) {

					console.log('got my stream')
					//set user stream
					self.user.stream = stream;

					//send stream
			  		//socket.emit("stream", self.user);

			  		//render user video
					self.userVideo.render( 'stream', self.user );

				},
				function(err) {
					console.log('Failed to get local stream' ,err);
				});
			}
		}
		getUserMedia();
		/**
		 * get user location
		 */
		function getUserLocation(){
			function setLocation(position){
				self.user.location.coords.latitude = position.coords.latitude;
				self.user.location.coords.longitude  = position.coords.longitude;

				console.log("got my location - Latitude: " + position.coords.latitude + 
							" Longitude: " + position.coords.longitude );

				//send location
			 	//socket.emit("location", self.user );
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
		getUserLocation();

		/**
		 * Get an ID from the PeerJS server		
		 */
		peer.on('open', function(id) {
			self.user.peer_id = id;
			console.log('got my peerID', id);
			//send peer id
			//socket.emit("peer_id", self.user );
			//console.log('sending my ('+self.user.email+') peer_id',self.user.peer_id);
		});

		/**
		 * INCOMING CALL
		 * bind call event, called in socket on peer id
		 */
		peer.on('call', function( incoming_call ) {
			console.log("Got a call!", incoming_call);
				console.log("Got a call!");
			incoming_call.answer(my_stream); // Answer the call with our stream from getUserMedia
			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				// And attach it to a video object

				var peerShell = {
					peer_id:remoteStream.peer,
					stream:remoteStream
				}

				//render other vid
			  	self.peers[0].render('stream', peerShell );
			});
			/*
			if(self.user.stream){
				incoming_call.answer(self.user.stream); // Answer the call with our stream from getUserMedia
				//TODO else - you're in view only mode modal

				incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller

					console.log('remoteStream',remoteStream)
					
					var peer = self.findPeer( peerShell );

					//set stream
					if(peer){
						peer.stream = remoteStream;
						peer.render('stream',peer);
					}
					


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
			*/
		});


		/**
		 * socket connect
		 */
		socket.on('connect', function() {
			console.log("connected to socket");
			socket.emit('adduser',  self.user );
		});

		/**
		 * socket receiving
		 */
		socket.on('updatechat', function (username, data, users) {
			console.log(username + ': ' + data + '',users);
			for(key in users){
				console.log('users',key,users[key])		
			}
			data = data.replace(/</g, '&lt;');
			
			var msg = '<li class="user1"><span>'+ username +'</span>: ' + data + '</li>';
			self.chatmessages.innerHTML += msg;
			self.chatwindow.scrollTop = chatwindow.scrollHeight;
		});

		/**
		 * socket sending chat
		 */
		self.chatInput.addEventListener('keydown', function(event) {
			if(self.chatInput.value != ''){
				var key = event.which || event.keyCode;
				if (key === 13) {
					var message = self.chatInput.value;
					self.chatInput.value = '';
					console.log('send chat msg',self.chatInput.value)
					socket.emit('sendchat', message);
				}
			}
		}, false);




		socket.on('userDisconnected', function (data) {
			console.log('userDisconnected',data.self.user.email);
		});
		


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
		//if me check again
		if(aPeer.email == this.user.email) return; 
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
	OpenPath.init();
};