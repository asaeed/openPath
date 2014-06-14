var Event = require('../models/event');
var Room = require('../models/room');
var Utils = require('../utils/utils');

var connected_users = [];

/**
 * init socketHandler
 * @see http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
 */
module.exports.start = function( io ){
	var self = this;

	/**
	 * socket.io
	 */
	io.sockets.on('connection', function (socket) {
		console.log("We have a new socket client: " + socket.id);

		socket.on('adduser', function(user) {
			//TOdO if(socket.user)
			
			//save user & room to socket session
			socket.user = user;
			socket.room = user.room_id;

			//add user to global user list
			connected_users.push(user);

			//uniquify users
			//connected_users = Utils.uniqueArray(connected_users);

			console.log('added user', user.email );
			self.updateConnectedUsers(user);

			//join room
			socket.join(user.room_id);

			// echo to client they've connected
			Event.findOne({ _id: user.event_id }, function (err, item) {
				if (err) return console.error(err);
				if(item){
					//connect to event
					socket.emit('updatechat', 'SERVER', 'you have connected to event : '+item.name );
				}else{
					//connecting to just a room
					socket.emit('updatechat', 'SERVER', 'you have connected to room #'+user.room_id );
				}
			});
			

			var name = user.name ? user.name : user.email;
			// echo to room that a person has connected to their room
			socket.broadcast.to(user.room_id).emit('updatechat', 'SERVER', name + ' has connected to this room.' );
			//socket.broadcast.to(user.room_id).emit('connected', user, connected_users); //doesn't include you
			io.sockets.in( user.room_id ).emit('connected', user, connected_users ); //includes you
		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (user, msg) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.in( user.room_id ).emit('updatechat', socket.user, msg );
		});


		/**
		 * on peer_id
		 * @description : the start of the video program
		 */
		socket.on('peer_id', function( user ) {
			console.log('got peer_id of', user.email );
			//update connected users
			self.updateConnectedUsers(user);

			// we tell the client to execute 'peer_id' with 1 parameter
			//io.sockets.in( user.room_id ).emit('peer_id', user, connected_users ); //includes you
			socket.broadcast.to( user.room_id ).emit('peer_id', user ); //doesn't include you
		});
		
		/**
		 * on location
		 */
		socket.on('location', function( user ) {
			console.log('got location of', user.email );
			//update connected users
			self.updateConnectedUsers(user);

			// we tell the client to execute 'location' with 1 parameter
			//io.sockets.in( user.room_id ).emit('location', user , connected_users);
			socket.broadcast.to( user.room_id ).emit('location', user ); //doesn't include you
		});
		
		/**
		 * on stream
		 */
		socket.on('stream', function( user ) {
			console.log('got stream of', user.email );
			//update connected users
			self.updateConnectedUsers(user);

			// we tell the client to execute 'stream' with 1 parameter
			//io.sockets.in( user.room_id ).emit('stream', user , connected_users);
			socket.broadcast.to( user.room_id ).emit('stream', user ); //doesn't include you
		});
 		
		/**
		 * switch room
		 */
		socket.on('switchRoom', function( user ){
			console.log("Client has switched room",socket.user);
			// leave the current room (stored in session)
			socket.leave(socket.room);
			// join new room, received as function parameter
			var newroom = user.room_id;
			socket.join(newroom);
			var name = user.name ? user.name : user.email;
			
			// echo to client they've connected
			Event.findOne({ _id: user.event_id }, function (err, item) {
				if (err) return console.error(err);
				if(item){
					//connect to event
					socket.emit('updatechat', 'SERVER', 'you have connected to event : '+item.name );
				}else{
					//connecting to just a room
					socket.emit('updatechat', 'SERVER', 'you have connected to room #'+user.room_id );
				}
			});

			// sent message to OLD room
			socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', name+' has left this room');
			// update socket session room title
			socket.room = newroom;
			socket.broadcast.to(newroom).emit('updatechat', 'SERVER', name+' has joined this room');
			//socket.emit('updaterooms', rooms, newroom);

			//socket.broadcast.to(user.room_id).emit('connected', user, connected_users); //doesn't include you
			io.sockets.in( user.room_id ).emit('switchedRoom', user, connected_users ); //includes you
		});

		
		/**
		 * on disconnect
		 */
		socket.on('disconnect', function() {
			console.log("Client has disconnected",socket.user);

			if(!socket.user) return;

			var user = socket.user;
			var email = socket.user.email;
			var room = socket.user.room_id;//save for later
			
			self.removeConnectedUsers(socket.user);

			var name = user.name ? user.name : email;
			// echo globally that this client has left
			//socket.broadcast.emit('updatechat', 'SERVER', socket.user.email + ' has disconnected',connected_users);
			//console.log('disconnected',socket.user)
			var msg = name+ ' has disconnected from room # ' +  room;
			io.sockets.in( room ).emit('updatechat', 'SERVER', msg );
			io.sockets.in( room ).emit('disconnect', user, connected_users);

			socket.leave( room );
		});
	});
};

/**
 * loop through connected users, match email, and update
 */
module.exports.updateConnectedUsers = function( user ){
	for(var i=0;i<connected_users.length;i++){
		console.log('connected users:',i,'of',connected_users.length-1,connected_users[i].email);
		if(connected_users[i].email === user.email){
			//update user with new data from front end
			console.log('matched user', user);
			//override user with new info
			connected_users[i] = user;
			//for(key in connected_users[i]){
			//	console.log(key,connected_users[i][key])
			//}
		}
	}
};
module.exports.removeConnectedUsers = function( user ){
	var user_index = null;
	// remove the username from global usernames list
	for(var i=0;i<connected_users.length;i++){
		if(connected_users[i].email === user.email){
			user_index = i;
		}
	}
	if(user_index !== null) connected_users.splice(user_index, 1);
	console.log('after disconnecting user,',connected_users);
};
			