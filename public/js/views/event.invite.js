OpenPath = window.OpenPath || {};

OpenPath.inviteToEventView = Backbone.View.extend({
	//model: new OpenPath.EventModel,
    tagName:"div",
    className:"inviteToEventWrap",
    template:$("#inviteToEventTemplate").html(),
    initialize:function (model) { //TODO: or just pass the whole model?
       //init
       //this.collection = new OpenPath.EventsCollection();
	   this.model = model.model;
	   
	   console.log('invite to event here',this.model.attributes._id)
		
	   
	   /*
		this.user = new OpenPath.UserModel({_id: user._id});//good

		this.user.set("gravatarUrl", user.gravatarUrl);
		// The fetch below will perform GET /user/1
		// The server should return the id, name and email from the database
		this.user.fetch({
		    success: function (user) {
		        console.log('fetched user',user.toJSON());
		    }
		});
	   */
    },
    render:function () {
        var tmpl = _.template(this.template);
        this.$el.html(tmpl(this.model.toJSON()));
		
		this.inviteToEvent();
		
        return this;
    },
	events : {
		//'submit #inviteToEventForm':'inviteToEvent'
	},
	inviteToEvent : function(e){
		//e.preventDefault();
		var self = this;
		//set form
		this.form = this.$el.find('#inviteToEventForm');

		// Validates and submits email inviting participant
		this.form.submit(function() {
			var email = $('#inviteToEventTo').val();
			var isValid = OpenPath.utils.validateEmail(email);
			
			if(!isValid){
				$('#emailerror').modal();
			}else{
				var data = self.form.serialize(); // serialize all the data in the form 
				$.ajax({
					url: '/email',
					data: data,
					dataType:'json',
					type:'POST',
					async:false,
					success: function(data) { 
						console.log(data)
						       
						for (key in data.email) {
							alert(data.email[key]);
						}
						
						$('#userInvited').modal();
					},
					error: function(data){
						console.log('error',data)
						
					}
				});
			};
			return false;
			
		});
	}
});