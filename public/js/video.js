'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.Video = function( element ){
	this.element = element;
	//this.render();
};
//inherits View & SuperMVC
//OpenPath.Video.prototype = new OpenPath.View();
//OpenPath.Video.prototype.constructor = OpenPath.Video;



OpenPath.Video.prototype.render = function( user ){
	console.log('render vid',user)

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
	

	//render map
	OpenPath.Ui.renderMap(this.map, 40.7636152, -73.99543109999999,'');
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

