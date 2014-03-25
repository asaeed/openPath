			/**
			 * socket.io
			 
			io.sockets.on('connection', function (socket) {
				socket.emit('userConnected', { user: req.user }); //? just emit
				console.log("We have a new client: " + socket.id);
		
				socket.on('peer_id', function(data) {
					console.log("Received: 'peer_id' " + data);

					// We can save this in the socket object if we like
					socket.peer_id = data;
					console.log("Saved: " + socket.peer_id);

					// We can loop through these if we like
					for (var i  = 0; i < io.sockets.clients().length; i++) {
						console.log("loop: " + i + " " + io.sockets.clients()[i].peer_id);
					}
					
					// Tell everyone my peer_id
					socket.broadcast.emit('peer_id',data);
				});
				
				
				socket.on('disconnect', function() {
					console.log("Client has disconnected");
				});
			});
			*/