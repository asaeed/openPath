'use strict';

var App = angular.module('openPath', ['ui.router','ngResource']);

App.config(function($stateProvider, $urlRouterProvider){
	//routing
	//@see http://scotch.io/tutorials/javascript/angular-routing-using-ui-router
	$urlRouterProvider.otherwise('/home');
	$stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/videos.html',
            controller : 'videosController'
        })

        //INVITE ROUTES
        .state('invite', {
            url: '/invite',
            templateUrl: 'templates/invite.html',
            controller : 'inviteController'
        })
        //EVENTS ROUTES
        .state('events', {
            url: '/events',
            templateUrl: 'templates/events.html',
            controller : 'eventsController'
        })
        //nested events states
        .state('events.upcoming', {
            url: '/upcoming',
            templateUrl: 'templates/events/upcoming.html',
            controller : 'upcomingEventsController'      
        })
        .state('events.nearby', {
            url: '/nearby',
            templateUrl: 'templates/events/nearby.html',
            controller : 'nearbyEventsController'   
        })
        .state('events.addNewEvent', {
            url: '/addNewEvent',
            templateUrl: 'templates/events/addNewEvent.html',
            controller : 'addNewEventController'     
        })
        .state('events.editEvent', {
            url: '/editEvent/:eventId',
            templateUrl: 'templates/events/editEvent.html',
            controller : 'editEventController'      
        })
        .state('events.inviteToEvent', {
            url: '/inviteToEvent',
            templateUrl: 'templates/events/inviteToEvent.html'     
        })

        //PROFILE ROUTES
        .state('profile', {
            url: '/profile',
            templateUrl: 'templates/profile.html',
            controller : 'profileController'
        })
        //nested profile states
        .state('profile.myProfile', {
            url: '/myprofile',
            templateUrl: 'templates/profile/myprofile.html'     
        })
        .state('profile.editProfile', {
            url: '/editprofile',
            templateUrl: 'templates/profile/editprofile.html'     
        })
        .state('profile.myPath', {
            url: '/mypath',
            templateUrl: 'templates/profile/mypath.html',
            controller : 'myPathController'    
        })
        .state('profile.notifications', {
            url: '/notifications',
            templateUrl: 'templates/profile/notifications.html'     
        })
        .state('profile.settings', {
            url: '/settings',
            templateUrl: 'templates/profile/settings.html',
            controller : 'settingsController'     
        })
    ;//end state provider

});
/**
 * mainController
 */
App.controller('mainController', function($scope,$element,$state,$stateParams,userFactory){
    //console.log($scope, $element);
    //console.log($state.current,$element)


    // $scope.$watch('$state',function(){
    //     console.log('$state change',$state)
    // });

    //peer & socket
    this.call = null;
    this.peer = new Peer({key: OpenPath.peerKey, secure: true }), //TODO: out own peer server? //OpenPath.rtc.server= "ws://www.openpath.me:8001/";
    $scope.socket = io.connect(OpenPath.socketConnection, {secure: true} );
    this.peer_connection = null;

    //array of users in room - get all connected users in my room - excluding me
    this.others_in_room = [];
    //array of other user instances, in room of course
    this.peers = [];

    var self = this;

    /**
     * get user
     */
    userFactory.getByEmail(document.getElementById('email').value).then(function(data){
        $scope.user = data;
        //console.log('user',$scope.user)
        start();
    },function(data){
        alert(data);
    });



    //start
    function start(){
        userFactory.checkIfPresenter($scope.user,function(d){
            console.log('done',d)
        });
        self.getMyMedia();
        self.getMyLocation();       
    }



    /**
     * getMyMedia, send to socket
     */
    this.getMyMedia = function(){

        //modal
        var notYetAllowed = document.getElementById('notYetAllowed');
        OpenPath.Ui.modal(notYetAllowed);
        OpenPath.Ui.modalWrap.classList.add('alertModal');


        if(navigator.getUserMedia) {
            navigator.getUserMedia( {video: true, audio: true}, function(stream) {

                //hide modal
                OpenPath.Ui.closeModals();


                console.log('got my stream')
                //set user stream
                $scope.user.stream = stream;


                //send stream
                $scope.socket.emit("stream", $scope.user);


                //get location
                //self.getMyLocation();
                //render video
                //self.video.render('stream');
            },
            function(err) {
                console.log('Failed to get local stream' ,err);
                //did not join, pressed no allow
                //hide modal
                OpenPath.Ui.closeModals();

                //new modal
                var saidNoToAllow = document.getElementById('saidNoToAllow');
                OpenPath.Ui.modal(saidNoToAllow);
                OpenPath.Ui.modalWrap.classList.add('alertModal');
            });
        }else{
            console.log('can\'t get user media');
        }
    };

    /**
     * getMyLocation, send to socket
     */
    this.getMyLocation = function(){
        function setLocation(position){
            $scope.user.location = {
                coords : {
                    latitude : position.coords.latitude,
                    longitude : position.coords.longitude
                },
                timestamp : position.timestamp
            };
            console.log("got my location - Latitude: " );
            //, $scope.user.location,position.coords.latitude , " Longitude: " , position.coords.longitude );

            //send location
            $scope.socket.emit("location", $scope.user );

            //re-render video
            //self.video.render('location');
        }
        //location error
        function showLocationError(error){
            switch(error.code){
                case error.PERMISSION_DENIED:
                    console.log("User denied the request for Geolocation.");
                break;
                
                case error.POSITION_UNAVAILABLE:
                    console.log("Location information is unavailable.");
                break;
                case error.TIMEOUT:
                    console.log("The request to get user location timed out.");
                break;
                case error.UNKNOWN_ERROR:
                    console.log("An unknown error occurred.");
                break;
            }
        }
        //get location
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition( setLocation, showLocationError );
        }else{
            console.log("Geolocation is not supported by this browser.");
        }
    };

    /**
     * socket connect
     */
    $scope.socket.on('connect', function() {
        console.log("connected to socket",$scope.user);
        $scope.socket.emit('adduser',  $scope.user );
    });

    /**
     * peer open
     * get id from PeerJS server and send it to socket
     */
    this.peer.on('open', function(id) {
        console.log('got my peerID, sending it', id);
        //update this.user
        //self.user.updatePeerId(id);
        $scope.user.peer_id = id;


        //send id so if anyone is in room, they'll give you a call 
        //after their socket recieves your peer id (below)
        $scope.socket.emit("peer_id", $scope.user);
    });

    /**
     * INCOMING CALL
     */
    this.peer.on('call', function( incoming_call ) {
        console.log('INCOMING CaLL',incoming_call);
        //WHAT TODO WITH INCOMING CALL USER....
        incoming_call.answer(self.user.obj.stream); // Answer the call with our stream from getUserMedia
        incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
            console.log('got other\'s stream');
            self.createPeer(incoming_call, remoteStream);
        });
    });

    this.peer.on('connection', function(incoming_connection) {
        console.log('INCOMING Connection',incoming_connection);
        //they have no stream so call them only if you do
        //if(self.user.obj.stream){
            //self.callPeer(aPeer);
        //}
    });

    /**
     * socket receiving
     */

    /**
     * update chat 
     */
    //todo : save room chats on server, send up on first connection
    $scope.socket.on('updatechat', function (user, data) {
        console.log('received updatechat',user+ ': ' + data );

        //update chat
        self.updateChat( user, data );
    });
    /**
     * receive connected of others (not yourself on this one)
     */
    $scope.socket.on('connected', function (aPeer, connected_users) {
        console.log('someone connected',aPeer.email);
        self.findOthersInRoom(connected_users);
    });
    /**
     * receive peer_ids of others
     * open peer connection a.k.a. you make the call 
     */
    $scope.socket.on('peer_id', function ( aPeer ) {
        console.log('received peer_id, calling', aPeer.email );
        //make the call here
        self.callPeer(aPeer);
    });
    /**
     * receive location of others
     */
    $scope.socket.on('location', function ( aPeer ) {
        console.log('received location', aPeer.email )
    });
    /**
     * receive stream of others
     */
    $scope.socket.on('stream', function ( aPeer ) {
        console.log('received stream', aPeer.email );

        //make the call again
        //self.callPeer(aPeer);
    });
    /**
     * switch room
     */
    $scope.socket.on('switchedRoom', function ( aPeer,connected_users ) {
        console.log('received switchedRoom', aPeer.email, aPeer,self.user.currentRoom );
        self.findOthersInRoom(connected_users);//removes them from others in room (i think TODO)
        self.removePeer(aPeer);
    });
    
    /**
     * receive disconnect
     * find user instance and destroy it!!
     */
    $scope.socket.on('disconnect', function ( aPeer, connected_users ) {
        console.log('received disconnect', aPeer, connected_users ,self.peers);
        if(connected_users)
        self.findOthersInRoom(connected_users);
        self.removePeer(aPeer);
    });


    /**
     * helpers
     */
    //update chat
    this.updateChat = function( user, msg ){
        var from = user === 'SERVER' ? user : user.email;
        //dom vars
        var chat = document.getElementById("chat");
        var chatwindow = document.getElementById("chatwindow");
        var chatmessages = document.getElementById("chatmessages");

        //format msg string
        msg = msg.replace(/</g, '&lt;');

        //set color of user
        var className;
        if(from === 'SERVER'){
            className = 'server';
            from = 'OpenPath'
        }else if(from === $scope.user.email){
            className = 'me';
            from = user.name ? user.name: user.email;
        }else{
            className = 'other';
            from = user.name ? user.name: user.email;
        }

        //if chat closed show 'new message' blink
        //TODO if you want to hide server messages add ' && from !== 'SERVER' ' to if statement
        if( !chat.classList.contains('open') ){ //&& from !== 'SERVER
            chatmsg.innerHTML = 'New Message from ' + from;
            chatmsg.classList.add('blink');    
        }

        var message = '<li class="'+className+'"><span>'+ from +'</span>: ' + msg + '</li>';
        chatmessages.innerHTML += message;
        chatwindow.scrollTop = chatwindow.scrollHeight;
    };
    //find others in room
    this.findOthersInRoom = function( connected_users ){
        var others = [];
        for(var i=0;i<connected_users.length;i++){

            //if not me && in same room
            var notMe = connected_users[i].email !== $scope.user.email;
            var sameRoom = connected_users[i].currentRoom === $scope.user.currentRoom;

            if( notMe && sameRoom ){
                console.log('other users in room', connected_users[i].email )
                others.push( connected_users[i] );
            }
        }
        //set this.others_in_room
        self.others_in_room = others;
        console.log('others_in_room',self.others_in_room);
    };

    this.createPeer = function(){

    };
    this.joinEvent = function(){

    };
    this.removePeer = function(){

    };
});




