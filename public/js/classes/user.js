'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class User, you :)
 */
OpenPath.User = function(){
	//console.log('new User');
	this.user = {
		name :  document.getElementById('userName').value,
		email :  document.getElementById('email').value,
		room_id : document.getElementById('roomId').value,
		event_id : document.getElementById('eventId').value,
		peer_id : null,
		stream :  null,
		location : {
			coords: {
				latitude : null,
				longitude : null
			}
		}
	};
};
//inherits Model & SuperMVC
OpenPath.User.prototype = new OpenPath.Model();
OpenPath.User.prototype.constructor = OpenPath.User;