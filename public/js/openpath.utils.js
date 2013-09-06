OpenPath = window.OpenPath || {};
/*************************************/
// Openpath.utils
/*************************************/

OpenPath.utils = {
	/**
	* Retrives query string
	*/
	getParameterByName:function (name) {
		name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");

		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		
		return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	},
	/**
	* Validates Email
	* @param	email
	*/
	validateEmail : function(email) { 
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	/**
	* Retrieves and returns formatted date time
	*/
	getDateTimeStamp:function(){
		var dateobj=new Date();
	    var year = dateobj.getFullYear();
	    var month= ("0" + (dateobj.getMonth()+1)).slice(-2);
	    var day = ("0" + dateobj.getDate()).slice(-2);
	    var hours = ("0" + dateobj.getHours()).slice(-2);
	    var minutes = ("0" + dateobj.getMinutes()).slice(-2);
	    var seconds = ("0" + dateobj.getSeconds()).slice(-2);
	    var converted_date = parseInt(month) + "/" + parseInt(day) + "/" + year;
		var converted_time = hours + ":" + minutes + ":" + seconds;
	    return converted_date + " " + converted_time;
  	},
  	/**
	* Gets and returns hash value, otherwise, returns empty string.
	*/
	getHash:function(){
		var hash = "";
		var url = document.location.toString();
		if (url.match('#')) {
			// hash found, retrieve id
		    hash = url.split('#')[1];
		};
		return hash;
	}
};
