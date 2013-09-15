OpenPath = window.OpenPath || {};

OpenPath.Router = Backbone.Router.extend({
    routes: {
        ":route/:action": "loadView",
        "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new OpenPath.Router;

app_router.on('route:loadView', function(route, action) {
    console.log('route:loadView',route,action);
});
app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions);
    //hide other tabs
    $('.main-tab').each(function(){
        $(this).hide();
        console.log('hide main tabs')
    });

    if(actions === 'main'){
        $('#videos').show();
    }
    if(actions === 'adduser'){
        $('#addUser').show();
    }
    if(actions === 'events'){
        $('#events').show();
        //clear
    	$('#eventslist').html();
        var evCollection = new OpenPath.EventsView();
    }
    if(actions === 'user'){
        $('#user').show();
        $('.user-tab').each(function(){
            $(this).hide();
            console.log('hide user tabs')
        });
        //start with profile
        $('#profile').show();
    	/*
    	var userModel = new OpenPath.UserModel({
			    name: '',
			    email: '',
			    grade: '',
			    interests: [],
			    homelocation:[0,0],
			    locations : [{ location: [0, 0], atTime: 0 }]
            });
        var userView = new OpenPath.EventView({
                model: userModel
            });
            $("#eventslist").html(evView.render().el);
        */

    }
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();