var OpenPath = window.OpenPath || {};

OpenPath.user = {
	init : function(){
		this.profile = $('#profile');
		this.profileForm = this.profile.find('form');

		
	},
	onMenuChange : function(){
		if( this.profile.hasClass('active') ){
			this.profile();
		}
	},
	profile : function(){
		//TODO: get and pre-pop form
		//validate
		//post || put?
		//get if p tab is active
		
		var self = this;

		

		this.profileForm.submit(function(e){
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
