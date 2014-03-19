'use strict';

var OpenPath = window.OpenPath || {};

OpenPath = {
	init : function(){
		console.log('OpenPath init');

		var home = document.getElementById('home');
		if(home){
			this.peer();
			this.socket();
			this.getUserMedia();
		}
	},
	peer : function(){
		var peer_id = null;
		var peer = new Peer({key: 'w8hlftc242jzto6r'}); //TODO: out own peer server?

		// Get an ID from the PeerJS server		
		peer.on('open', function(id) {
		  console.log('My peer ID is: ' + id);
		  peer_id = id;
		});		
			
	},
	socket : function(){
		var socket = io.connect('http://localhost');
		socket.on('userConnected', function (data) {
			console.log(data);
		});
	},
	getUserMedia : function(){
		var my_stream = null;

		window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
		navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
		if (navigator.getUserMedia) {
			navigator.getUserMedia(
				{video: true, audio: true},
				function(stream) {
						my_stream = stream;
						var videoElement = document.getElementById('myvideo');
						videoElement.src = window.URL.createObjectURL(stream) || stream;
						videoElement.play();
				},
				function(err) {
						console.log('Failed to get local stream' ,err);
				}
			);
		}
	}
};


window.onload = function(){
	OpenPath.init();
};