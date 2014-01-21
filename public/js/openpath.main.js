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
		var self = this;
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

			//attach videos //TODO: can be moved for when user actually connects??
			if(i === 0){
				this.presenterVideo.appendChild( newVideo.getMarkup() );
			}else{
				this.userVideos.appendChild( newVideo.getMarkup() );
			}
		}
		
		//show content
        $('#videos').fadeIn();
		//console.log($(window).height(),$('#videos').height(),$('#video').height());
		
        //set section height to window height
        function resizePage(){
			var newWindowHeight = $(window).height();
			
			for(var i = 0; i<self.videos.length;i++){
				if(i === 0){
					//resize main vid
					self.videos[i].ele.style.height = newWindowHeight + 'px';
				}else{
					//resize user vids
					self.videos[i].ele.style.height = newWindowHeight /  4  + 'px';
				}
			}
            $('#videos').height( newWindowHeight );
            $('header.main').width( $( self.videos[0].ele ).width() );
        }
        //set page elements height
        window.onresize = function(e){
            resizePage();
        };
        resizePage();
		
		
		//testing maps
		this.videos[1].loadMap();
		
		
		this.connect();

		//try to geolocate user
		//OpenPath.maps.geolocate("self_video");//target video. String used to determine which thumb map to target
		//init chat
	    OpenPath.chat.init(); 
		
		
		//misc dom stuff
		$('#logout').mouseup(function() {
			navigator.id.logout('button pressed');
		});

		// Main Navigation Tabs
		$("a.logo").tooltip({placement:'bottom'});
		$("nav.main a").tooltip({placement:'bottom'});
		
		
		//set initialized var
		this.initialized = true;
	},
	/**
 	 * Starts video, chat, and geolocation
  	 */
  	connect : function(){ 
		var self = this;
		var vidIndex = 1;//0 taken by main
		
		if (OpenPath.rtc.PeerConnection) {
			console.log(this.room, 'coo')
			//TODO: determine if you're hosting event  and fork
			
   			rtc.createStream({"video": true, "audio": true}, function(stream) {
				document.getElementById(self.videos[vidIndex]._id).src = URL.createObjectURL(stream);
				//attach to top left corner
				rtc.attachStream(stream, self.videos[vidIndex]._id);
				self.videos[vidIndex].setUserName('user you');
				vidIndex ++;
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
			if(vidIndex < self.videos.length){
	   			console.log("user joined:"+vidIndex+" Remote stream: " + stream + " " + socketId);
				rtc.attachStream(stream, self.videos[vidIndex]._id);
				self.videos[vidIndex].setUserName('user '+vidIndex+'');
				vidIndex ++;
			}else{
				console.log('no more users can join')
			}
 		});

			

			
			
		/*TODO
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
		*/
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






