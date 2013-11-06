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
	if(route === 'events'){
        if(action === 'upcoming'){
			loadRoute.events.upcoming();
        }
		if(action === 'addNew'){
			loadRoute.events.addNew();
        }
	}
});
app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions);
	if(!OpenPath.initialized){
		OpenPath.init();//only init once
	}
	

    //hide other tabs
    $('.main-tab').each(function(){
        $(this).hide();
        //console.log('hide main tabs')
    });
	//if no actions, check if home or main
	if(!actions){
		//checks for scripts
		if(OpenPath.home){
			loadRoute.home.init();
		}
		if(OpenPath.main){
			loadRoute.main.init();
		}
	}
    if(actions === 'main'){
		loadRoute.main.init();
    }
    if(actions === 'adduser'){
        loadRoute.adduser.init();
    }
    if(actions === 'events'){
        loadRoute.events.upcoming();//TODO: on first load pick one
    }
    if(actions === 'user'){
        //start with profile
        loadRoute.user.profile();
    }
});


/**
 *  loadRoute obj
 */
//app routes
loadRoute.home = {
	init : function(){
		OpenPath.navigator.init();
		// Persona login button
		$('#loginbtn').mouseup(function() {
			navigator.id.request();
		});
	}
};
loadRoute.main = {
	init: function(){
		if(!OpenPath.main.initialized){
			OpenPath.main.init();//only init once
		}
		
		OpenPath.main.headerAnimation.init();
		//show content
        $('#videos').fadeIn();
		//console.log($(window).height(),$('#videos').height(),$('#video').height());
		
        //set section height to window height
        function resizePage(){
            $('#videos').height( $(window).height() );
            $('#main_videoplayer').height( $(window).height() );
            $('.userVideo').each(function(){
                $(this).height( $(window).height()  /  4 );
            });
            $('header.main').width( $('#main_videoplayer').width() );
        }
        //set page elements height
        window.onresize = function(e){
            resizePage();
        };
        resizePage();
	}
};
loadRoute.adduser = {
    init : function(){
		//set header width
        $('header.main').width( '100%' );
		//show content
        $('#addUser').fadeIn();

        //nav icon
        $('nav.main ul li').each(function(){
            $(this).removeClass('active');
        });
        $('.addUserIcon').addClass('active');

            // Validates and submits email inviting participant
        $('#adduserform').submit(function() {
            var email = $('#to').val();
            var isValid = OpenPath.utils.validateEmail(email);

            if(!isValid){
                $('#emailerror').modal();
            }else{
                var data = $('#adduserform').serialize(); // serialize all the data in the form 
                $.ajax({
                    url: '/email',
                    data: data,
                    dataType:'json',
                    type:'POST',
                    async:false,
                    success: function(data) {        
                        for (key in data.email) {
                            alert(data.email[key]);
                        }
                    },
                    error: function(data){}
                });
            };
            return false;
        });
    }
};
//events routes
loadRoute.events = {
    init : function(){
        //set header width
		$('header.main').width( '100%' );
		//show content
        $('#events').fadeIn();
        //nav icon
        $('nav.main ul li').each(function(){
            $(this).removeClass('active');
        });
        $('.eventsIcon').addClass('active');
		//clear sub nav
		$('#eventsmenu nav.subnav ul li').each(function(){
			$(this).find('a').removeClass('active');
		});
    },
    nearby : function(){
        //todo
    },
    upcoming : function(){
        //todo
		this.init();
		//empty and show list
		$('#eventslist').html('').show();
		//hide form
		$('#addEvent').hide();
		
		//set header copy
		$('#eventsmenu h2').html('List of Events');
		//highlight menu item
		$('#eventsmenu a.upcoming').addClass('active');
        //clear list
        $('#eventslist').html('');
        var evCollection = new OpenPath.EventsView();
    },
	addNew : function(){
		this.init();
		//show form
		$('#addEvent').show();
        //hide list
        $('#eventslist').hide();
		
        
		
		//set header copy
		$('#eventsmenu h2').html('Add New Event');
		//highlight menu item
		$('#eventsmenu a.addNew').addClass('active');
		var AddNewEvent = new OpenPath.AddEventView();
		
		$("#addEvent").html(AddNewEvent.render().el);
	}
};
//user routes
loadRoute.user = {
	init : function(){
        //set header width
		$('header.main').width( '100%' );
		//show content
		$('#user').fadeIn();
        //nav icon
		$('nav.main ul li').each(function(){
			$(this).removeClass('active');
		});
		$('.profileIcon').addClass('active');
		//correct tab
        $('.user-tab').each(function(){
            $(this).hide();
        });
	},
	profile : function(){
		this.init();
		console.log('profile')
		$('#profile').fadeIn();
        $('h1#profileUsername').show();

        var userProfile = new OpenPath.UserProfileView({
            model: OpenPath.user
        });

        $("#profile .usertab-single-col").html(userProfile.render().el);
	},
	editProfile : function(){
		this.init();
		$('#profile').fadeIn();
        $('h1#profileUsername').hide();
        var editUserProfile = new OpenPath.EditUserProfileView({
            model: OpenPath.user
        });
        $("#profile .usertab-single-col").html(editUserProfile.render().el);
	},
	mypath : function(){
		this.init();
		$('#mypath').fadeIn();
	},
	notifications : function(){
		this.init();
		$('#notifications').fadeIn();
	},
	settings : function(){
		this.init();
        $('#settings').fadeIn();
        $('h1#profileUsername').show();

		var userSettings = new OpenPath.UserSettingsView({
            model: OpenPath.user
        });
        $("#settings .usertab-single-col").html(userSettings.render().el);
	}
}  



// Start Backbone history a necessary step for bookmarkable URL's
Backbone.history.start();