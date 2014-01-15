OpenPath = window.OpenPath || {};

/**
 * rtc obj
 */
OpenPath.rtc = {};
OpenPath.rtc.PeerConnection = window.PeerConnection || window.webkitPeerConnection00 || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
//var server = "ws://www.walking-productions.com:8001/"; 
OpenPath.rtc.server= "ws://www.openpath.me:8001/";


OpenPath.main = {
	initialized : false,
	init : function(){
		this.presenterVideo = document.getElementById('presenterVideo');
		this.userVideos = document.getElementById('userVideos');
		
		
		this.maxNumberOfVideos = 5;
		this.videos = [];
		
		//get room, again? yes, cuz passing from login
		if (OpenPath.utils.getParameterByName('room') != null && OpenPath.utils.getParameterByName('room') != "") {
			this.room = OpenPath.utils.getParameterByName('room');
		}else{
			this.room = 1;
			console.log("No Room Number: " + this.room);
			
		}
		
		//create videos
		for(var i = 0; i<this.maxNumberOfVideos;i++){
			var newVideo =  new OpenPath.Video('video_'+i)
			this.videos.push( newVideo );
			
			if(i === 0){
				this.presenterVideo.appendChild( newVideo.getMarkup() );
			}else{
				this.userVideos.appendChild( newVideo.getMarkup() );
			}
		}
		//attach videos //TODO: can be moved for when user actually connects
		
		
		
		
		this.connect();
		//this.initControls();

		//turn on videos tab
        //$('#videos').addClass('active');

		//try to geolocate user
		//OpenPath.maps.geolocate("self_video");//target video. String used to determine which thumb map to target
		//init chat
	    OpenPath.chat.init(); 

		this.initialized = true;
	},

	//below needs work

	/**
	 * Assigns behaviors to interface controls.
	 */
	initControls : function(){
		var self = this;


		$('#logout').mouseup(function() {
			navigator.id.logout('button pressed');
		});

		// User Icon - Right Column Main Screen
		$('.userVideo').mouseenter(function(event) {
			$(this).find(".usermeta").fadeIn("slow");
			$(this).find(".username").fadeIn("slow");
		});
		$('.userVideo').mouseleave(function(event) {
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
		/**
		 * video to main
		//off until sound and meta replacement hooked up
		function videoToMain(id){
			var tempsrc = document.getElementById('main_videoplayer').src;
			document.getElementById('main_videoplayer').src = document.getElementById( id ).src;
			document.getElementById( id ).src = tempsrc;

			var tempvideo = main_video;
			main_video = other_video;
			other_video = tempvideo;
		}
		$('#self_videoplayer').dblclick(function(event) {
			videoToMain('self_videoplayer');
		});
		$('#other_videoplayer2').dblclick(function(event) {
			videoToMain('other_videoplayer2');
		});
		$('#other_videoplayer3').dblclick(function(event) {
			videoToMain('other_videoplayer3');
		});
		$('#other_videoplayer4').dblclick(function(event) {
			videoToMain('other_videoplayer4');
		});
		*/
		
		
		// Main Navigation Tabs
		$("a.logo").tooltip({placement:'bottom'});
		$("nav.main a").tooltip({placement:'bottom'});


	},
	/**
 	 * Starts video, chat, and geolocation
  	 */
  	connect : function(){ 
		var self = this;
		
		
		if (OpenPath.rtc.PeerConnection) {
   			rtc.createStream({"video": true, "audio": true}, function(stream) {
			document.getElementById('self_videoplayer').src = URL.createObjectURL(stream);
				//attach to top left corner
				rtc.attachStream(stream, self.videos[0]._id);
   			});
 		} else {
   			alert('Sorry, your browser is not supported');
 		}

 		if(this.room !== null){
			rtc.connect(OpenPath.rtc.server, this.room);
			console.log("this.room: " + this.room);
		}
	
		//attach other users streams 
 		rtc.on('add remote stream', function(stream, socketId) {
   			console.log("Remote stream: " + stream + " " + socketId);

			if (videos.length < OpenPath.main.max_num_videos) {
				OpenPath.main.videos.push( new OpenPath.Video(stream, socketId) );
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
	
	
	if (main_video == null) {
   	  	rtc.attachStream(stream, 'main_videoplayer');
		main_video = this;
		this.domId = 'main_videoplayer';
		videos.push(this);
		console.log("Adding video as main_videoplayer");
	} else if (other_video == null) {
		rtc.attachStream(stream, 'other_videoplayer2');
		other_video = this;	
		this.domId = 'other_videoplayer2';
		videos.push(this);
		console.log("Adding video as other_videoplayer2");
	} else {
		console.log("No room for more videos");
	}
}






