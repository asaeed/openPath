OpenPath Set up & Implementation

1. Building an instance:

  OpenPath is a Node site built on Express.js.  Idealy, after pulling it down, one should just be able to do an 'npm install' and install all the needed node modules to get it up and running.  Of course, both Node and Mongodb must be installed globally (I think here, homebrew would be your best bet though, honestly, I haven't tried it for these two) [note: brew was used to install OpenSSL tools on the mac in order to create SSL keys and certificates @see http://greengeckodesign.com/blog/2013/06/15/creating-an-ssl-certificate-for-node-dot-js/]  

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
		This is our templating engine.  It has great partial support as well as both server side and client side templating.  All of the templates are in the 'root/views' folder and this could be a bit confusing (and could/should be reorganized). But to tell the difference between a client side and server side template is easy : '<script id="..." type="text/x-handlebars-template">' starts a client side and no script tag is a server side. In a few cases, the same file contains both.  *NOTE: '\{{ ..... }}' the client side templates require a '\' before starting a handlebars '{{' so that the server knows to escape them.
		Both 'intro.handlebars' (the logged out intro page) & 'home.handlebars' (the whole site, once you are authenticated) inherit from 'root/views/layouts/main.handlebars'.

	passport.js :
		We are using this in place of Persona so that eventually we can hook up facebook, google, and maybe twitter oauths but for now we are just using local email and password sign up and login.

	mongoose:
		As it claims, mongoose is a super elegant way to model your mongodb models.  All mongoose models are in 'root/models'.

	socket.io:
		Being both a client side and server side library, there are references to socket through out the code base but mostly in 'utils/socketHandler.js' which handles the server side socket events and 'public/js/openpath.js' which handles the client side socket events.  'public/js/classes/user.js' has a couple of socket events as well.

  *Caveats : Less & Less-middleware were both at one point working and one was used to replace the other when it stopped working.  Now neither are working and the issue has not been looked into recently.  I use (for mac) the app "LiveReload" to compile the less at the moment.


====================================================================================

====================================================================================

