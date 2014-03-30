var Utils = require('../utils/utils');


/**
 * init socketHandler
 * @see http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
 */
module.exports.start = function( io ){
	var self = this;
	var connected_users = [];
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
			console.log('connected_users',connected_users);

			//var users_in_room = [];
			//for(var i=0;i<connected_users.length;i++){
			//	if(connected_users[i].room_id == user.room_id){
			//		users_in_room.push( connected_users[i] );
			//	}
			//}


			//var users = [];
			//for (var i  = 0; i < io.sockets.clients().length; i++) {
			//	console.log("loop: " + i, io.sockets.clients()[i].user);
			//	users.push(io.sockets.clients()[i].user)
			//}

			//join room
			socket.join(user.room_id);
			// echo to client they've connected
			socket.emit('updatechat', 'SERVER', 'you have connected to room #'+user.room_id, connected_users);

			var name = user.name ? user.name : user.email;
			// echo to room that a person has connected to their room
			socket.broadcast.to(user.room_id).emit('updatechat', 'SERVER', name + ' has connected to this room.', connected_users);

		});

		// when the client emits 'sendchat', this listens and executes
		socket.on('sendchat', function (user, msg) {
			// we tell the client to execute 'updatechat' with 2 parameters
			io.sockets.in( user.room_id ).emit('updatechat', socket.user, msg, connected_users);
		});


		/**
		 * on peer_id
		 * @description : the start of the video program
		 */
		socket.on('peer_id', function(user) {
			console.log("Received: 'peer_id' " + user.email, user.peer_id);

			//update connected users
			for(var i=0;i<connected_users.length;i++){
				if(connected_users[i].email == user.email){
					//update user with new data from front end
					connected_users[i] = user;
				}
			}
			console.log('peer_id update CU',connected_users);

			// we tell the client to execute 'peer_id' with 1 parameter
			io.sockets.in( user.room_id ).emit('peer_id', user );
		});
		
		/**
		 * on location
		 */
		socket.on('location', function(user) {
			console.log("Received: 'location' " + user.email, user.location);

			//update connected users
			for(var i=0;i<connected_users.length;i++){
				if(connected_users[i].email == user.email){
					//update user with new data from front end
					connected_users[i] = user;
				}
			}
			console.log('location update CU',connected_users);

			// we tell the client to execute 'location' with 1 parameter
			io.sockets.in( user.room_id ).emit('location', user );
		});
		
		/**
		 * on stream
		 */
		socket.on('stream', function(user) {
			console.log("Received: 'stream' " + user.email, user.stream);

			//update connected users
			for(var i=0;i<connected_users.length;i++){
				if(connected_users[i].email == user.email){
					//update user with new data from front end
					connected_users[i] = user;
				}
			}
			console.log('stream update CU',connected_users);
			
			// we tell the client to execute 'stream' with 1 parameter
			io.sockets.in( user.room_id ).emit('stream', user );
		});
		

		/**
		 * on disconnect
		 */
		socket.on('disconnect', function() {
			console.log("Client has disconnected",socket.user,connected_users);
			var user = socket.user;
			var email = socket.user.email;
			var room = socket.user.room_id;//save for later
			var user_index;
			// remove the username from global usernames list
			for(var i=0;i<connected_users.length;i++){
				if(connected_users[i].email === socket.user.email){
					user_index = i;
				}
			}
   			connected_users.splice(user_index, 1);
   			console.log('after disconnect users:',connected_users)

			// update list of users in chat, client-side
			//io.sockets.emit('updateusers', usernames);

			// echo globally that this client has left
			//socket.broadcast.emit('updatechat', 'SERVER', socket.user.email + ' has disconnected',connected_users);
			console.log('disconnected',socket.user)
			var msg = email+ ' has disconnected from room # ' +  room;

			io.sockets.in(room ).emit('updatechat', user, msg, connected_users);
			socket.leave( room );
		});
		

	});
};


			