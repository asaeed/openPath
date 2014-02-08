OpenPath = window.OpenPath || {};


OpenPath = {
	user : null, //TODO: get rid of next two vars
	username : null,
	email : null,
	sessionID : null,
	room : null,
	initialized : false,
	init : function(){
		/**/
		//init persona
		OpenPath.navigator.init();
		
		//set room number
		this.setRoomNumber();
		
		this.initialized = true;
	},
	setRoomNumber : function(){
		// retreives room number based on query string
		if (OpenPath.utils.getParameterByName('room') != null && OpenPath.utils.getParameterByName('room') != "") {
			OpenPath.room = OpenPath.utils.getParameterByName('room');
		}else{
			var max = 999999999999999,
				min = 1;
			OpenPath.room = Math.random() * (max - min) + min;
			console.log("No Room Number (not logged in): " + OpenPath.room);
			//TODO: talk to server through sockets to find list of taken rooms
			
		}
	},
	/**
	* Determines actions after login based on URL path.
	*/
	handleLogin : function( user ){
		var path = window.location.pathname;
		//console.log('handleLogin path = ' , path,user);
		if(path == '/'){
			// ON LOGIN: do homepage handling
			console.log('ON LOGIN: do homepage handling',this.room);
	
			//window.location = "/main" +'#'+getHash();
			if(this.room != ""){
				this.room = "?room=" + this.room;
			}
			
			//retreive hash from url
			var hash = OpenPath.utils.getHash();
			if(hash != ""){
				hash = "&h=" + hash;
			}
			//alert(hash)
			window.location = "/main" + this.room + hash;// + this.room;  //TODO - room?
			
		}else if(path == '/main'){
			// ON LOGIN: do main handling
			this.getSessionIdHash(user.email);
			//set user
			this.setUser(user);
			
		}
	},
	//sets new backbone user model
	setUser : function(user){
		var self = this;
		//user diff than returned from fetch
		
		//set user
		//this.user = new OpenPath.UserModel({id: user._id});
        this.user = new OpenPath.UserModel({_id: user._id});//good
		
		this.user.set("gravatarUrl", user.gravatarUrl);
        // The fetch below will perform GET /user/1
        // The server should return the id, name and email from the database
        this.user.fetch({
            success: function (user) {
                console.log('fetched user',user.toJSON());
				OpenPath.showGravatar();
		
            }
        });
        //this.user.save({id: user._id, name:{first:'crap',last:'face'}})
	},
	/**
	* Checks /sessions/ for hash containing session id.
	* @param email - email of user to pass to username.
	*/
	getSessionIdHash : function(email){
		var self = this,
			id = OpenPath.utils.getParameterByName('h');
				//id = OpenPath.utils.getHash();//fails
			
			
		if (id != '') {	
			// call API and check for id in database
			$.ajax({
				url: '/sessions/' + id,
				dataType:'json',
				type:'GET',
				async:false,
				success: function() {
					// session id found, proceed to display username
					console.log('session id found');

					self.startRouter();
					self.showUsername(email, id);
				},
				error: function(){
					// no id found, create new session
					self.createNewSession(email);
				}
			});
		}else{
			// no hash present, create new session
			self.createNewSession(email);
		}
	},
	/**
	* Creates new session in database.
	*/
	createNewSession : function(email){
	//	console.log('create new session', email)
		var self = this,
			sessionObj = { 
				/*
				'id': #, // id is auto-generated 
				*/
				'creator': email,
				'EventId': null,
				'startTime': OpenPath.utils.getDateTimeStamp(), 
				'privacy': "public",
				'type': "default",
				'invitedUsers': [],
				'users': [
					{ 'userId': email, 'startTime': OpenPath.utils.getDateTimeStamp(), 'endTime': "5/18/2014 18:00:00" }
				]
			};
		// call API and insert session
		//self.showUsername(email, '');

		$.ajax({
			url: '/sessions',
			dataType:'json',
			data: sessionObj,
			type:'POST',
			async:false,
			success: function(data) {
				console.log('new session created and session id = ' + data._id);

				self.startRouter();
				self.showUsername(email, data._id);
				self.addUserMessage();
			},
			error: function(data){
				console.log('there was an error creating a new session' + data);
			}
		});
	},
	//to start the router
	startRouter : function(){
		
		//TODO!!!
		//here the magjor call back !!!!
		
		//Backbone.history.start();
	},
	/**
	* Display username in interface
	*/
	showUsername : function(email, idHash){
		this.sessionID = idHash;
		this.email = email;
		 //alert("showUsername email = " + email);
		 if(email != "guest"){
			// pull username from front of email address and display in interface
			// will allow user to change in future version; will store in user data along w prefs
			this.username = email.match(/^([^@]*)@/)[1];		
		}else{
			this.username =email;
		};
		//document.querySelector("#username1").textContent = this.username;
		document.querySelector("#profileUsername").textContent = this.username;	
		
		

		console.log('showUsername',email);
	},
	/**
	 * add user message
	 */
	addUserMessage : function(){
		
		// change invitation message
		var msg = document.querySelector("#text").value;
		msg = msg.replace("USERNAME", this.username);
		//msg = msg.replace("LINK", "http://www.openpath.me?s=" + idHash);
		msg = msg.replace("LINK", "http://www.openpath.me/?room=" + this.room);
		
		
		document.querySelector("#text").value = msg;
	},
	showGravatar : function(){
		//console.log('showGravatar',this.user.attributes.gravatarUrl)
		
		$('#profile-icon').addClass('gravatar').css({
			'background':'url('+this.user.attributes.gravatarUrl+')'
		});
		$('#usermenu .userIcon').addClass('gravatar').css({
			'background':'url('+this.user.attributes.gravatarUrl+')'
		});
	
		
	}
};


