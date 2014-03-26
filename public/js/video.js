'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.Video = function( element ){
	this.element = element;
	this.render();
};
//inherits View & SuperMVC
//OpenPath.Video.prototype = new OpenPath.View();
//OpenPath.Video.prototype.constructor = OpenPath.Video;

OpenPath.Video.prototype.render = function( ){
	//compile template
	this.source = document.getElementById('videoTemplate').innerHTML;
	this.template = Handlebars.compile(this.source);

	//add data to template
	this.element.innerHTML = this.template( {name:'butt kiss', mute : 'false'} );

	//TODO render map
};


