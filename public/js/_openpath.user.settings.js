OpenPath = window.OpenPath || {};

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
		this.alertsColearnerJoin = this.form.find('#alertsColearnerJoin');
		this.alertsNearEvent = this.form.find('#alertsNearEvent');
		this.alertsAllEvents = this.form.find('#alertsAllEvents');
		this.profileAccessPublic = this.form.find('#profileAccessPublic');
		this.profileAccessPrivate = this.form.find('#profileAccessPrivate');
		this.saved = this.form.find('.saved');

		//hide saved msg on init
		this.saved.hide();

		//actions
		/*
		OpenPath.user.getByEmail(function(d){
			self.populate(d);
		});
		*/
		this.form.submit(function(e){
			//console.log('update profile',username,email,sessionID);
			var alertsColearnerJoin = self.alertsColearnerJoin.is(':checked'),
				alertsNearEvent = self.alertsNearEvent.is(':checked'),
				alertsAllEvents = self.alertsAllEvents.is(':checked'),
				profileAccess = $(this).find('input:radio[name=profileaccess]:checked').val(),
				data = {
					'settings' : {
						'alertsColearnerJoin':alertsColearnerJoin,
						'alertsNearEvent':alertsNearEvent,
						'alertsAllEvents':alertsAllEvents,
						'profileAccess':profileAccess
					}
				};
			/*
			OpenPath.user.update(data, function(d){
				self.populate(d);
				self.saved.fadeIn();
			});
			*/
			
			return false;
		});
		
	},
	populate : function( data ){
		//console.log('populate',data.email,data._id);//TODO: hide _id
		//console.log(data.settings);
		//alertsColearnerJoin,alertsNearEvent,alertsAllEvents,profileAccess
		if(data.settings.alertsColearnerJoin === 'true'){
			this.alertsColearnerJoin.attr('checked','checked');
		}
		if(data.settings.alertsNearEvent === 'true'){
			this.alertsNearEvent.attr('checked','checked');
		}
		if(data.settings.alertsAllEvents === 'true'){
			this.alertsAllEvents.attr('checked','checked');
		}
		if(data.settings.profileAccess === 'private'){
			this.profileAccessPrivate.attr('checked','checked');
		}else{
			this.profileAccessPublic.attr('checked','checked');
		}
		
		
	}
};
