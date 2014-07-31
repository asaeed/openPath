

module.exports.formatDate = function( dateString ){
   var monthNames = [ "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December" ]

	var d = dateString ;
  // console.log('format date : '+ monthNames[d.getMonth()]  +'/'+ d.getDate() +'/'+d.getFullYear(),d)
	//return d.getMonth() +'/'+ d.getDate() +'/'+d.getFullYear();
   //return (d.getMonth()+1) +'/'+ d.getDate() +'/'+d.getFullYear();
   return monthNames[d.getMonth()] +' '+ d.getDate() +', '+d.getFullYear();
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