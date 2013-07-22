var OpenPath = window.OpenPath || {};

/**
 * object that handles updates to user profile
 */
OpenPath.user.profile = {
	init : function(){
				//TODO: get and pre-pop form
		//validate
		//post || put?
		//get if p tab is active
		console.log('OpenPath.user.profile init');
		var self = this;
		
		this.wrapper = $('#profile');
		this.form = this.wrapper.find('form');
		
		//actions
		this.get();
		
		this.form.submit(function(e){
			console.log('update profile',username,email,sessionID);
			
			console.log(this,e)
			
			//self.get();
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
				console.log('user got');
				self.populate(data);
			},
			error: function(data){
				console.log('user not got');
			}
		});
		
	},
	populate : function( data ){
		console.log('populate',data);
		
		if(data.name){
			console.log('name = ' + data.name);
		}else{
			console.log('no name');
		}
	}
};
