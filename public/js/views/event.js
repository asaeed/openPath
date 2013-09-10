OpenPath = window.OpenPath || {};

OpenPath.EventView = Backbone.View.extend({
	//model: new OpenPath.EventModel,
    tagName:"li",
    className:"event",
    template:$("#eventTemplate").html(),
    initialize:function () {
       
       
    },
    render:function () {
        var tmpl = _.template(this.template); //tmpl is a function that takes a JSON object and returns html
        
        this.$el.html(tmpl(this.model.toJSON())); //this.el is what we defined in tagName. use $el to get access to jQuery html() function
        
        this.mapWrap = this.el.querySelector(".mapWrap");
        this.loadMap();
        return this;
    },
    loadMap : function(){

        var ele = this.mapWrap,
            lat = this.model.attributes.location[0],
            lng = this.model.attributes.location[1],
            pos = new google.maps.LatLng(lat, lng);

        var options = {
            zoom: 6,
            center: pos,
            mapTypeId: google.maps.MapTypeId.ROADMAP/*
            mapTypeControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
                position: google.maps.ControlPosition.BOTTOM_RIGHT
            },
            center: pos,
            panControl: true,
            panControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM
            },
            */
        };
        var eventMap = new google.maps.Map(ele, options);
        var eventmapmarker = new google.maps.Marker({
            position: options.center,
            map: eventMap,
            icon: 'img/marker.png',
            center: options.center
        });

    }
});
