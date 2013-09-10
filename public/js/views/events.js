OpenPath = window.OpenPath || {};

//collection view
OpenPath.EventsView = Backbone.View.extend({
		el:"#eventslist",
        initialize:function(){
            this.collection = new OpenPath.EventsCollection();
            this.collection.fetch();
            //set modal events
			this.setModal();

            this.render();
            this.collection.on("add", this.renderEvent, this);
            this.collection.on("reset", this.render, this);
        },
        render: function(){
            var self = this;
            _.each(this.collection.models, function(item){
                self.renderEvent(item);
            }, this);
        },
        renderEvent:function(item){
            var eventView = new OpenPath.EventView({
                model: item
            });
            this.$el.append(eventView.render().el);
            this.$el.css({
            	border:'1px solid blue'
            });
        },
        /*
        events: {
        	"click #addEventBtn" : "addEvent"
        },*/

        /**
         * custom form setup & submission - unbackbone way
         */
        setModal : function(){
        	var self = this;
        	this.form = $('#addEvent');
			this.modal = $('#addEventsModal');

			console.log(this.form.length,$('#addEvent'));	

        	$('#starttime').datetimepicker({
			    language: 'en',
			    pick12HourFormat: true
			});
			$('#endtime').datetimepicker({
			    language: 'en',
			    pick12HourFormat: true
			});

        	this.modal.find('.modal-body').css({
				height : $(window).height() -200// -350
			});

			this.form.validate({
				submitHandler: function(form) {
					alert('f sub');
					console.log(self, 'oooooo')
					var name = self.form.find('#name').val(),
						creator = self.form.find('#creator').val(),
						description = self.form.find('#description').val(),
						//
						data = {
							name: name,
							creator: creator,
							description: description//,
		 					//location: [self.lat, self.lng], 
							//grade: gradelevels,
		  					//startTime: startTime,
		  					//endTime: endTime
						};
						
					self.collection.add(new OpenPath.EventModel(data));
					return false;
				}
			});
        }
});