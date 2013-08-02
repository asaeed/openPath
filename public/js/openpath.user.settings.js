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
		console.log('populate',data.email,data._id);
		//alertsColearnerJoin,alertsNearEvent,alertsAllEvents,profileAccess

	}
};
