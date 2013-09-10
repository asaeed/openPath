OpenPath = window.OpenPath || {};


var eves = [
            {
                name: 'test event 1',
                creator: 'ja',
                description: 'lorem ip your butt',
                location: [0, 0], 
                grade: ['Pre-K to Grade 2'],
                startTime: 0,
                endTime: 0
            },
            {
                name: 'test event 2',
                creator: 'ja',
                description: 'lorem ip your butt',
                location: [0, 0], 
                grade: ['Pre-K to Grade 2'],
                startTime: 0,
                endTime: 0
            },
            {
                name: 'text event 3',
                creator: 'ja',
                description: 'lorem ip your butt',
                location: [0, 0], 
                grade: ['Pre-K to Grade 2'],
                startTime: 0,
                endTime: 0
            }
        ];

//collection view
OpenPath.EventsView = Backbone.View.extend({
		el:"#eventslist",
        initialize:function(){
            this.collection = new OpenPath.EventsCollection(eves);
            this.render();
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
            })
            console.log(this.$el,this.$el.length,eventView.render().el)
        }
});