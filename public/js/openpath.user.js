var OpenPath = window.OpenPath || {};

OpenPath.user = {
	profile : function(){
		var self = this;
		//TODO: get and fill form
		//validate
		//post || put?
		//get if p tab is active
		
		$('#profile').find('form').submit(function(e){
			console.log('update profile',username,email,sessionID);
			
			console.log(this,e)
			
			self.get();
			return false;
		});
	},
	get : function(){
		var self = this;
		console.log('getting'+email);
		//TODO: FIX go through session
		$.ajax({
			url: '/users-email/'+email,
		    type:'GET',
			success: function(data) { 
				console.log('user got', data._id);
				
		    },
		    error: function(data){
				console.log('user not got');
			}
		});
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
