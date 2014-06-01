'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class Peer, your friends :|
 */
OpenPath.Peer = function( obj ){
	console.log('new peer')
	this.obj = obj;
	this.got(obj);
};
//inherits User
OpenPath.Peer.prototype = new OpenPath.User();
OpenPath.Peer.prototype.constructor = OpenPath.Peer;

OpenPath.Peer.prototype.got = function(){
	var self = this;

	//create video
	this.video = new OpenPath.Video(this);

	/**
	 * check if peer is presenter
	 */
	this.checkIfPresenter(function( isPresenter ){
		if(isPresenter){
			console.log('Peer is presenter');
			//set userVideo to presenter
			OpenPath.presenterElement.appendChild(self.video.element);
		}else{
			console.log('Peer is not presenter');
			//add to peer list
			var li = document.createElement('li');
			li.appendChild(self.video.element);
			OpenPath.peersList.appendChild(li);
		}
		self.video.render();
	});
};