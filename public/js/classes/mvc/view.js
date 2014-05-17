'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.View = function( p1, p2 ){
	OpenPath.SuperMVC.call( this, p1, p2 );
	this.name = 'view';
	//this.init();
};
//inherits SuperMVC
OpenPath.View.prototype = new OpenPath.SuperMVC();
OpenPath.View.prototype.constructor = OpenPath.View;

/**
 * handles events
 */
OpenPath.View.prototype.eventHandler = function(element, eventName, callback){
	element.addEventListener(eventName,function(e){callback(e);},false);
};