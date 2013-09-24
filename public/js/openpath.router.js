OpenPath = window.OpenPath || {};

OpenPath.Router = Backbone.Router.extend({
    routes: {
        ":route/:action": "loadView",
        "*actions": "defaultRoute" // matches http://example.com/#anything-here
    }
});
// Initiate the router
var app_router = new OpenPath.Router,
	loadRoute = {};

app_router.on('route:loadView', function(route, action) {
    console.log('route:loadView',route,action);
    /**
     * user route
     */
    if(route === 'user'){
        if(action === 'profile'){
			loadRoute.user.profile();
        }
        if(action === 'edit-profile'){
			loadRoute.user.editProfile();
        }
        if(action === 'mypath'){
			loadRoute.user.mypath();
        }
        if(action === 'notifications'){
			loadRoute.user.notifications();
        }
        if(action === 'settings'){
			loadRoute.user.settings();
        }
    }

});
app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions);
    //hide other tabs
    $('.main-tab').each(function(){
        $(this).hide();
        //console.log('hide main tabs')
    });

    if(actions === 'main'){
        OpenPath.main.headerAnimation.init();
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
        //start with profile
        loadRoute.user.profile();
    }
});
//app routes

//user routes
loadRoute.user = {
	init : function(){
		$('#user').show();
		$('nav.main ul li').each(function(){
			$(this).removeClass('active');
		});
		$('.profileIcon').addClass('active');
		
        $('.user-tab').each(function(){
            $(this).hide();
            //console.log('hide user tabs')
        });
	},
	profile : function(){
		this.init();
		$('#profile').show();
        $('h1#profileUsername').show();

        var userProfile = new OpenPath.UserProfileView({
            model: OpenPath.user
        });

        $("#profile .usertab-single-col").html(userProfile.render().el);
	},
	editProfile : function(){
		this.init();
		$('#profile').show();
        $('h1#profileUsername').hide();
        var editUserProfile = new OpenPath.EditUserProfileView({
            model: OpenPath.user
        });
        $("#profile .usertab-single-col").html(editUserProfile.render().el);
	},
	mypath : function(){
		this.init();
		$('#mypath').show();
	},
	notifications : function(){
		this.init();
		$('#notifications').show();
	},
	settings : function(){
		this.init();
        $('#settings').show();
        $('h1#profileUsername').show();

		var userSettings = new OpenPath.UserSettingsView({
            model: OpenPath.user
        });
        $("#settings .usertab-single-col").html(userSettings.render().el);
	}
}  



// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();