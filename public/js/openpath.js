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
		this.socketConnection = 'http://localhost:8080';//'http://10.0.1.15:8080'// //'http://openpath.me/'; //

		//peer & socket
		this.peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
		this.socket = io.connect(this.socketConnection);
		this.peer_connection = null;


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
		 * user obj to send to others - you :)
		 */
		this.user = new OpenPath.User({
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
		});

		//array of users in room - get all connected users in my room - excluding me
		this.other_users_in_room = [];

		/**
		 * check if this.user is presenter
		 */
		this.user.checkIfPresenter(function( isPresenter ){
			if(isPresenter){
				console.log('I\'m presenter');
				//set userVideo to presenter
				self.presenterElement.appendChild(self.user.video.element);
			}else{
				console.log('I\'m not presenter');
				//set user video to topSpot
			}

			self.user.connect();
		});

		/**
		 * connect to peer, socket
		 * communicate with socket
		 */
		this.events();
		this.connect();
	},
	events : function(){
		var self = this;

		/**
		 * chat input
		 * socket sending chat
		 */
		this.chatInput.addEventListener('keydown', function(event) {
			if(self.chatInput.value != ''){
				var key = event.which || event.keyCode;
				if (key === 13) {
					var message = self.chatInput.value;
					self.chatInput.value = '';
					console.log('send chat msg',self.chatInput.value)
					self.socket.emit('sendchat', self.user.obj, message);
				}
			}
		}, false);
		 
	},
	connect : function(){
		var self = this;
		/**
		 * socket connect
		 */
		this.socket.on('connect', function() {
			console.log("connected to socket");
			self.socket.emit('adduser',  self.user.obj );

			// When we connect, if we have a peer_id, send it out	
			if (self.user.obj.peer_id != null) {
				console.log("peer id is not null, sending it");
				self.socket.emit("peer_id",self.user.obj);
			}

		});

		/**
		 * peer open
		 * get id from PeerJS server and send it to socket
		 
		this.peer.on('open', function(id) {
			console.log('got my peerID,sending it', id);
			//update this.user
			self.user.obj.peer_id = id;
			self.socket.emit("peer_id", self.user.obj);
		});
		*/


		/**
		 * socket receiving
		 */

		/**
		 * update chat 
		 */
		//todo : save room chats on server, send up on first connection
		this.socket.on('updatechat', function (user, data, connected_users) {
			console.log('received updatechat',user+ ': ' + data, connected_users );

			self.findUsersInRoom( connected_users );
			
			//update chat
			self.updateChat( user, data );
		});

		/**
		 * Incoming PEER Connection
		 
		this.peer.on('connection', function(connection) {

			console.log('peer connection', connection)

		});
		*/

		/**
		 * INCOMING CALL
		
		this.peer.on('call', function( incoming_call ) {
			console.log('INCOMING CaLL',incoming_call);
			//since incoming_call only reference to user is peer id, make peer shell
			//which we'll match below
			var aPeerShell = {
				email : null,
				peer_id : incoming_call.peer
			};
			console.log('peer shell', self.findAndUpdateUser( aPeerShell ) ,self.users_in_room);

			if( self.findAndUpdateUser( aPeerShell ) ) alert('have u');

			//WHAT TODO WITH INCOMING CALL USER....
			incoming_call.answer(self.user.stream); // Answer the call with our stream from getUserMedia
			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				// And attach it to a video object

				aPeerShell.stream = remoteStream;
				self.users_in_room.push( aPeerShell );
				self.addVideo( aPeerShell );

				self.socket.emit("answered_call",self.user);
			});

		});
		 */





		/**
		 * receive connected of others (not yourself on this on)
		 */
		this.socket.on('connected', function (aPeer, connected_users) {
			console.log('received connected', aPeer.email, connected_users )
			self.findUsersInRoom( connected_users );
		});
		/**
		 * receive peer_ids of others
		 */
		this.socket.on('peer_id', function (aPeer, connected_users) {
			console.log('received peer_id', aPeer.email )
			//self.updateUsersInRoom( users );
			//self.receivedPeerData( aPeer );
			/*
			self.peer_connection = self.peer.connect( aPeer.peer_id );
			self.peer_connection.on('open', function() {
				// Receive messages
				self.peer_connection.on('data', function(data) {
					console.log('Received', data);
				});

				// Send messages
				self.peer_connection.send('Hello! from',self.user.email);
			});
			*/
		});
		/**
		 * receive location of others
		 */
		this.socket.on('location', function (aPeer, connected_users) {
			console.log('received location', aPeer.email )
			//self.updateUsersInRoom( users );
			//self.receivedPeerData( aPeer);
		});
		/**
		 * receive stream of others
		 */
		this.socket.on('stream', function (aPeer, connected_users ) {
			console.log('received stream', aPeer.email )
			self.findUsersInRoom( connected_users );
			//self.receivedPeerData( aPeer );
		});
		/**
		 * receive disconnect
		 */
		this.socket.on('disconnect', function (aPeer, connected_users ) {
			console.log('received disconnect', aPeer.email );
		});
	},
	updateChat : function( user, msg ){
		var from = user === 'SERVER' ? user : user.email;

		//format msg string
		msg = msg.replace(/</g, '&lt;');

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
		if( !this.chat.classList.contains('open') && from !== 'SERVER' ){ 
			this.chatmsg.innerHTML = 'New Message from ' + from;
			this.chatmsg.classList.add('blink');	
		}

		var message = '<li class="'+className+'"><span>'+ from +'</span>: ' + msg + '</li>';
		this.chatmessages.innerHTML += message;
		this.chatwindow.scrollTop = this.chatwindow.scrollHeight;
	},
	findUsersInRoom : function( connected_users ){
		var others = [];
		for(var i=0;i<connected_users.length;i++){

			//if not me && in same room
			var notMe = connected_users[i].email !== this.user.obj.email;
			var sameRoom = connected_users[i].room_id === this.user.obj.room_id;

			if( notMe && sameRoom ){
				console.log('other users in room', connected_users[i].email,connected_users[i].stream)
				others.push( connected_users[i] );
			}
		}
		//set this.other_users_in_room
		this.other_users_in_room = others;

		console.log(this.other_users_in_room)
	}
	//TODO : on disconnecet, remove / destroy peer
};

//try 	
//document.addEventListener("DOMContentLoaded", function() {
window.onload = function(){
	OpenPath.init();
};