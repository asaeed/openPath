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
    /**
     * user route
     */
    if(route === 'user'){
        //hide other tabs
        $('.user-tab').each(function(){
            $(this).hide();
            //console.log('hide user tabs')
        });

        if(action === 'profile'){
            $('#profile').show();
            //$('#profile .editView').hide();
            //$('#profile .displayView').show();
            $('h1#profileUsername').show();

            var userProfile = new OpenPath.UserProfileView({
                model: OpenPath.user
            });

            $("#profile .usertab-single-col").html(userProfile.render().el);
        }
        if(action === 'edit-profile'){
            $('#profile').show();
            //$('#profile .displayView').hide();
            //$('#profile .editView').show();
            $('h1#profileUsername').hide();

            var editUserProfile = new OpenPath.EditUserProfileView({
                model: OpenPath.user
            });

            $("#profile .usertab-single-col").html(editUserProfile.render().el);
        }
        if(action === 'mypath'){
            $('#mypath').show();
        }
        if(action === 'notifications'){
            $('#notifications').show();
        }
        if(action === 'settings'){
            $('#settings').show();
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
        $('#user').show();
        $('.user-tab').each(function(){
            $(this).hide();
            //console.log('hide user tabs')
        });
        //start with profile
        $('#profile').show();


    }
});

// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();