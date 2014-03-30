'use strict';

var OpenPath = window.OpenPath || {};

//shims for peer
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

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
		this.socketConnection = 'http://localhost:8080'; //'http://openpath.me/'; //


		this.peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
		this.socket = io.connect(this.socketConnection);

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
				self.chatmsg.classList.remove('blink');
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
		//array of users in room - get all connected users in my room
		this.users_in_room = [];
		//array of peers videos
		this.peers = [];

		/**
		 * check if this.user is presenter
		 */
		this.checkIfPresenter( this.user , function( isPresenter ){
			if(isPresenter){
				console.log('I\'m presenter');
				//set userVideo to presenter
				self.userVideo = self.presenter;

				//remove topSpot
				self.peersList.innerHTML = '';
				self.topSpot = null;

			}else{
				console.log('I\'m not presenter');
				//set user video to topSpot
				self.userVideo = self.topSpot;
			}
			/**
			 * connect to peer, socket, get usermedia, get location
			 * communicate with socket
			 */
			self.getMyMedia();
			self.getMyLocation();
			self.connect();
		});
	},
	/**
	 * getMyMedia
	 */
	getMyMedia : function(){
		var self = this;

		if(navigator.getUserMedia) {
			navigator.getUserMedia( {video: true, audio: true}, function(stream) {

				//console.log('got my stream')
				//set user stream
				self.user.stream =  window.URL.createObjectURL(stream) || stream;

				//send stream
		  		self.socket.emit("stream", self.user);

		  		//render user video
				self.userVideo.render( self.user );

			},
			function(err) {
				console.log('Failed to get local stream' ,err);
			});
		}
	},
	/**
	 * getMyLocation
	 */
	getMyLocation : function(){
		var self = this;

		function setLocation(position){
			self.user.location.coords.latitude = position.coords.latitude;
			self.user.location.coords.longitude  = position.coords.longitude;

			//console.log("got my location - Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude );

			//send location
		 	self.socket.emit("location", self.user );

		 	//re-render user video
			self.userVideo.render( self.user );
		 	
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
	},
	connect : function(){
		var self = this;
		/**
		 * socket connect
		 */
		self.socket.on('connect', function() {
			console.log("connected to socket");
			self.socket.emit('adduser',  self.user );
			// When we connect, if we have a peer_id, send it out	
			if (self.user.peer_id != null) {
				console.log("peer id is not null, sending it");
				self.socket.emit("peer_id",self.user);
			}
		});

		/**
		 * peer open
		 * get id from PeerJS server and send it to socket
		 */
		self.peer.on('open', function(id) {
			console.log('got my peerID,sending it', id);
			//update this.user
			self.user.peer_id = id;
			self.socket.emit("peer_id", self.user);
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
					self.socket.emit('sendchat', self.user, message);
				}
			}
		}, false);


		/**
		 * socket receiving
		 */

		/**
		 * update chat 
		 */
		//todo : save room chats on server, send up on first connection
		self.socket.on('updatechat', function (user, data, users) {
			var from = user === 'SERVER' ? user : user.email;
			console.log(from+ ': ' + data + '',users);

			//set this.users_in_room to the same as backend array of connected users
			for(var i=0;i<users.length;i++){
				//if not me && in same room
				if(users[i].email !== self.user.email && users[i].room_id === self.user.room_id ){
					self.users_in_room.push(users[i]);	
				} 
			}
			console.log(self.users_in_room)
			//format data string
			data = data.replace(/</g, '&lt;');

			//set color of user
			var className;
			if(from === 'SERVER'){
				className = 'server';
			}else if(from === self.user.email){
				className = 'me';
				from = user.name ? user.name: user.email;
			}else{
				className = 'other';
				from = user.name ? user.name: user.email;
			}

			//if chat closed show 'new message' blink
			if( !self.chat.classList.contains('open') && from !== 'SERVER' ){ 
				self.chatmsg.innerHTML = 'New Message from ' + from;
				self.chatmsg.classList.add('blink');	
			}

			var msg = '<li class="'+className+'"><span>'+ from +'</span>: ' + data + '</li>';
			self.chatmessages.innerHTML += msg;
			self.chatwindow.scrollTop = chatwindow.scrollHeight;
		});

		/**
		 * receive peer_ids of others
		 */
		self.socket.on('peer_id', function (aPeer) {
			self.receivedPeerData( aPeer );
		});
		/**
		 * INCOMING CALL
		 */
		self.peer.on('call', function( incoming_call ) {
			console.log('INCOMING CaLL',incoming_call);
			//since incoming_call only reference to user is peer id, make peer shell
			//which we'll match below
			var aPeerShell = {
				email : null,
				peer_id : incoming_call.peer
			};
			self.receivedPeerData( aPeerShell );
		});
		/**
		 * receive location of others
		 */
		self.socket.on('location', function (aPeer) {
			self.receivedPeerData( aPeer );
		});
		/**
		 * receive stream of others
		 */
		self.socket.on('stream', function (aPeer) {
			self.receivedPeerData( aPeer );
		});
	},
	receivedPeerData : function( aPeer ){
		//if me
		if(aPeer.email == this.user.email) return;

		//check if aPeer is in same room 
		if(aPeer.room_id !== this.user.room_id)  return;

		console.log('receivedPeerData', aPeer );

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
	}
};

//try 	document.addEventListener("DOMContentLoaded", function() {
window.onload = function(){
	OpenPath.init();
};