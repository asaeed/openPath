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
		
		this.profileWrapper = $('#profile');
		this.form = this.profileWrapper.find('form');
		
		//actions
		this.get();
		
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var firstName = $(this).find('.firstName').val(),
				lastName = $(this).find('.lastName').val(),
				gradelevel = $(this).find('.gradelevel').val(),
				interests = $(this).find('.interests').val(),
				colearners = $(this).find('.colearners').val();
			
			self.update(firstName,lastName,gradelevel,interests,colearners);
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
		console.log('populate',data._id);
		this._id = data._id;
		
		if(data.name){
			console.log('name = ' + data.name);
			this.profileWrapper.find('.display').fadeIn();
		}else{
			console.log('no name');
			this.profileWrapper.find('display').show();
		}
	},
	update : function(firstName,lastName,gradelevel,interests,colearners){
		var self = this;
		$.ajax({
			url: '/users/'+this._id,//TODO: this just creates more entries :( FIX
			data:{
				  'name': firstName + " "+ lastName,
				  'grade': gradelevel
				  //'Interests': ["robotics", "coding", "archaeology"],
				  //'HomeLocation': [lat, long],
				  //'Locations': [],
				  //'EventsInvitedTo': [],
				  //'SessionsInvitedTo': [],
				  //'EventsCreated': [],
				  //'SessionsCreated': []	
			},
		    dataType:'json',
		    type:'PUT',
		    async:false,
			success: function(data) { 
				console.log('user updated',data);
				self.populate( data );
		    },
		    error: function(data){
				console.log('user not updated');
			}
		});
		
	}
};
