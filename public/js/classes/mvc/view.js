'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class View
 */
OpenPath.View = function( p1, p2 ){
	OpenPath.SuperMVC.call( this, p1, p2 );
	this.name = 'view';
	this.init();
};
//inherits SuperMVC
OpenPath.View.prototype = new OpenPath.SuperMVC();
OpenPath.View.prototype.constructor = OpenPath.View;

