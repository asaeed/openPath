OpenPath = window.OpenPath || {};

//old globals 
//TODO: namespace 
  //var room = 1;
  var max_num_videos = 2;
  //var server = "ws://www.walking-productions.com:8001/"; 
  var server = "ws://www.openpath.me:8001/";
  var main_video = null;
  var other_video = null;
  var videos = [];


var PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;

OpenPath.main = {
	init : function(){

		//this = OpenPath.main
		this.connect();
		this.initControls();
		this.nav();

		//try to geolocate user
		OpenPath.maps.geolocate("self_video");// target video. String used to determine which thumb map to target
		//init chat
	    OpenPath.chat.init();

		//initMyPathMap();//maybe deprecating soon
		//initEventsMap(); //**deprecated**/
		//initEventsList(); //replaced


		//TODO on menu change
		this.addUserForm();


		//OpenPath.user.init();
		//OpenPath.events.init();
	},
	/**
	 * Assigns behaviors to interface controls.
	 */
	initControls : function(){
		var self = this;


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
		

		
		$('.icon-map-marker').click(function(event) {
			$(this).parent().parent().addClass('usermetashowing');
			$(this).parent().parent().find('.usermap').fadeIn("slow");
			$(this).parent().parent().find('.userlocation').fadeIn("slow");

			$(this).addClass('closebtn');	
			event.stopPropagation();

			OpenPath.maps.resetMaps();
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




	},
	/**
 	 * Starts video, chat, and geolocation
  	 */
  	connect : function(){ 
		
		if (PeerConnection) {
   			rtc.createStream({"video": true, "audio": true}, function(stream) {
			document.getElementById('self_videoplayer').src = URL.createObjectURL(stream);
     			rtc.attachStream(stream, 'self_videoplayer');
   			});
 		} else {
   			alert('Sorry, your browser is not supported');
 		}

 		//console.log("room: " + OpenPath.room);
 		if(OpenPath.room !== null)
		rtc.connect(server, OpenPath.room);

 		rtc.on('add remote stream', function(stream, socketId) {
   			console.log("Remote stream: " + stream + " " + socketId);

			if (videos.length < max_num_videos) {
				var newVideo = new OpenPath.Video(stream, socketId);
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

	},
	nav : function(){
		$('.mainheader').show().slideDown();
		// Main Navigation Tabs
		$('#mainnav a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
			
			OpenPath.user.onMenuChange();
			
			OpenPath.maps.resetMaps();
		})
		$("#mainnav a").tooltip({placement:'bottom'});

		$('#usernav a').click(function (e) {
			e.preventDefault();
			$(this).tab('show');
			
			OpenPath.user.onMenuChange();
			
			OpenPath.maps.resetMaps();
		});
	},
	addUserForm : function(){
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
  * OpenPath.Video class
  */
OpenPath.Video = function (stream, socketId) {
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







