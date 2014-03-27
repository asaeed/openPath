var Utils = require('../utils/utils');


/**
 * init socketHandler
 * @see http://psitsmike.com/2011/10/node-js-and-socket-io-multiroom-chat-tutorial/
 */
module.exports.start = function( io, user, event, room ){
	var self = this;
	var users = [];
	/**
	 * socket.io
	 */
	io.sockets.on('connection', function (socket) {
		console.log("We have a new socket client: " + socket.id);

		//socket.emit('userConnected', { user: user.email, room : room }); //? just emit

		socket.on('adduser', function(user) {
			console.log("Received: 'peer_id' " + user.email, user.peer_id);

			//save user & room to socket session
			socket.user = user;
			socket.room = room._id;


			//add user to global user list
			users.push(user);

			//uniquify users
			users = Utils.uniqueArray(users)


			//join room
			socket.join(room._id);
			// echo to client they've connected
			socket.emit('updateconnection', 'SERVER', 'you have connected to room # '+room._id, users);

			// echo to room that a person has connected to their room
			socket.broadcast.to(room._id).emit('updateconnection', 'SERVER', user.email + ' has connected to this room', users);

		});


		/**
		 * on peer_id
		 * @description : the start of the video program
		 */
		socket.on('peer_id', function(user) {
			console.log("Received: 'peer_id' " + user.email, user.peer_id);
			socket.user = user;
			console.log("Socket Saved: " , socket.user);

			/*
			console.log("Saved: " + socket.user);
			// We can loop through these if we like
			for (var i  = 0; i < io.sockets.clients().length; i++) {
				console.log("loop: " + i + " " +io.sockets.clients()[i]);
			}
			*/
			//if in the same room //!! not sure if this check works but should check on front end as well ( for now )
			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('peer_id', user );

			// we tell the client to execute 'peer_id' with 1 parameter
			io.sockets.in(socket.room).emit('peer_id', socket.user );
			//socket.broadcast.to(room._id).emit('peer_id', socket.user );
		});
		
		/**
		 * on location
		 */
		socket.on('location', function(user) {
			console.log("Received: 'location' " + user.email, user.location);

			// We can save this in the socket object if we like
			socket.user = user;
			console.log("Socket Saved: " , socket.user);
			
			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('location', user );


			// we tell the client to execute 'location' with 1 parameter
			io.sockets.in(socket.room).emit('location', socket.user );
			//socket.broadcast.to(room._id).emit('location', socket.user );
		});

		/**
		 * on stream
		 */
		socket.on('stream', function(user) {
			console.log("Received: 'stream' " + user.email, user.stream);

			// We can save this in the socket object if we like
			socket.user = user;
			console.log("Socket Saved: " , socket.user);

			// Tell everyone my peer_id
			//if(room._id == user.room_id) socket.broadcast.emit('stream', user );

			// we tell the client to execute 'stream' with 1 parameter
			io.sockets.in(socket.room).emit('stream', socket.user );
			//socket.broadcast.to(room._id).emit('stream', socket.user );
		});


		/**
		 * on disconnect
		 */
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
			// remove the username from global usernames list
			//delete users[socket.user];
			var user_index = users.indexOf(socket.user);
			if (user_index > -1) {
   				users.splice(user_index, 1);
			}

			// echo globally that this client has left
			socket.broadcast.emit('updateconnection', 'SERVER', socket.user.email + ' has disconnected',users);
			socket.leave(socket.room);
		});
		

	});
};


			