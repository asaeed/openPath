'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.Video = function(user){
	this.user = user;
	//console.log('new video');
	this.element = document.createElement('div');
	this.element.classList.add('video-element');

	this.unRendered = true;
};
//inherits View & SuperMVC
//OpenPath.Video.prototype = new OpenPath.View();
//OpenPath.Video.prototype.constructor = OpenPath.Video;

/**
 * called everytime we get a new piece of data
 */
OpenPath.Video.prototype.render = function(renderWhat){
	var user = this.user.obj; //gets update user obj

	if(this.unRendered){

		this.muted = true ? user.email === OpenPath.user.obj.email : false;
		//compile template
		this.source = document.getElementById('videoTemplate').innerHTML;
		this.template = Handlebars.compile(this.source);

		//add data to template
		this.element.innerHTML = this.template( {id:user.peer_id, name: user.name, mute : this.muted} );

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


		//for room switch
		if(user.stream){
			this.video.src =  window.URL.createObjectURL(user.stream) || user.stream
			this.video.play();
			console.log('stream playing');
		}
		if(user.location){
			OpenPath.Ui.renderMap(this.map, user.location.coords.latitude, user.location.coords.longitude);
		}


		this.unRendered = false;
	}


	/**
	 * peer_id
	 */
	if(user.peer_id){
		this.peer_id = user.peer_id;
	}

	/**
	 * render map
	 */
	if(renderWhat === 'location' && user.location)
	if(user.location.coords.latitude && user.location.coords.longitude){// && !this.mapRendered
		
		OpenPath.Ui.renderMap(this.map, user.location.coords.latitude, user.location.coords.longitude);
		//console.log('location rendered')
	}
	/**
	 * render video
	 */
	if(renderWhat === 'stream' && user.stream){// && !this.streamRendered
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
		
		self.mapWrap.style.display= 'block';
		self.mapWrap.style.height = 200+'px';
	},false);

	//closeBtn
	this.closeBtn.addEventListener('click',function(e){
		self.closeBtn.style.display = 'none';
		self.mapBtn.style.display = 'block';

		self.mapWrap.style.display= 'none';

	},false);
};

