OpenPath Set-up & Implementation


====================================================================================
Building an Instance:

	OpenPath is a Node site built on Express.js.  Ideally, after pulling it down, one should just be able to do an 'npm install' and install all the needed node modules to get it up and running.  Of course, both Node and Mongodb must be installed globally (I think here, homebrew would be your best bet though, honestly, I haven't tried it for these two) [note: brew was used to install OpenSSL tools on the Mac in order to create SSL keys and certificates @see http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/]  

	Notes on specific node modules:

  	email.js :  
	  	Since you don't want to have email passwords pushed to the github repo, create 
		a config file to store email login/password one level up from the project root.  
		Do a git pull, be sure to create a file called "config.js", and put it in the same location 
		as the main openPath project folder.  Here are its contents:

		// begin config.js
		var config = {};

		config.email = {};
		config.email.user = "username";
		config.email.password = "password";
		config.email.host = "smtp.gmail.com";

		module.exports = config;
		// end config.js

  	forever.js : 
	  	It's also probably a good idea to install forever.js globally, especially on a server environment.

	express3-handlebars:
		This is our templating engine.  It has great partial support as well as both server side and client side templating.  All of the templates are in the 'root/views' folder and this could be a bit confusing (and could/should be reorganized). But to tell the difference between a client side and server side template is easy : 'script id="..." type="text/x-handlebars-template"' starts a client side and no script tag is a server side. In a few cases, the same file contains both.  ¡¡ NOTE !!: '\{{ ..... }}' the client side templates require a '\' before starting a handlebars '{{' so that the server knows to escape them.
		Both 'intro.handlebars' (the logged out intro page) & 'home.handlebars' (the whole site, once you are authenticated) inherit from 'root/views/layouts/main.handlebars'.

	passport.js :
		We are using this in place of Persona so that eventually we can hook up facebook, google, and maybe twitter oauths but for now we are just using local email and password sign up and login.  The config file for passport is located in the root and called 'config.js' there are stubs for fb & google app keys etc but those aren't hooked up yet.

	mongoose:
		As it claims, mongoose is a super elegant way to model your mongodb models.  All mongoose models are in 'root/models'.

	socket.io:
		Being both a client side and server side library, there are references to socket through out the code base but mostly in 'utils/socketHandler.js' which handles the server side socket events and 'public/js/openpath.js' which handles the client side socket events.  'public/js/classes/user.js' has a couple of socket events as well.

	*Caveats : Less & Less-middleware were both at one point working and one was used to replace the other when it stopped working.  Now neither are working and the issue has not been looked into recently.  I use (for mac) the app "LiveReload" to compile the less at the moment.

====================================================================================
Server-side Overview
	
	'app.js' starts things off with by creating both a 'http' and 'https' server, hoooking up to mongoose/mongodb, setting up passport, openSSL config etc and all the configurations for Express.

	'routes/routes.js', at the moment, contains the whole API for the site pulling in all the models and their methods (see above in the mongoose section) as well as 'utils/roomHandler.js' & 'utils/socketHandler.js'.  There is much to do here still and could probably be separated into smaller files.

	roomHandler:
		This file contains the logic to either create a new room in the database or join and existing room (or event - all events having a related room) by checking the request query and request session for existing room and event properties.  If there are none, a new room is created and the user will be alone in that room until he/she asks someone to join or joins another room or event.  *TODO: make the leave room button create a new room.

	socketHandler: 
		This file determines which users are in which room, when data is received (such as location, peer id, stream... ) and then it passes that data to the other users who are in the room creating the connection between users.

====================================================================================
Front-end Overview

	All markup, as stated above, is in handlebars files in the 'views' folder.  'layouts/main.handlerbars' includes most of the client side templates at the moment though I began moving some of the relevant client side templates in the same files and their corresponding server side templates (e.g. editProfile.handlebars).

	All styles, images, and JavaScript are in the 'public' folder.  

	Styles:
		We are using LESS with the Lesshat mixin library (which is very nice but has a rounded corners issue) as well as Eric Meyer's reset.css.  The 'public/css/modules' folder contains the styles for each section of the site and, hopefully, is pretty straight forward. All the modules are includes in 'styles.less' which contains most of the global styles as well as the hierarchy of the site including the fork between 'intro' and 'home'.  All is compiled into 'styles.css'.

	JavaScript:

	Libraries: 
	Peer.min.js is the WebRTC wrapper library we are using.  We now host it ourselves (rather than using the cdn) now that we are running on SSL.  Note that we need to include the secure option (@see openpath.js).
	Handlebars... is the client side templating engine.

	ui.js:
	Here, most of the ui and dom manipulation methods reside.  Tooltips, modals, privacy policy clicks, etc.  Both home and intro share this file.

	utils.js:
	self explainatory

	intro.js:
	Dom code just for the intro page.

	router.js:
	This is a meaty script that handles all the known routes for each 'page' in our one page application.  Though some methods are pretty sparce, others include initiation of Handlebars templates and the functions can get pretty complex, particularly in the events pages.  The ability to create OOP instances inside these methods relies on minimal (pretty much just stubs at this point) MVC helper classes.

	Classes:

	MVC:
	Though this folder may look like it contains a lot, it is really just the 'super/mvc.js' that matters.  The other files are there in case we get to the point where separate methods really stand out but for now inheriting any of them pretty much gives you the same methods.  It's really just to clarify what the new class you are creating actually is.  The main methods being used are 'get/got' and 'post/posted'.  It is being used, pretty much, to create a sub class (in most cases inline in the router.js ) with a url property.  The 'get' method is called and a 'got' method is declared, overriding the super's 'got' method where data manipulation is preformed.  The same goes for 'post' and 'posted', where 'posted' overrides the super's 'posted' method.

	eventsController.js:
	This is a small class that is shared between all the events pages in order to minimize the API requests from the client.  If it's instances data property is empty the route landed will then make a 'get' call and fill that property.

	user.js:
	Currently, the only server session property being served on log in is the user email which resides in a hidden input in home.handlerbars.  User.js replicates the server model (to the extent that properties should be on the client side) and with the user email 'gets' the rest of the properties from the server.  Once gotten, this class initializes user location, user media, checks if the user is the presenter, handles the allow popup.

	peer.js:
	This class is a subclass of user.js and is there to handle 'other' users - not the current user who is navigating the site.

	video.js:
	This is a helper class that is instantiated from user.js.  This handles all of the clicks in the 'user meta' section in each video module as well as rendering of the video, maps, name etc.

	Openpath.js:
	This is the main meat of the main video's page. It handles the connection between users and the chat.  It instantiates user.js and peer.js, and it handles the socket.io and peer.js communications.  It also kicks off the site and kicks off the routing in router.js.  Being the the videos are always 'on' no matter where you navigate in the site, this has to be the case.





