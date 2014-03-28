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
			connected_users.push(socket.user);

			//uniquify users
			connected_users = Utils.uniqueArray(connected_users);


			//join room
			socket.join(user.room_id);
			// echo to client they've connected
			socket.emit('updatechat', 'SERVER', 'you have connected to room # '+user.room_id, connected_users);

			// echo to room that a person has connected to their room
			socket.broadcast.to(user.room_id).emit('updatechat', 'SERVER','broadcast: '+ user.email + 'broadcast has connected to room # '+user.room_id, connected_users);

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
			//socket.user = user;
			//console.log("Socket Saved: " , socket.user);

			
			//console.log("Saved: " + socket.user);
			//// We can loop through these if we like
			//for (var i  = 0; i < io.sockets.clients().length; i++) {
			//	console.log("loop: " + i + " " +io.sockets.clients()[i]);
			//}
			
			//if in the same room //!! not sure if this check works but should check on front end as well ( for now )
			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('peer_id', user );

			// we tell the client to execute 'peer_id' with 1 parameter
			io.sockets.in( user.room_id ).emit('peer_id', user );
			//socket.broadcast.to(room._id).emit('peer_id', socket.user );
		});
		
		/**
		 * on location
		 */
		socket.on('location', function(user) {
			console.log("Received: 'location' " + user.email, user.location);

			// We can save this in the socket object if we like
			//socket.user = user;
			//console.log("Socket Saved: " , socket.user);
			
			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('location', user );


			// we tell the client to execute 'location' with 1 parameter
			io.sockets.in( user.room_id ).emit('location', user );
			//socket.broadcast.to(room._id).emit('location', socket.user );
		});
		
		/**
		 * on stream
		 */
		socket.on('stream', function(user) {
			console.log("Received: 'stream' " + user.email, user.stream);

			// We can save this in the socket object if we like
			//socket.user = user;
			//console.log("Socket Saved: " , socket.user);

			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('stream', user );

			// we tell the client to execute 'stream' with 1 parameter
			io.sockets.in( user.room_id ).emit('stream', user );
			//socket.broadcast.to(room._id).emit('stream', socket.user );
		});
		

		/**
		 * on disconnect
		 */
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
			// remove the username from global usernames list
			//delete usernames[socket.username];

			var user_index = connected_users.indexOf(socket.user);
			if (user_index > -1) {
   				connected_users.splice(user_index, 1);
			}

			// update list of users in chat, client-side
			//io.sockets.emit('updateusers', usernames);

			// echo globally that this client has left
			//socket.broadcast.emit('updatechat', 'SERVER', socket.user.email + ' has disconnected',connected_users);
			
			var msg = socket.user.email + ' has disconnected from room # ' +  socket.user.room_id;

			io.sockets.in( socket.user.room_id ).emit('updatechat', socket.user, msg, connected_users);
			socket.leave( socket.user.room_id );
		});
		

	});
};


			