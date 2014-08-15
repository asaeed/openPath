'use strict';

OpenPath = window.OpenPath || {};

/**
 * OpenPath.Utils
 * @author jamiegilmartin@gmail.com
 */
OpenPath.Utils = {};

OpenPath.Utils.formatTime = function( timeString ){
	var t = timeString ;
	var hour = (t.split(':')[0] % 12) == 0 ? 12 : t.split(':')[0] % 12;
	var mins = t.split(':')[1];
	var meridiem = t.split(':')[0] > 11 ? 'PM' : 'AM'; 
	
	return hour + ':' + mins + ' '+meridiem;
};
/**
 * formatDateForHTMLInput
 * @see http://stackoverflow.com/questions/14212527/how-to-set-default-value-to-the-inputtype-date
 * Note: perhaps the server date needs to be changed so that this is easier TODO
 */
OpenPath.Utils.formatDateForHTMLInput = function( dateString ){
   var monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

   var year = dateString.split(', ')[1];
   var month = monthNames.indexOf( dateString.split(' ')[0] ) + 1;
   month = month < 10 ? '0'+month : month;
   var day = dateString.split(' ')[1].split(',')[0];
   day = day < 10 ? '0'+day : day;

   //need format YYYY-MM-DD
   return year+'-'+month+'-'+day;
};

/**
 * formatTimeForHTMLInput
 * @see http://www.w3.org/TR/html-markup/input.time.html
 */
OpenPath.Utils.formatTimeForHTMLInput = function( timeString ){
   var hour = timeString.split(':')[0];
   var min = timeString.split(':')[1].split(' ')[0];
   var meridiem = timeString.split(' ')[1];

   hour = meridiem==='PM' ?  12 + Number(hour) : hour;
   hour = hour < 10 ? '0'+hour : hour;
   if(min !== '00')
   min = min < 10 ? '0'+min : min;

   console.log(meridiem,hour);
   return hour+':'+min+':00';
};

OpenPath.Utils.uniqueArray = function( arr ){
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
};

//@see http://stackoverflow.com/a/587575/1308629
OpenPath.Utils.checkEnter = function(e){
   console.log('check enter')
   e = e || event;
   var txtArea = /textarea/i.test((e.target || e.srcElement).tagName);
   return txtArea || (e.keyCode || e.which || e.charCode || 0) !== 13;
}