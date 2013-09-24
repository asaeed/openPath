OpenPath = window.OpenPath || {};

OpenPath.UserProfileView = Backbone.View.extend({
    tagName:"div",
    className:"displayView",
	template:$("#userProfileTemplate").html(),
	render:function () {
        var tmpl = _.template(this.template);
        
        this.$el.html(tmpl(this.model.toJSON()));

        console.log(this.model.get("interests"))
        //set user name
        var name = this.model.get("name");
        if(name.first !== '')
        $('h1#profileUsername').html(name.first + ' '+name.last);
        
        return this;
    }

});