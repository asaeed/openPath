var OpenPath = window.OpenPath || {};

OpenPath.user = {
	update : function(lat,long){
		$.ajax({
			url: '/users/51eae1e7da82739a0b000001',
			data:{
				  'name': "JaRasta",
				  'grade': "6-8",
				  'Interests': ["robotics", "coding", "archaeology"],
				  'HomeLocation': [lat, long],
				  'Locations': [],
				  'EventsInvitedTo': [],
				  'SessionsInvitedTo': [],
				  'EventsCreated': [],
				  'SessionsCreated': []	
			},
		    dataType:'json',
		    type:'PUT',
		    async:false,
			success: function(data) { 
				console.log('user updated');
		    },
		    error: function(data){
				console.log('user not updated');
			}
		});
	}
	
};
