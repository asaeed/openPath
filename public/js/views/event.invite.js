OpenPath = window.OpenPath || {};

OpenPath.AddEventView = Backbone.View.extend({
	model: new OpenPath.EventModel,
    tagName:"div",
    className:"inviteToEventWrap",
    template:$("#inviteToEventTemplate").html(),
    initialize:function () {
       //init
       this.collection = new OpenPath.EventsCollection();
	   
	   console.log('invite to event here')
    },
    render:function () {
        var tmpl = _.template(this.template);
        this.$el.html(tmpl(this.model.toJSON()));
		
        return this;
    },
	events : {
		'submit #inviteToEventForm':'inviteToEvent'
	},
	inviteToEvent : function(e){
		e.preventDefault();
		
		//set form
		this.form = this.$el.find('#inviteToEventForm');
		
		
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