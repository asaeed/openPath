OpenPath = window.OpenPath || {};

/**
 * @class Controller
 */
OpenPath.Controller = function( p1, p2 ){
	OpenPath.SuperMVC.call( this, p1, p2 );
	this.name = 'controller';
	this.init();
};
//inherits SuperMVC
OpenPath.Controller.prototype = new OpenPath.SuperMVC();
OpenPath.Controller.prototype.constructor = OpenPath.Controller;