'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class Model
 */
OpenPath.Model = function( p1, p2 ){
	OpenPath.SuperMVC.call( this, p1, p2 );
	this.name = "model";
	this.init();
};
//inherits SuperMVC
OpenPath.Model.prototype = new OpenPath.SuperMVC();
OpenPath.Model.prototype.constructor = OpenPath.Model;
