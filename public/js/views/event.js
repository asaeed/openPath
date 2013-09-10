OpenPath = window.OpenPath || {};

OpenPath.EventView = Backbone.View.extend({
	//model: new OpenPath.EventModel,
    tagName:"li",
    className:"event",
    template:$("#eventTemplate").html(),
    initialize:function () {
       // this.template = _.template($('#tmpl_sourcelist').html());
    },
    render:function () {
        var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        
        this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        return this;
    }
});
