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
		
		console.log('invite to event ::: event')

		// Validates and submits email inviting participant
		$('#inviteToEventForm').submit(function() {
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
						for (key in data.email) {
							alert(data.email[key]);
						}
					},
					error: function(data){}
				});
			};
			return false;
		});
		
		/*
		//make grade levels array
		var gradelevelsArr = [];
		this.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
			gradelevelsArr.push( $(this).val() );
		});
		
		
		//data to send
		var name = this.form.find('#name').val(),
			websiteLink = this.form.find('#websiteLink').val(),
			description = this.form.find('#description').val(),
			gradelevels = gradelevelsArr, 
			date = this.form.find('#date').val(),
			data = {
				name: name,
				websiteLink: websiteLink,
				creator: OpenPath.email,
				description: description,
				location: this.locationData, 
				grades: gradelevelsArr,
				date: OpenPath.utils.convertDateToTimeStamp(date)
			};
		
		if(name !== '' && description !== '' && gradelevels.length > 0 && date !== ''){
			this.collection.create(new OpenPath.EventModel(data));
			//TODO: need to relocate to events or some other page
			alert('event submitted',data);
			window.location.hash = '#/events/upcoming';
		}else{
			alert('please fill out all the fields')
		}
		*/
	}
});