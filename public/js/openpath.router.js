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


app_router.on('route:defaultRoute', function(actions) {
    console.log('route:',actions,window.location.href);


    //set room
	//get room, again? yes, cuz passing from login
	if (OpenPath.utils.getParameterByName('room') !== null && OpenPath.utils.getParameterByName('room') != "") {
		OpenPath.room = OpenPath.utils.getParameterByName('room');
		//gettin room - could be called on either home or main
		console.log('getting room')

		OpenPath.isCreatorOfRoom = false;
	}else{

		if(actions === null){
			// you are on home page
		}else{
			//create random room #
			var max = 999999999999999,
				min = 1;
			OpenPath.room = Math.random() * (max - min) + min;

			OpenPath.room = Math.round(OpenPath.room);
			console.log("No Room Number (home): " + OpenPath.room);
			//TODO: talk to server through sockets to find list of taken rooms
			//TODO create "event" or "session"  //set user as creator
			OpenPath.isCreatorOfRoom = true;
		}
	}

	if(actions !== null)
    //clean up url pass room
    window.history.pushState({"html":'',"pageTitle":'boo'},"", window.location.origin +window.location.pathname +'?room='+OpenPath.room);

	if(!OpenPath.initialized){
		OpenPath.init();//only init once
	}
	
	console.log('default route')
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
 *  route:loadView
 */
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
    /**
     * events route
     */
	if(route === 'events'){
        if(action === 'upcoming'){
			loadRoute.events.upcoming();
        }
		if(action === 'addNew'){
			loadRoute.events.addNew();
        }
		if(action === 'invite'){
			//loadRoute.events.invite();
			
			//ridirect cus above is created in event.js view
			loadRoute.events.upcoming();
			
        }
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
			OpenPath.main.init();//only init once, load user videos
		}else{
			//show content
	        $('#videos').fadeIn();
	        $('header.main').width( $( OpenPath.main.videos[0].ele ).width() );
		}
	}
};
loadRoute.adduser = {
    init : function(){
		
		//TODO make BB view
		
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
        //TODO
    },
    upcoming : function(){
        //todo
		this.init();
		//empty and show list
		$('#eventslist').html('').show();
		//hide add form & invite form
		$('#addEvent').hide();
		$('#inviteToEvent').hide();
		
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
		//hide list & invite form
		$('#eventslist').hide();
		$('#inviteToEvent').hide();

		//set header copy
		$('#eventsmenu h2').html('Add New Event');
		//highlight menu item
		$('#eventsmenu a.addNew').addClass('active');
		
		var AddNewEvent = new OpenPath.AddEventView();
		//render
		$("#addEvent").html(AddNewEvent.render().el);
	},
	/*
	invite : function(){
		this.init();
		
		//show invite
		$('#inviteToEvent').show();
		//hide form
		$('#addEvent').hide();
		//hide list
		$('#eventslist').hide();
		
		//set header copy
		$('#eventsmenu h2').html('Invite');
		
		var inviteToEvent = new OpenPath.inviteToEventView();
		//render
		$("#inviteToEvent").html(inviteToEvent.render().el);
	}*/
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