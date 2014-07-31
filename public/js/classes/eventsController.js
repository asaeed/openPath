'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.EventsController
 * @author jamiegilmartin@gmail.com
 * @description control events shared by views
 */
OpenPath.EventsController = function(){
	console.log('EventsController')
	this.url = '/events';

};
OpenPath.EventsController.prototype = new OpenPath.View();
OpenPath.EventsController.prototype.constructor = OpenPath.EventsController;