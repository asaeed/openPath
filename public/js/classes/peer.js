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
		self.video.render();
	});
};