'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class Collection
 */
OpenPath.Collection = function( p1, p2 ){
	OpenPath.SuperMVC.call( this, p1, p2 );
	this.name = 'collection';
	//this.init();
};
//inherits SuperMVC
OpenPath.Collection.prototype = new OpenPath.SuperMVC();
OpenPath.Collection.prototype.constructor = OpenPath.Collection;