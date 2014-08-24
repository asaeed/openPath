'use strict';

var OpenPath = window.OpenPath || {};

//shims for peer
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

/**
 * OpenPath
 * @author jamiegilmartin@gmail.com
 */
OpenPath = {
	//configs
/*
	//prod
	
	host : 'openpath.me',
	socketConnection : 'https://openpath.me',//https://localhost:3030'
*/	
	
	//dev
	host : 'localhost',
	socketConnection : 'https://localhost:3030'

};