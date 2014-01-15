  /**
  * @class OpenPath.Video 
  */
OpenPath.Video = function ( id ){
	this._id = id;
};
OpenPath.Video.prototype.getMarkup = function(){
	this.ele = document.createElement('div');
	this.meta = document.createElement('div');
	this.header = document.createElement('header');
	this.username = document.createElement('a');
	this.iconMapMarker = document.createElement('div');
	this.iconRemove = document.createElement('div');
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
	this.header.appendChild(this.iconRemove);
	this.header.appendChild(this.iconMapMarker);
	this.header.appendChild(this.username);
	//this.header.appendChild(this.userlocation);
	this.meta.appendChild(this.header);
	
	this.ele.appendChild(this.meta);
	this.ele.appendChild(this.usermap);
	this.ele.appendChild(this.video);
	
	
	this.username.innerHTML = 'no one here yet';
	
	this.events();
	this.loadMap();
	
	return this.ele;
};
OpenPath.Video.prototype.events = function(){
	var self = this;
	
	this.ele.addEventListener('mouseover',function(){
		self.header.style.opacity = 1;
	},false);
	
	this.ele.addEventListener('mouseout',function(){
		self.header.style.opacity = 0;
	},false);
	
	this.iconMapMarker.addEventListener('click',function(){
		self.usermap.style.opacity = 1;
		//self.userlocation.style.opacity = 1;
		self.iconMapMarker.style.display = 'none';
		self.iconRemove.style.display = 'inline-block';
	},false);
	
	this.iconRemove.addEventListener('click',function(){
		self.usermap.style.opacity = 0;
		//self.userlocation.style.opacity = 0;
		self.iconMapMarker.style.display = 'inline-block';
		self.iconRemove.style.display = 'none';
	},false);
	
};
OpenPath.Video.prototype.loadMap = function() {
	var ele = this.usermap,
		location = nycPos = new google.maps.LatLng(40.7142, -74.0064);
		
		
	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			location = new google.maps.LatLng(position.coords.latitude,  position.coords.longitude);
			console.log('is geo', location)
		},function(){
			console.log('no geo loc')
		});
	}
	
	
	var mapOptions = {
		center: new google.maps.LatLng(-33.8688, 151.2195),
		zoom: 13,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	
	var map = new google.maps.Map(ele, mapOptions);
	
	var infowindow = new google.maps.InfoWindow();

	var service = new google.maps.places.PlacesService(map);
	
    service.getDetails( location, function(place, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			var marker = new google.maps.Marker({
				map: map,
				position: place.geometry.location
			});
			
			google.maps.event.addListener(marker, 'click', function() {
				infowindow.setContent(place.name);
				infowindow.open(map, this);
			});
			
			// If the place has a geometry, then present it on a map.
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);  // Why 17? Because it looks good.
			}
	
			marker.setIcon(({
				//url: place.icon,
				url: 'img/marker.png',
				size: new google.maps.Size(71, 71),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(17, 34),
				scaledSize: new google.maps.Size(35, 35)
			}));
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);
		}
    });
	
};
OpenPath.Video.prototype.connect = function (stream, socketId) {
	this.stream = stream;
	this.socketId = socketId;
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

	*/
};

/* video to main
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


