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
		this.vidIndex = 0;
		
		
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
		//this.videos[1].loadMap();
		
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
	checkForEventCreator : function(callback){
		var self = this;
		console.log('checkForEventCreator',this.room )
		//find events
		$.ajax({
			url: '/events/'+this.room,
			dataType:'json',
			type:'GET',
			//async:false,
			success: function(data) { 
				callback(data);
			},
			error: function(msg){
				console.log('no events: error',msg);
				callback(msg);
			}
		});
	},
	/**
	  * Starts video, chat, and geolocation
	  */
	connect : function(){ 
		var self = this;
		
		//connect to Room!
 		if(this.room !== null){
			rtc.connect(OpenPath.rtc.server, this.room);
			console.log("rtc.connect: " + this.room);
		}
		if (OpenPath.rtc.PeerConnection) {
			//TODO: determine if you're hosting event  and fork

			self.vidIndex = 0;
   			rtc.createStream({"video": true, "audio": true}, function(stream) {
				
			
				self.checkForEventCreator(function(data){
					//if you
					if(data.creator === OpenPath.email){
						document.getElementById(self.videos[self.vidIndex]._id).src = URL.createObjectURL(stream);
						//attach to main
						rtc.attachStream(stream, self.videos[self.vidIndex]._id);
						self.videos[self.vidIndex].setUserName( OpenPath.username );
						self.vidIndex ++;
					}else{
						self.vidIndex = 1;
						document.getElementById(self.videos[self.vidIndex]._id).src = URL.createObjectURL(stream);
						//attach to top left corner
						rtc.attachStream(stream, self.videos[self.vidIndex]._id);
						self.videos[self.vidIndex].setUserName( OpenPath.username );
						self.vidIndex ++;
					}
				});//TODO: need email or something of vid stream, check chat
				
				
				//TODO tell socket i'm here with email and location and hopefully that works
		
				//socket io
				//var socket = io.connect('http://localhost');
				//socket.emit('joinedVideo', { name: OpenPath.username });
				
				//console.log('joinedVideo', OpenPath.username  )
			});
		
		} else {
			alert('Sorry, your browser is not supported');
		}
		

		
		//attach other users streams 
 		rtc.on('add remote stream', function(stream, socketId) {
			if(self.vidIndex < self.videos.length){
				console.log(stream)
	   			console.log("user joined:"+self.vidIndex+" Remote stream: " + stream + " " + socketId);
				
				//self.checkForEventCreator();
				
				
				rtc.attachStream(stream, self.videos[self.vidIndex]._id);
				self.videos[self.vidIndex].setUserName('user '+self.vidIndex+'');
				self.vidIndex ++;
			}else{
				console.log('no more users can join')
			}
		});

		rtc.on('get_peers',function(data){
			//console.log('get peers', data)
		})
			

			
			
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
			console.log('main_video_socketid',data.socketid);
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

  */




