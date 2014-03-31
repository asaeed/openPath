'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.Video = function(){
	//console.log('new video');
};
//inherits View & SuperMVC
//OpenPath.Video.prototype = new OpenPath.View();
//OpenPath.Video.prototype.constructor = OpenPath.Video;

/**
 * init, sets element
 */
OpenPath.Video.prototype.init = function( element ){
	this.element = element;
};
/**
 * called everytime we get a new piece of data
 */
OpenPath.Video.prototype.render = function( user ){

	console.log('render', user.email);
	this.email = user.email;
	this.user = user;

	//compile template
	this.source = document.getElementById('videoTemplate').innerHTML;
	this.template = Handlebars.compile(this.source);

	//add data to template
	this.element.innerHTML = this.template( {name: user.name, mute : 'false'} );


	//define elements now in dom
	this.video = this.element.getElementsByTagName('video')[0];
	this.usermeta = this.element.getElementsByClassName('usermeta')[0];
	this.header =  this.usermeta.getElementsByTagName('header')[0];
	this.closeBtn = this.header.getElementsByClassName('closeBtn')[0];
	this.mapBtn = this.header.getElementsByClassName('mapBtn')[0];
	this.mapWrap = this.usermeta.getElementsByClassName('mapWrap')[0];
	this.map = this.mapWrap.getElementsByClassName('map')[0];

	//now that in dom, bind events
	this.events();


	/**
	 * peer_id
	 */
	if(user.peer_id){
		this.peer_id = user.peer_id;
	}

	/**
	 * render map
	 */
	if(user.location)
	if(user.location.coords.latitude && user.location.coords.longitude){// && !this.mapRendered
		
		OpenPath.Ui.renderMap(this.map, user.location.coords.latitude, user.location.coords.longitude);
		//console.log('location rendered')
	}
	/**
	 * render video
	 */
	if(user.stream){// && !this.streamRendered
		/**
  		 * now that we have your video
  		 */
		this.video.src =  window.URL.createObjectURL(user.stream) || user.stream
		this.video.play();
		console.log('stream playing');
	}		
	//TODO
	//mute if not
};


OpenPath.Video.prototype.events = function(){
	var self = this;
	var over = false;

	//bind events to video tag
	this.video.addEventListener('mouseover',function(e){
		over = true;
		self.usermeta.style.opacity = 1;
	},false);
	this.video.addEventListener('mouseout',function(e){
		setTimeout(function(){
			if(!over){
				self.usermeta.style.opacity = 0;
			}
		},500);
		over = false;
	},false);
	/*
	this.video.addEventListener('click',function(e){
		//swap??
	},false);
	*/
	//keep over as true if over meta
	this.usermeta.addEventListener('mouseover',function(e){
		over = true;
		self.usermeta.style.opacity = 1;
	},false);
	this.usermeta.addEventListener('mouseout',function(e){
		setTimeout(function(){
			if(!over){
				self.usermeta.style.opacity = 0;
			}
		},500);
		over = false;
	},false);

	//mapBtn
	this.mapBtn.addEventListener('click',function(e){
		self.mapBtn.style.display = 'none';
		self.closeBtn.style.display = 'block';
		
		self.mapWrap.style.opacity = 1;
	},false);

	//closeBtn
	this.closeBtn.addEventListener('click',function(e){
		self.closeBtn.style.display = 'none';
		self.mapBtn.style.display = 'block';

		self.mapWrap.style.opacity = 0;
	},false);
};

