


/**
 * init socketHandler
 */
module.exports.start = function( io, user, event, room ){
	var self = this;

	/**
	 * socket.io
	 */
	io.sockets.on('connection', function (socket) {
		console.log("We have a new socket client: " + socket.id);

		//socket.emit('userConnected', { user: user.email, room : room }); //? just emit

		/**
		 * on peer_id
		 * @description : the start of the video program
		 */
		socket.on('peer_id', function(data) {
			console.log("Received: 'peer_id' " + data.email, data.peer_id);

			// We can save this in the socket object if we like
			socket.user = data;
			console.log("Saved: " + socket.user);

			// We can loop through these if we like
			for (var i  = 0; i < io.sockets.clients().length; i++) {
				console.log("loop: " + i + " " +io.sockets.clients()[i]);

			}
			
			//if in the same room //!! not sure if this check works but should check on front end as well ( for now )
			if(room._id == data.room_id){
				// Tell everyone my peer_id
				socket.broadcast.emit('peer_id', data );
			}
			
		});
		
		/**
		 * on location
		 */
		socket.on('location', function(data) {
			console.log("Received: 'location' " + data.email, data.location);

			// We can save this in the socket object if we like
			socket.user = data;
			console.log("Saved: " + socket.user);
			
			// Tell everyone my peer_id
			socket.broadcast.emit('location', data );
		});

		/**
		 * on stream
		 */
		socket.on('stream', function(data) {
			console.log("Received: 'stream' " + data.email, data.stream);

			// We can save this in the socket object if we like
			socket.user = data;
			console.log("Saved: " + socket.user);

			// Tell everyone my peer_id
			socket.broadcast.emit('stream', data );
		});


		/**
		 * on disconnect
		 
		socket.on('disconnect', function() {
			console.log("Client has disconnected");
		});
		*/

	});
};


			