


module.exports.formatDate = function( dateString ){
	var d = dateString ;

	return d.getMonth() +'/'+ d.getDate() +'/'+d.getFullYear();
};

module.exports.formatTime = function( timeString ){
	var t = timeString ;
	var hour = (t.split(':')[0] % 12) == 0 ? 12 : t.split(':')[0] % 12;
	var mins = t.split(':')[1];
	var meridiem = t.split(':')[0] > 11 ? 'PM' : 'AM'; 
	
	return hour + ':' + mins + ' '+meridiem;
};

module.exports.uniqueArray = function( arr ){
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