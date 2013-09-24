OpenPath = window.OpenPath || {};

OpenPath.UserSettingsView = Backbone.View.extend({
    tagName:"div",
    className:"displayView",
	template:$("#userSettingsTemplate").html(),
	initialize : function(){
		console.log('userSettingsTemplate init');
		//this.collection = new OpenPath.UserCollection();
        //this.collection.fetch();


        this.render();
	},
	render:function () {
        var tmpl = _.template(this.template);
        
        this.$el.html(tmpl(this.model.toJSON()));


        //set user name
        var name = this.model.get("name");
        if(name.first !== '')
        $('h1#profileUsername').html(name.first + ' '+name.last);
        


		//set up and handle form submission
		this.setForm();

        return this;
    },
    /**
     * custom form setup & submission - unbackbone way
     */
    setForm : function(){
    	var self = this;
    	this.form = this.$el.find('form');
		this.alertsColearnerJoin = this.form.find('#alertsColearnerJoin');
		this.alertsNearEvent = this.form.find('#alertsNearEvent');
		this.alertsAllEvents = this.form.find('#alertsAllEvents');
		this.profileAccessPublic = this.form.find('#profileAccessPublic');
		this.profileAccessPrivate = this.form.find('#profileAccessPrivate');
		this.saved = this.form.find('.saved');

		//hide saved msg on init
		this.saved.hide();

		//populate template
		var settings = this.model.get("settings");
		if(settings.alertsColearnerJoin === 'true'){
			this.alertsColearnerJoin.attr('checked','checked');
		}
		if(settings.alertsNearEvent === 'true'){
			this.alertsNearEvent.attr('checked','checked');
		}
		if(settings.alertsAllEvents === 'true'){
			this.alertsAllEvents.attr('checked','checked');
		}
		if(settings.profileAccess === 'private'){
			this.profileAccessPrivate.attr('checked','checked');
		}else{
			this.profileAccessPublic.attr('checked','checked');
		}
		
    	//submit and validate
		this.form.validate({
			submitHandler: function(form) {
				var alertsColearnerJoin = self.alertsColearnerJoin.is(':checked'),
					alertsNearEvent = self.alertsNearEvent.is(':checked'),
					alertsAllEvents = self.alertsAllEvents.is(':checked'),
					profileAccess = self.form.find('input:radio[name=profileaccess]:checked').val(),
					data = {
						'settings' : {
							'alertsColearnerJoin':alertsColearnerJoin,
							'alertsNearEvent':alertsNearEvent,
							'alertsAllEvents':alertsAllEvents,
							'profileAccess':profileAccess
						}
					};
				/* backbone being bitchy, going old  way*/
				$.ajax({
					url: '/users/'+self.model.id,//TODO: security?
					data: {$set:data}, //{$set writes to individual keys rather than overriding whole entry
					dataType:'json',
					type:'PUT',
					//async:false,
					success: function(new_data) { 
						console.log('user updated',new_data.$set);
						self.model.sync("read", self.model)//nothing?
					},
					error: function(msg){
						console.log('user not updated',msg);
					}
				});
				return false;
			}
		});
    }
});