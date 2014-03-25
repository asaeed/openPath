


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