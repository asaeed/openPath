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
		OpenPath.user.getByEmail(function(d){
			self.populate(d);
		});
		
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var alertsColearnerJoin = $(this).find('#alertsColearnerJoin').val(),
				alertsNearEvent = $(this).find('#alertsNearEvent').val(),
				alertsAllEvents = $(this).find('#alertsAllEvents').val(),
				profileAccess = $(this).find('input:radio[name=profileaccess]:checked').val(),
				data = {
					'settings' : {
						'alertsColearnerJoin':alertsColearnerJoin,
						'alertsNearEvent':alertsNearEvent,
						'alertsAllEvents':alertsAllEvents,
						'profileAccess':profileAccess
					}
				};
			
			OpenPath.user.update(data, function(d){
				self.populate(d);
			});
			
			
			return false;
		});
		
	},
	populate : function( data ){
		console.log('populate',data._id);
		//alertsColearnerJoin,alertsNearEvent,alertsAllEvents,profileAccess
		/*
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
		*/
	}
};
