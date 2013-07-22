var OpenPath = window.OpenPath || {};

OpenPath.user = {
	init : function(){
		console.log('openPath.user.init');
	},
	onMenuChange : function(){
		console.log('on menu change');
		if( $('#profile').hasClass('active') ){
			this.profile.init();
		}
	},
	update : function(lat,long){
		$.ajax({
			url: '/users/51eab1c525780e336f00000b',
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
