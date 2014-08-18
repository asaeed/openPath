/**
 * videosController
 */
App.controller('videosController',function($scope,$state,$stateParams,userFactory){
	//hide footer
    $('#mainFooter').hide();

    $scope.userFactory = userFactory;

    console.log('vid',$scope.user)

	/**
	 * dom elemets
	 */
	this.presenterElement = document.getElementById('presenter');
	this.peersList = document.getElementById('peersList');
	this.chat = document.getElementById("chat");
	this.chatInput = document.getElementById("chatinput");
	this.chatmsg = document.getElementById("chatmsg");
	this.chatwindow = document.getElementById("chatwindow");
	this.chatmessages = document.getElementById("chatmessages");
	this.chatheader = chat.getElementsByTagName("header")[0];
	this.chatToggler = document.getElementById("chatToggler");

	this.leaveRoomBtn = document.getElementById("leaveRoomBtn");
	this.fullScreenBtn = document.getElementById("fullScreenBtn");

	/**
	 *events
	 */
	var self = this;

	/*chat toggle event*/
	this.chatheader.addEventListener('click',function(){
		if(self.chat.classList.contains('open')){
			self.chat.classList.remove('open');
		}else{
			self.chatmsg.classList.remove('blink');
			self.chat.classList.add('open');
			self.chatmsg.innerHTML = 'Chat';
		}
	});
	/**
	 * chat input
	 * socket sending chat
	 */
	this.chatInput.addEventListener('keydown', function(event) {
		if(self.chatInput.value != ''){
			var key = event.which || event.keyCode;
			if (key === 13) {
				var message = self.chatInput.value;
				self.chatInput.value = '';
				console.log('send chat msg',self.chatInput.value,$scope.$parent.user)
				$scope.$parent.socket.emit('sendchat', $scope.$parent.user, message);
			}
		}
	}, false);
	/**
	 * fullScreenBtn
	 */
	this.fullScreenBtn.addEventListener('click',function(event){
		var element = self.presenterElement;
		// go full-screen
		if (element.requestFullscreen) {
		    element.requestFullscreen();
		} else if (element.webkitRequestFullscreen) {
		    element.webkitRequestFullscreen();
		} else if (element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
		} else if (element.msRequestFullscreen) {
		    element.msRequestFullscreen();
		}
	});
	//console.log('presenterElement',self.presenterElement) 
	/**
	 * fullScreenBtn
	 */
	this.leaveRoomBtn.addEventListener('click',function(event){
		alert('leaving room - not hooked up yet')
	});

});
