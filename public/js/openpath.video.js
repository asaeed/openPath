  /**
  * @class OpenPath.Video 
  */
OpenPath.Video = function ( id ){
	this._id = id;
};
OpenPath.Video.prototype.getMarkup = function () {
	this.ele = document.createElement('div');
	this.meta = document.createElement('div');
	this.header = document.createElement('header');
	this.username = document.createElement('a');
	this.iconMapMarker = document.createElement('div');
	this.iconRemove = document.createElement('span');
	this.userlocation = document.createElement('div');
	this.usermap = document.createElement('div');
	this.video = document.createElement('video');
	
	//add classes
	this.ele.classList.add('videoWrap');
	this.meta.classList.add('usermeta');
	this.username.classList.add('username');
	this.iconMapMarker.classList.add('icon-map-marker');
	this.iconRemove.classList.add('icon-remove');
	this.userlocation.classList.add('userlocation');
	this.usermap.classList.add('usermap');
	this.video.classList.add('video');
	this.video.setAttribute('muted',true);
	this.video.setAttribute('autoplay',true);
	this.video.setAttribute('id',this._id);
	
	
	//append created eles
	this.iconMapMarker.appendChild(this.iconRemove);
	this.username.appendChild(this.iconMapMarker);
	this.header.appendChild(this.username);
	this.meta.appendChild(this.header);
	this.meta.appendChild(this.userlocation);
	this.meta.appendChild(this.usermap);
	this.ele.appendChild(this.meta);
	this.ele.appendChild(this.video);
	
	return this.ele;
};
OpenPath.Video.prototype.connect = function (stream, socketId) {
	this.stream = stream;
	this.socketId = socketId;
	
	console.log('new video')
	/*
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
	
	<div class="userVideo">
		<div class="usermeta">
			<div class="username">
				<a href="javascript:void(0);"></a>
				<div class="icon-map-marker">
					<span class="icon-remove"></span>
				</div>
			</div>
			<div class="userlocation"></div>
			<div class="usermap"></div>
	    </div>
	    <video id="" class="avatar"  muted autoplay></video>
	</div>
	
	
        	<div class="usermeta">
				<div class="username">
					<a href="javascript:void(0);" id="username0"></a>
					<div class="icon-map-marker">
						<span class="icon-remove"></span>
					</div>
				</div>
				<div id="userlocation0" class="userlocation"></div>
				<div id="usermap0" class="usermap"></div>
			</div>
			<video id="main_videoplayer" width="100%" height="auto"  autoplay> <!--poster="img/poster.png"-->
	    		Your browser does not support the video tag.
			</video>
	
	*/
}
