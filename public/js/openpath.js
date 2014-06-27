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
		
		//configs
		this.peerKey = 'w8hlftc242jzto6r';
		this.socketConnection = 'http://openpath.me/';
		// 'http://10.0.1.9:8080'; 
		// 'http://localhost:8080'; 
		// 'http://10.0.1.15:8080';
		// 'http://openpath.me/';  


		//init ui 
		this.Ui.init();

		/**
		 * user obj to send to others - you :)
		 * handles allow modal
		 */
		this.user = new OpenPath.User( document.getElementById('email').value );
		


		//handle events
		this.eventsController = new OpenPath.Controller();
		this.eventsController.url = '/events';
		this.eventsController.data = null;

		//hanlder routes
		this.Router.init();
		this.Router.checkRoute();

		
		/**
		 * dom elemets
		 */
		this.presenterElement = document.getElementById('presenter');
		this.peersList = document.getElementById('peersList');
		this.chat = document.getElementById("chat");
		this.chatInput = document.getElementById("chatinput");
		this.chatmsg = document.getElementById("chatmsg");
		this.chatwindow = document.getElementById("chatwindow");
		this.chatmessages = document.getElementById("chatmessages");
		this.chatheader = chat.getElementsByTagName("header")[0];
		this.chatToggler = document.getElementById("chatToggler");

		
		
	},
	/**
	 * once allowed video
	 */
	onMyStreamAllowed : function(){
		var self = this;
		console.log('onMyStreamAllowed');

		/**
		 * connect to peer, socket
		 * communicate with socket
		 */
		this.events();
		this.start();
	},
	events : function(){
		var self = this;
		/*chat toggle event*/
		this.chatheader.addEventListener('click',function(){
			if(self.chat.classList.contains('open')){
				self.chat.classList.remove('open');
			}else{
				self.chatmsg.classList.remove('blink');
				self.chat.classList.add('open');
				self.chatmsg.innerHTML = 'Chat';
			}
		});
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
	start : function(){
		var self = this;
		//array of users in room - get all connected users in my room - excluding me
		this.others_in_room = [];
		//array of other user instances, in room of course
		this.peers = [];

		this.connect();
	},
	connect : function(){
		var self = this;


		//peer & socket
		this.call = null;
		this.peer = new Peer({key: this.peerKey }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
		this.socket = io.connect(this.socketConnection);
		this.peer_connection = null;




		/**
		 * socket connect
		 */
		this.socket.on('connect', function() {
			console.log("connected to socket");
			self.socket.emit('adduser',  self.user.obj );
		});

		/**
		 * peer open
		 * get id from PeerJS server and send it to socket
		 */
		this.peer.on('open', function(id) {
			console.log('got my peerID, sending it', id);
			//update this.user
			self.user.updatePeerId(id);
			//send id so if anyone is in room, they'll give you a call 
			//after their socket recieves your peer id (below)
			self.socket.emit("peer_id", self.user.obj);
		});

		/**
		 * INCOMING CALL
		 */
		this.peer.on('call', function( incoming_call ) {
			console.log('INCOMING CaLL',incoming_call);
			//WHAT TODO WITH INCOMING CALL USER....
			incoming_call.answer(self.user.obj.stream); // Answer the call with our stream from getUserMedia
			incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
				console.log('got other\'s stream');
				self.createPeer(incoming_call, remoteStream);
			});
		});

		this.peer.on('connection', function(incoming_connection) {
			console.log('INCOMING Connection',incoming_connection);
			//they have no stream so call them only if you do
			//if(self.user.obj.stream){
				//self.callPeer(aPeer);
			//}
		});

		/**
		 * socket receiving
		 */

		/**
		 * update chat 
		 */
		//todo : save room chats on server, send up on first connection
		this.socket.on('updatechat', function (user, data) {
			console.log('received updatechat',user+ ': ' + data );

			//update chat
			self.updateChat( user, data );
		});
		/**
		 * receive connected of others (not yourself on this one)
		 */
		this.socket.on('connected', function (aPeer, connected_users) {
			console.log('someone connected',aPeer.email);
			self.findOthersInRoom(connected_users);
		});
		/**
		 * receive peer_ids of others
		 * open peer connection a.k.a. you make the call 
		 */
		this.socket.on('peer_id', function ( aPeer ) {
			console.log('received peer_id, calling', aPeer.email );
			//make the call here
			self.callPeer(aPeer);
		});
		/**
		 * receive location of others
		 */
		this.socket.on('location', function ( aPeer ) {
			console.log('received location', aPeer.email )
		});
		/**
		 * receive stream of others
		 */
		this.socket.on('stream', function ( aPeer ) {
			console.log('received stream', aPeer.email );

			//make the call again
			//self.callPeer(aPeer);
		});
		/**
		 * switch room
		 */
		this.socket.on('switchedRoom', function ( aPeer,connected_users ) {
			console.log('received switchedRoom', aPeer.email, aPeer,self.user.obj.room_id );
			self.findOthersInRoom(connected_users);//removes them from others in room (i think TODO)
			self.removePeer(aPeer);
		});
		
		/**
		 * receive disconnect
		 * find user instance and destroy it!!
		 */
		this.socket.on('disconnect', function ( aPeer, connected_users ) {
			console.log('received disconnect', aPeer, connected_users ,self.peers);
			self.findOthersInRoom(connected_users);
			self.removePeer(aPeer);
		});
	},
	/**
	 * CALL
	 * make the call
	 */
	callPeer : function(aPeer){		
		var self = this;

		if(this.user.obj.stream){
			this.call = this.peer.call( aPeer.peer_id, this.user.obj.stream );
			console.log('call',this.call)
			// After they answer, we'll get a 'stream' event with their stream	
			if(this.call)
			this.call.on('stream', function(remoteStream) {
				console.log("Got remote stream", remoteStream, aPeer.stream);
				self.createPeer(aPeer, remoteStream);
			});
		}else{
			//since you have no stream, send connection
			this.peer_connection = this.peer.connect( aPeer.peer_id );
		}
	},
	updateChat : function( user, msg ){
		var from = user === 'SERVER' ? user : user.email;

		//format msg string
		msg = msg.replace(/</g, '&lt;');

		//set color of user
		var className;
		if(from === 'SERVER'){
			className = 'server';
			from = 'OpenPath'
		}else if(from === this.user.obj.email){
			className = 'me';
			from = user.name ? user.name: user.email;
		}else{
			className = 'other';
			from = user.name ? user.name: user.email;
		}

		//if chat closed show 'new message' blink
		//TODO if you want to hide server messages add ' && from !== 'SERVER' ' to if statement
		if( !this.chat.classList.contains('open') ){ //&& from !== 'SERVER
			this.chatmsg.innerHTML = 'New Message from ' + from;
			this.chatmsg.classList.add('blink');	
		}

		var message = '<li class="'+className+'"><span>'+ from +'</span>: ' + msg + '</li>';
		this.chatmessages.innerHTML += message;
		this.chatwindow.scrollTop = this.chatwindow.scrollHeight;
	},
	findOthersInRoom : function( connected_users ){
		var others = [];
		for(var i=0;i<connected_users.length;i++){

			//if not me && in same room
			var notMe = connected_users[i].email !== this.user.obj.email;
			var sameRoom = connected_users[i].room_id === this.user.obj.room_id;

			if( notMe && sameRoom ){
				console.log('other users in room', connected_users[i].email )
				others.push( connected_users[i] );
			}
		}
		//set this.others_in_room
		this.others_in_room = others;
		console.log('others_in_room',this.others_in_room);
	},
	createPeer : function( peer , stream ){
		var peer_id = peer.peer_id ? peer.peer_id : peer.peer; //second is incoming call
		//find others first
		console.log('create peer',peer_id,this.others_in_room,this.others_in_room.length);
		if(this.others_in_room.length>0){
			for(var i=0;i<this.others_in_room.length;i++){
				if(this.others_in_room[i].peer_id === peer_id){
					this.others_in_room[i].stream = stream;
					//add to peers array
					console.log('push peer',i)
					this.peers.push( new OpenPath.Peer( this.others_in_room[i]) );
				}else{
					console.log('new peer'+'no match')
					//add new peer with this obj
					peer.stream = stream;
					//add to peers array
					this.peers.push( new OpenPath.Peer( peer ));
				}
			}
		}else{
			console.log('new peer'+'others length 0',peer);
			//add new peer with this obj
			peer.stream = stream;
			//add to peers array
			this.peers.push( new OpenPath.Peer( peer ));
		}
	},
	joinEvent : function( event_id ){
		//create view instance
		var newEvent = new OpenPath.Model();
		newEvent.url = '/events/'+event_id;
		//get data
		newEvent.get();

		newEvent.got = function(data){
			//console.log('newEvent got', data );
			OpenPath.Ui.updateHeader({event:data});
		};
	},
	switchRoom : function( data ){
		var self=this;
		console.log('switchRoom',data.room._id);

		//clear divs
		this.presenterElement.innerHTML = '';
		this.peersList.innerHTML = '';

		//update user
		this.user.obj.room_id = data.room._id;
		this.user.obj.event_id = data.event._id

		//tell socket
		this.socket.emit("switchRoom", this.user.obj);

		//update header
		OpenPath.Ui.updateHeader(data);

		this.user.checkIfPresenter(function( isPresenter ){
			self.user.video.unRendered = true;
			self.user.video.render();
		})
		//send id so if anyone is in room, they'll give you a call 
		//after their socket recieves your peer id (below)
		this.socket.emit("peer_id", this.user.obj);
	},
	removePeer : function(peer){
		console.log('remove peer',peer);
		//remove from dom
		var peer_in_dom = document.getElementById(peer.peer_id);
		console.log('peer_in_dom',peer_in_dom,peer_in_dom.parentNode.parentNode)
		if(peer_in_dom.parentNode.parentNode.getAttribute('id') === 'presenter'){
			console.log('empty presenter');
			this.presenterElement.innerHTML = '';
		}else{
			console.log('ul.peersList remove li');
			peer_in_dom.parentNode.parentNode.parentNode.removeChild(peer_in_dom.parentNode.parentNode);
		}

		var peer_index;
		//remove from peers
		for(var i=0;i<this.peers.length;i++){
			console.log('peers',this.peers[i]);
			if(this.peers[i].obj.peer_id === peer.peer_id){
				peer_index = this.peers[i];
			}
		}
		//remove from array
		this.peers.splice(peer_index,1);
		console.log('peers',this.peers)
	}
};

//try 	
//document.addEventListener("DOMContentLoaded", function() {
window.onload = function(){
	OpenPath.init();
};