var OpenPath = window.OpenPath || {};

/**
 * object that handles updates to user settings
 */
OpenPath.user.settings = {
	init : function(){
		//TODO: 
		//validate
		
		
		console.log('OpenPath.user.settings init');
		var self = this;
		//dom eles
		this.settingsWrapper = $('#settings');
		this.form = this.settingsWrapper.find('form');
		
		//actions
		this.get();
		
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var alertsColearnerJoin = $(this).find('#alertsColearnerJoin').val(),
				alertsNearEvent = $(this).find('#alertsNearEvent').val(),
				alertsAllEvents = $(this).find('#alertsAllEvents').val(),
				profileAccess = $(this).find('input:radio[name=profileaccess]:checked').val();
			
			console.log('settings',alertsColearnerJoin,alertsNearEvent,alertsAllEvents,profileAccess)
			//self.update(firstName,lastName,gradelevel,interests,colearners);
			
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
