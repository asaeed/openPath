OpenPath = window.OpenPath || {};

OpenPath.UserProfileView = Backbone.View.extend({
    tagName:"div",
    className:"displayView",
	template:$("#userProfileTemplate").html(),
	render:function () {
        var tmpl = _.template(this.template);
        
        this.$el.html(tmpl(this.model.toJSON())); 
        return this;
    }

});