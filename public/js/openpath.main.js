OpenPath = window.OpenPath || {};

//old globals 
//TODO: namespace 

  var map1, map1marker, map2, map2marker;
  var eventsMap, eventsmapmarker;
  var myPathMap, myPathMapMarker;
  var geocoder;

  //var room = 1;
  var max_num_videos = 2;
  //var server = "ws://www.walking-productions.com:8001/"; 
  var server = "ws://www.openpath.me:8001/";
  var main_video = null;
  var other_video = null;
  var videos = [];
  var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
  console.log(PeerConnection);    
  



OpenPath.main = {
	init : function(){

		//TODO: clean below and add to name space
		console.log('openPath.main.init',this) 
		
		//room
		if (getParameterByName('room') != null && getParameterByName('room') != "") {
			room = getParameterByName('room');
			console.log("Room Number: " + room);
		}else{
			room = 1;
		}
		//this = OpenPath.main
		this.initControls();
		this.initUser();
		//initEventsMap(); //**deprecated**/
		//initEventsList(); //replaced

		OpenPath.user.init();
		OpenPath.events.init();
	},
	/**
	 * Assigns behaviors to interface controls.
	 */
	initControls : function(){
		var self = this;

		// Main Navigation Tabs
		$('#mainnav a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
			
			OpenPath.user.onMenuChange();
			
			self.resetMaps();
		})
		$("#mainnav a").tooltip({placement:'bottom'});

		$('#usernav a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
			
			OpenPath.user.onMenuChange();
			
			self.resetMaps();
		})
		$('#logout').mouseup(function() {
			navigator.id.logout('button pressed');
		});
		// User Icon - Right Column Main Screen
		$('.user').mouseenter(function(event) {
			$(this).find(".usermeta").fadeIn("slow");
			$(this).find(".username").fadeIn("slow");
		});
		$('.user').mouseleave(function(event) {
			var isShowing = $(this).find(".usermeta").hasClass("usermetashowing");
			if(!isShowing){
				$(this).find(".usermeta").fadeOut("slow");
				$(this).find(".username").fadeOut("slow");
			}
		});	
		
		// Events
		$('#starttime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		$('#endtime').datetimepicker({
		    language: 'en',
		    pick12HourFormat: true
		});
		
		$('.icon-map-marker').click(function(event) {
			$(this).parent().parent().addClass('usermetashowing');
			$(this).parent().parent().find('.usermap').fadeIn("slow");
			$(this).parent().parent().find('.userlocation').fadeIn("slow");

			$(this).addClass('closebtn');	
			event.stopPropagation();

			self.resetMaps();
		});
		$('.icon-remove').click(function(event) {
			$(this).parent().parent().parent().removeClass('usermetashowing');
			$(this).parent().parent().fadeOut("slow");
			$(this).parent().parent().parent().find('.usermap').fadeOut("slow");
			$(this).parent().parent().parent().find('.userlocation').fadeOut("slow");
			$(this).parent().removeClass('closebtn');
			event.stopPropagation();
		});
		$('#other_videoplayer').dblclick(function(event) {
			var tempsrc = document.getElementById('main_videoplayer').src;
			document.getElementById('main_videoplayer').src = document.getElementById('other_videoplayer').src;
			document.getElementById('other_videoplayer').src = tempsrc;

			var tempvideo = main_video;
			main_video = other_video;
			other_video = tempvideo;
			
		});
		// Validates and submits email inviting participant
		$('#adduserform').submit(function() {
			var email = $('#to').val();
			var isValid = validateEmail(email);

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

	},
	/**
 	 * Starts video, chat, and geolocation
  	 */
  	initUser : function(){
		var target = "self_video"; // target video. String used to determine which thumb map to target
		if (PeerConnection) {
	   			rtc.createStream({"video": true, "audio": true}, function(stream) {
				document.getElementById('self_videoplayer').src = URL.createObjectURL(stream);
	     				rtc.attachStream(stream, 'self_videoplayer');
	   			});
	 		} else {
	   			alert('Sorry, your browser is not supported');
	 		}
	 		console.log("room: " + room);
	 
		rtc.connect(server, room);

	 		rtc.on('add remote stream', function(stream, socketId) {
	   			console.log("Remote stream: " + stream + " " + socketId);

			if (videos.length < max_num_videos) {
				var newVideo = new initVideo(stream, socketId);
			}
	 		});
	 
		rtc.on('disconnect stream', function(socketId) {
			console.log('disconnect stream ' + socketId);
			var domId = null;
			for (var i = 0; i < videos.length; i++) {
				if (videos[i].socketId == socketId) {
					if (videos[i] == main_video) { 
						main_video = null; 
						document.getElementById('main_videoplayer').src = "";
						console.log("main_video");
					}
					else if (videos[i] == other_video) { 
						other_video = null; 
	                    document.getElementById('other_videoplayer').src = "";
						console.log("other_video");
					}
					videos.splice(videos[i]);

					console.log("removed video");
					break;
				}	
			}
	 		});

		rtc.on('main_video_socketid', function(data) {
			console.log(data.socketid);
		});

		// initialize remainder of interface
		initUserMap(target);
		initMyPathMap();
	    initChat();

		//deleteData('events');
		//deleteData('users');
		//deleteData('sessions');	
		
		console.log('initUser.target = ' + target);
	},
	/**
  	 * Hack to allow Google Maps to work with Bootstrap
  	 */
  	resetMaps : function (){
		
		google.maps.event.trigger(eventsMap, 'resize');
		eventsMap.setCenter(eventsmapmarker.position);
				
		google.maps.event.trigger(map1, 'resize');
	    map1.setCenter(map1marker.position);

		google.maps.event.trigger(map2, 'resize');
	    map2.setCenter(map2marker.position);

		google.maps.event.trigger(myPathMap, 'resize');
		myPathMap.setCenter(myPathMapMarker.position);

	}
};

  //OLD

	// Bootstrap interface calls through JQuery
    $(document).ready(function() {
		//init namespace obj
		OpenPath.init();
	
	});
		
/*
		// determines tab to display based on hash
		var url = document.location.toString();
		if (url.match('#')) {
		    $('#mainnav a[href=#'+url.split('#')[1]+']').tab('show') ;
		} 

		// Change hash for page-reload
		$('#mainnav a').on('shown', function (e) {
		    window.location.hash = e.target.hash;
		})
*/


  
/**
* Deletes data from mongodb
* @param path can be events, users, sessions
*/
function deleteData(path){
	// get events list from API
	$.ajax({
		url: '/'+path,
	    dataType:'json',
	    type:'GET',
	    async:false,
		success: function(list) {
			var evt;
			for(var i in list){
				evt = list[i];

				// start deletion
				$.ajax({
					url: '/'+path+'/' + evt._id,
				    dataType:'json',
				    type:'DELETE',
				    async:false,
					success: function(list) {
						console.log(path + " " + evt._id + "deleted");
				    },
				    error: function(list){
						console.log(path + " not found");
					}
				});
				// end deletion
			}
	    },
	    error: function(list){
			console.log("users not found");
		}
	});
}
/**
* Parses and displays events
* @param array of json objects
* deprecated
function updateUser(lat, long){
	$.ajax({
		url: '/users/51c99e80b9cb021705000001',
		data:{
			  'name': "Rich Hauck",
			  'grade': "6-8",
			  'Interests': ["robotics", "coding", "archaeology"],
			  'HomeLocation': [lat, long],
			  'Locations': [],
			  'EventsInvitedTo': [],
			  'SessionsInvitedTo': [],
			  'EventsCreated': [],
			  'SessionsCreated': []	
		},
	    dataType:'json',
	    type:'PUT',
	    async:false,
		success: function(data) { 
			console.log('user updated');
	    },
	    error: function(data){
			console.log('user not updated');
		}
	});
}
*/

  /**
  *
  */
function initVideo(stream, socketId) {
	this.stream = stream;
	this.socketId = socketId;
	this.domId = null;

	if (main_video == null) {
   	  	rtc.attachStream(stream, 'main_videoplayer');
		main_video = this;
		this.domId = 'main_videoplayer';
		videos.push(this);
		console.log("Adding video as main_videoplayer");
	} else if (other_video == null) {
		rtc.attachStream(stream, 'other_videoplayer');
		other_video = this;	
		this.domId = 'other_videoplayer';
		videos.push(this);
		console.log("Adding video as other_videoplayer");
	} else {
		console.log("No room for more videos");
	}
}
  /**
  * Retreives geolocation for display within map.
  */
  function initUserMap(target) {
	  console.log('initUserMap.target = ' + target);
	  // Try HTML5 geolocation
	  if(navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position) {
			var targetMap;
	     	var pos = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
			//updateUser(position.coords.latitude,  position.coords.longitude);  //fake func anyway
			var mapOptions = {
				zoom: 6,
				center: pos,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				mapTypeControl: true,
				mapTypeControlOptions: {
					style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
					position: google.maps.ControlPosition.RIGHT_BOTTOM
				},
			};
			if(target == "other_video"){
				map2 = new google.maps.Map(document.getElementById('usermap2'), mapOptions);

				map2marker = new google.maps.Marker({
					position: pos,
					map: map2,
					title: ''
				});
				map2.setCenter(pos);

				// get and display street address 
				codeLatLng(pos, "#userlocation2");
				targetMap = map2;
			}else{
				map1 = new google.maps.Map(document.getElementById('usermap1'), mapOptions);

				map1marker = new google.maps.Marker({
					position: pos,
					map: map1,
					title: ''
				});
				map1.setCenter(pos);

				// get and display street address 
				codeLatLng(pos, "#userlocation1");
				targetMap = map1;
			}			
	    }, function() {
	      handleNoGeolocation(true, targetMap);
	    });
	  } else {
	    // Browser doesn't support Geolocation
	    handleNoGeolocation(false, targetMap);
	  }
	};  
	/**
	* Handles geolocation error.
	*/
	function handleNoGeolocation(errorFlag, map) {
	  if (errorFlag) {
	    var content = 'Error: The Geolocation service failed.';
	  } else {
	    var content = 'Error: Your browser doesn\'t support geolocation.';
	  }
	  var nycPos = new google.maps.LatLng(40.7142, -74.0064);
	  var options = {
	    map: map,
		center: nycPos,
	    position: nycPos,
	    content: content
	  };
	}
  /**
  * Initializes Map displaying local events
  */
  function initEventsMap(){

	var pos = new google.maps.LatLng(40.7142, -74.0064);
	var options = {
	    map: eventsMap,
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
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
	  };
	  eventsMap = new google.maps.Map(document.getElementById('eventsmap'), options);
	  eventsmapmarker = new google.maps.Marker({
	      position: options.center,
	      map: eventsMap,
	      icon: 'img/marker.png',
		  center: options.center
	  });	
  }
  /**
  * Initializes Map displaying local events
  */
  function initMyPathMap(){

	var pos = new google.maps.LatLng(41.8500, -87.6500);
	var options = {
	    map: myPathMap,
		zoom: 6,
		mapTypeId: google.maps.MapTypeId.ROADMAP,
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
	  };
	  myPathMap = new google.maps.Map(document.getElementById('mypathmap'), options);
	  myPathMapMarker = new google.maps.Marker({
	      position: options.center,
	      map: myPathMap,
	      icon: 'img/marker.png',
		  center: options.center
	  });	
  }
  /**
  * Returns reverse-geocoded location
  * @param pos		Lat/Long object
  * @param target	target HTML element to write to
  */
  function codeLatLng(pos, target) {
	  geocoder = new google.maps.Geocoder();
	  geocoder.geocode({'latLng': pos}, function(results, status) {
	    if (status == google.maps.GeocoderStatus.OK) {
	      if (results[1]) {
			$(target).html(results[1].formatted_address);
	      } else {
	        console.log('No results found');
	      }
	    } else {
	      console.log('Geocoder failed due to: ' + status);
	    }
	  });
	}
  /**
  * Sanitizes user message in chat window.
  */
  function sanitize(msg) {
    return msg.replace(/</g, '&lt;');
  }
  /**
  * Creates chat window.
  */
  function initChat() {
    var input = document.getElementById("chatinput");

    input.addEventListener('keydown', function(event) {
        if(input.value != ''){
            var key = event.which || event.keyCode;
            if (key === 13) {
				var message = username + ": " + input.value;	
                rtc._socket.send(JSON.stringify({
                    "eventName": "chat_msg",
                    "data": {
                    "messages": message,
                    "room": room
                }
                }));
                addToChat(username, input.value);
                input.value = "";
            }
        }
      
    }, false);
    rtc.on('receive_chat_msg', function(data) {
	  console.log("initChat: username = " + username);
      addToChat(username, data.messages);
    });
    
    rtc.on('main_video_socketid', function(data) {
    	console.log(data.socketid);
    	
    });
  }
  /**
  * Adds user's message to chat window.
  */
  function addToChat(user, msg) {
	console.log("addToChat("+user+")")
    var chatwindow = document.getElementById('chatwindow');
    var chatmessages = document.getElementById('chatmessages');
    msg = sanitize(msg);
    msg = '<li class="user1"><span>'+ user +'</span>: ' + msg + '</li>';
    chatmessages.innerHTML += msg;
    chatwindow.scrollTop = chatwindow.scrollHeight;
  }


