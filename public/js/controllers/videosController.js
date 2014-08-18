/**
 * videosController
 */
App.controller('videosController',function($scope,$state,$stateParams){
	//hide footer
    $('#mainFooter').hide();

    //console.log($scope, $element);
    console.log($state.current)
    //onload, default to upcoming
    if($state.current.name ==='home'){
        
        

    }

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
});
