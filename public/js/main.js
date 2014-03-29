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
		this.socketConnection = 'http://localhost:8080'; //'http://openpath.me/'; //

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
			self.connect();
		});



	},
	connect : function(){
		var self = this,
			peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
			socket = io.connect(this.socketConnection);

		/**
		 * getMyMedia
		 */
		function getMyMedia(){
			window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
			navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
			if(navigator.getUserMedia) {
				navigator.getUserMedia( {video: true, audio: true}, function(stream) {

					console.log('got my stream')
					//set user stream
					self.user.stream = stream;

					//send stream
			  		socket.emit("stream", self.user);

			  		//render user video
					self.userVideo.render( 'stream', self.user );

				},
				function(err) {
					console.log('Failed to get local stream' ,err);
				});
			}
		}
		getMyMedia();
		/**
		 * getMyLocation
		 */
		function getMyLocation(){
			function setLocation(position){
				self.user.location.coords.latitude = position.coords.latitude;
				self.user.location.coords.longitude  = position.coords.longitude;

				console.log("got my location - Latitude: " + position.coords.latitude + 
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
		getMyLocation();

		/**
		 * socket connect
		 */
		socket.on('connect', function() {
			console.log("connected to socket");
			socket.emit('adduser',  self.user );

			// When we connect, if we have a peer_id, send it out	
			if (self.user.peer_id != null) {
				console.log("peer id is not null, sending it");
				socket.emit("peer_id",self.user);
			}
		});

		/**
		 * socket receiving updatechat
		 */
		socket.on('updatechat', function (user, data, users) {
			var from = user === 'SERVER' ? user : user.email;
			//console.log(from+ ': ' + data + '',users);

			for(var key in users){
				console.log('updatechat users',key,users[key].email)		
			}
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
			if( !self.chat.classList.contains('open') ){ //&& from != 'SERVER'
				self.chatmsg.innerHTML = 'New Message from ' + from;
				self.chatmsg.classList.add('blink');	
			}

			var msg = '<li class="'+className+'"><span>'+ from +'</span>: ' + data + '</li>';
			self.chatmessages.innerHTML += msg;
			self.chatwindow.scrollTop = chatwindow.scrollHeight;
		});

		/**
		 * Get an ID from the PeerJS server		
		 */
		peer.on('open', function(id) {
			self.user.peer_id = id;
			console.log('got my peerID,sending it', id);
			socket.emit("peer_id",self.user);
		});

		/**
		 * receive peer_ids of others THEN CALL them
		 */
		socket.on('peer_id', function (aPeer) {
			//if me
			if(aPeer.email == self.user.email) return;
			//console.log("Got a new peer: " , aPeer.email);

			/**
			 * check if aPeer is in same room 
			 * not in same room, no call //TODO: figure out socket way on backend
			 */
			if(aPeer.room_id != self.user.room_id)  return;

			/**
			 * check if we already have your peer
			 */
			if( self.findPeer( aPeer ) ) return;

			console.log("Got a new peer in my room" , aPeer.email, aPeer.peer_id);

			callPeer( aPeer );

		});
		/**
		 * callPeer
		 */
		function callPeer( aPeer ){
			var call = null;
			if(self.user.stream){
				// Call them with our stream, my_stream
				console.log("Calling peer: " , aPeer.peer_id );	

				//now that we have your peer_id, we're calling you with our stream
				call = peer.call( aPeer.peer_id, self.user.stream );

				if(call)
				// After they answer, we'll get a 'stream' event with their stream	
				call.on('stream', function(remoteStream) {
					console.log("Got remote stream", remoteStream, aPeer.stream);

					//var peervid = self.findPeer( aPeer );
					//if( peervid ){
					//	peervid.render('stream', aPeer );
					//}
					//TODO
					//document.getElementById('othervideo').src = window.URL.createObjectURL(remoteStream) || remoteStream;
				
					self.peers[0].render('stream', aPeer );
				});

				
			}else{
				//console.log('no call, call='+call+ ' you need to allow vid to make a call');
				//TODO:hide not yet created modal about clicking allow
			}
		}
		/**
		 * INCOMING CALL
		 * bind call event, called in socket on peer id
		 */
		peer.on('call', function( incoming_call ) {
			console.log('INCOMING CaLL',incoming_call)

			//grab peer id from incoming_call
			var peer = {
				peer_id : incoming_call.peer
			};

			//todo: find peer? OR ask server for peer info
			//if peer use him else new peer
			console.log('icoming peer?',self.findPeer( peer ))
			peer = self.findPeer( peer ) ? self.findPeer( peer ) : peer;

			incoming_call.answer(self.user.stream); // Answer the call with our an A/V stream from getMyMedia
			//TODO else - you're in view only mode modal
			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				console.log('call successful, remoteStream = ',remoteStream)

				peer.stream = remoteStream;
				//add a peer!
				self.addAPeer( peer );


			});
		});


		/**
		 * receive location of others
		 */
		socket.on('location', function (aPeer) {
			//if me
			if(aPeer.email == self.user.email) return;

			//check if aPeer is in same room 
			if(aPeer.room_id != self.user.room_id)  return;

			console.log('got a new location', aPeer.email, 'peer', self.findPeer( aPeer ));

			var peervid = self.findPeer( aPeer );
			if( peervid ){
				peervid.render('location', aPeer );
			}
		});

		/**
		 * receive stream of others
		 */
		socket.on('stream', function (aPeer) {
			//if me
			if(aPeer.email == self.user.email) return;

			//check if aPeer is in same room 
			if(aPeer.room_id != self.user.room_id)  return;

			console.log('got a new stream',aPeer.email,'peer', aPeer, self.findPeer( aPeer ));
			var peervid = self.findPeer( aPeer );
			if( peervid ){
				peervid.render('stream', aPeer );
			}
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
					socket.emit('sendchat', self.user, message);
				}
			}
		}, false);



	},
	addAPeer : function( peer ){
		//create a peer
		var li = document.createElement('li');
		var peerVideo = new OpenPath.Video();
		peerVideo.init(li);
		peerVideo.render( 'stream', peer );
		//add to array
		this.peers.push( peer );
		console.log('added peer',this.peers.length, this.peers)
		//append to list
		this.peersList.appendChild(li);

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
		if(aPeer.email == this.user.email) return false; 
		//if no peers
		if(this.peers.length !== 0){
			//find peer in list of peers videos
			for(var i=0;i<this.peers.length;i++){
				//search by email
				if(aPeer.email){
					if(this.peers[i].email == aPeer.email){
						//matched a peer
						return this.peers[i];
					}else{
						//no match
						return false;
					}
				}else if(aPeer.peer_id){
					//search by peer_id
					if(this.peers[i].peer_id == aPeer.peer_id){
						//matched a peer
						return this.peers[i];
					}else{
						//no match
						return false;
					}
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