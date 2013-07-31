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
		//dom eles
		this.profileWrapper = $('#profile');
		this.profileUsername = $('h1#profileUsername');
		this.form = this.profileWrapper.find('form');
		this.displayView = this.profileWrapper.find('.displayView');
		this.editView = this.profileWrapper.find('.editView');
		this.editProfileBtn = this.profileWrapper.find('a.editProfileBtn');
		
		//actions
		this.get();
		
		
		this.editProfileBtn.click(function(){
			self.profileUsername.hide();
			self.displayView.hide();
			self.editView.show();
		});
		
		
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var firstName = $(this).find('.firstName').val(),
				lastName = $(this).find('.lastName').val(),
				gradelevel = $(this).find('.gradelevel').val(),
				interests = $(this).find('.interests').val(),
				colearners = $(this).find('.colearners').val();
			
			self.update(firstName,lastName,gradelevel,interests,colearners);
			
			//TODO: check if success
			self.editView.hide();
			self.profileUsername.show();
			self.displayView.show();
			return false;
		});
		
	},
	get : function(){
		var self = this;
		console.log('getting : '+email);
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
		
		console.log(data.name.first)
		if(data.name && data.name !== ' '){
			console.log('name = ' + data.name);
			$('#profileUsername').html(data.name.first +' '+data.name.last);
			
			this.profileWrapper.find('form .firstName').val(data.name.first);
			this.profileWrapper.find('form .lastName').val(data.name.last);
		}else{
			console.log('no name');
			
		}
		
		if(data.grade){
			this.profileWrapper.find('.displayView article.gradelevel .results').html(data.grade);
			//populate select ele with correct option selected
			this.profileWrapper.find("form select.gradelevel > option").each(function() {
				if(this.value === data.grade){
					$(this).attr('selected','selected');
				}
			});
		}else{
			
		}
		
		if(data.Interests){
			console.log(data.Interests)
			this.profileWrapper.find('.displayView article.interests .results').html(data.Interests);
			//TODO: pop select form with correct option
			this.profileWrapper.find('form .interests').val(data.Interests);
			
		}else{
			console.log('no interests')
		}
	},
	update : function(firstName,lastName,gradelevel,interests,colearners){
		var self = this;
		
		
		$.ajax({
			url: '/users/'+this._id,//TODO: this just creates more entries :( FIX
			data:{
				'email':email,
				'name': {'first' : firstName, 'last' : lastName },
				'grade': gradelevel,
				'Interests': interests.split(',').join(', ')//,
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
