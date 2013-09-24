OpenPath = window.OpenPath || {};

OpenPath.UserSettingsView = Backbone.View.extend({
    tagName:"div",
    className:"displayView",
	template:$("#userSettingsTemplate").html(),
	initialize : function(){
		console.log('userSettingsTemplate init');
		//this.collection = new OpenPath.UserCollection();
        //this.collection.fetch();


        //this.render();
	},
	render:function () {
        var tmpl = _.template(this.template);
        
        this.$el.html(tmpl(this.model.toJSON()));

        console.log(this.model.get("settings"))
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
		/*
    	//populate select ele with correct option selected
		this.$el.find("form select.gradelevel > option").each(function() {
			if(this.value === self.model.grade){
				$(this).attr('selected','selected');
			}
		});
		*/

    	//submit and validate
		this.form.validate({
			submitHandler: function(form) {
				var alertsColearnerJoin = self.form.find('#alertsColearnerJoin').is(':checked'),
					alertsNearEvent = self.form.find('#alertsNearEvent').is(':checked'),
					alertsAllEvents = self.form.find('#alertsAllEvents').is(':checked'),
					profileAccess = self.form.find('input:radio[name=profileaccess]:checked').val(),
					data = {
						'settings' : {
							'alertsColearnerJoin':alertsColearnerJoin,
							'alertsNearEvent':alertsNearEvent,
							'alertsAllEvents':alertsAllEvents,
							'profileAccess':profileAccess
						}
					};
					
					console.log(data)
					/* backbone being bitchy, going old  way*/
					$.ajax({
						url: '/users/'+self.model.id,//TODO: security?
						data: {$set:data}, //{$set writes to individual keys rather than overriding whole entry
						dataType:'json',
						type:'PUT',
						//async:false,
						success: function(new_data) { 
							console.log('user settings updated',new_data.$set);
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