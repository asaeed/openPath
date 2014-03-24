'use strict';

OpenPath = window.OpenPath || {};

/**
 * @class Model View Collections
 * @author jamiegilmartin@gmail.com
 */
OpenPath.SuperMVC = function( p1, p2 ){
	this.name = "supermvc"
	//this.init();
};
OpenPath.SuperMVC.prototype.init = function(){
	console.log('new mvc', this.name);
};
OpenPath.SuperMVC.prototype.get = function(){
	console.log('mvc get', this.name,this.url);
	
	var self = this;
	
	//request API
	var xhr = new XMLHttpRequest();

	xhr.open('GET',this.url,true);
	xhr.onload = function(){
	  var parsedJSON = JSON.parse(this.responseText);
	  
	  self.got( parsedJSON );
	};

	xhr.send();
};
/**
 * got for polymorphism
 */
OpenPath.SuperMVC.prototype.got = function(data){
	console.log('mvc got', data);
};

OpenPath.SuperMVC.prototype.post = function(data){
	console.log('mvc post', data);
	
	var self = this;
	
	//request API
	var xhr = new XMLHttpRequest();
	xhr.open('POST', this.url, true);
	//xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.send(JSON.stringify(data));
	
	xhr.onload = function() {
		if (xhr.status >= 200 && xhr.status < 400){
		  // Success!
		  var data = JSON.parse(xhr.responseText);
		  self.posted(data);
		  //console.log('post: on load', xhr.responseText);
	  } else {
		  // We reached our target server, but it returned an error
		  
	  }
	};
	xhr.onloadend = function () {
		// done
		//console.log('post: on load end');
	};
	xhr.onerror = function() {
		// There was a connection error of some sort
		//console.log('post: on error', xhr.responseText );
	};
};

/**
 * posted for polymorphism
 */
OpenPath.SuperMVC.prototype.posted = function(data){
	console.log('mvc posted', data);
};
