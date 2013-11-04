OpenPath = window.OpenPath || {};

//collection view
OpenPath.EventsView = Backbone.View.extend({
	el:"#eventslist",
    initialize:function(){
        this.collection = new OpenPath.EventsCollection();
        this.collection.fetch();
		
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
		console.log('on add render me',item)
        var eventView = new OpenPath.EventView({
            model: item
        });
        this.$el.append(eventView.render().el);
    }
});