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
App.controller('mainController', function($scope,$element,$state,$stateParams,userFactory,eventFactory){
    var self = this;

    //array of users in room - get all connected users in my room - excluding me
    $scope.others_in_room = [];

    /**
     * get user
     */
    userFactory.getByEmail(document.getElementById('email').value).then(function(data){
        $scope.user = data;
        //set front end vars
        $scope.user.location = {
            coords : {
                latitude : null,
                longitude : null
            },
            timestamp : null
        };//set to watch in directive
        $scope.user.peer_id = null;


        console.log('user',$scope.user.currentEvent)
        
        if($scope.user.currentEvent){
            //TODO header
            
            eventFactory.getOne($scope.user.currentEvent).then(function(data){
                console.log('you are connected to event : '+data.name);
                OpenPath.Ui.updateHeader({event:data});
            },function(data){
                alert(data);
            });
            
        }

        //connect
        start();

    },function(data){
        alert(data);
    });



    //start
    function start(){
        userFactory.checkIfPresenter($scope.user,function(d){
            console.log('checkIfPresenterf',d)
        });
        //load data chain
        getMyMedia(function(){
            console.log("got my media")
            getMyLocation(function(){
                console.log("got my location" );
                connect();
            });  
        });
        

        
    }

    /**
     * connect to socket and peer servers
     */
    function connect(){
        // No API key required when not using cloud server
        $scope.peer = new Peer($scope.user.email.split('@')[0], {host: 'ws://'+OpenPath.host, port: 9000, path: '/openpath'});
        $scope.socket = io.connect(OpenPath.socketConnection, {secure: true} );
        
        $scope.peer.on('error',function(error){
            console.log('error',error)
        });

        /**
         * socket connect
         */
        $scope.socket.on('connect', function() {
            console.log("connected to socket",$scope.user.email);
            $scope.socket.emit('adduser',  $scope.user );
        });

        /**
         * peer open
         * get id from PeerJS server and send it to socket
         */
        $scope.peer.on('open', function(id) {
            console.log('got my peerID, sending it',$scope.user, id);
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
        $scope.peer.on('call', function( incoming_call ) {
            console.log('INCOMING CaLL',incoming_call);
            //WHAT TODO WITH INCOMING CALL USER....
            incoming_call.answer($scope.user.stream); // Answer the call with our stream from getUserMedia
            incoming_call.on('stream', function(remoteStream) {  // we receive a getUserMedia stream from the remote caller
                console.log('got other\'s stream');
                for(var i=0;i<$scope.others_in_room.length;i++){
                    if($scope.others_in_room[i].peer_id === incoming_call.peer){
                        $scope.others_in_room[i].stream = remoteStream;
                    }
                }
                $scope.$apply();
            });
        });
        /**
         * socket receiving
         */

        /**
         * update chat 
         */
        //todo : save room chats on server, send up on first connection
        $scope.socket.on('updatechat', function (user, data) {
            //console.log('received updatechat',user.email+ ': ' + data );

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
            callPeer(aPeer);
        });

        /**
         * switch room
         */
        $scope.socket.on('switchedRoom', function ( aPeer,connected_users ) {
            console.log('received switchedRoom', aPeer.email, aPeer,self.user.currentRoom );
            self.findOthersInRoom(connected_users);//removes them from others in room (i think TODO)
            //self.removePeer(aPeer);
        });
        
        /**
         * receive disconnect
         * find user instance and destroy it!!
         */
        $scope.socket.on('disconnect', function ( aPeer, connected_users ) {
            console.log('received disconnect', aPeer, connected_users ,self.peers);
            if(connected_users)
            self.findOthersInRoom(connected_users);
            //self.removePeer(aPeer);
        });
    };

    function callPeer(aPeer){
        var call = $scope.peer.call( aPeer.peer_id, $scope.user.stream );
        console.log('call',call)
        // After they answer, we'll get a 'stream' event with their stream  
        if(call)
        call.on('stream', function(remoteStream) {
            console.log("Got remote stream", remoteStream, aPeer.stream);
            for(var i=0;i<$scope.others_in_room.length;i++){
                if($scope.others_in_room[i].peer_id === aPeer.peer_id){
                    $scope.others_in_room[i].stream = remoteStream;
                }
            }
            $scope.$apply();
        });
    }


    /**
     * getMyMedia, send to socket
     */
    function getMyMedia(done){

        //modal
        var notYetAllowed = document.getElementById('notYetAllowed');
        OpenPath.Ui.modal(notYetAllowed);
        OpenPath.Ui.modalWrap.classList.add('alertModal');


        if(navigator.getUserMedia) {
            navigator.getUserMedia( {video: true, audio: true}, function(stream) {

                //hide modal
                OpenPath.Ui.closeModals();

                //set user stream
                $scope.user.stream = stream;

                //send stream
                //$scope.socket.emit("stream", $scope.user);
                done();
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
    function getMyLocation(done){
        function setLocation(position){
            $scope.user.location = {
                coords : {
                    latitude : position.coords.latitude,
                    longitude : position.coords.longitude
                },
                timestamp : position.timestamp
            };
            // "- Latitude: ", $scope.user.location,position.coords.latitude , " Longitude: " , position.coords.longitude );

            //send location
            //$scope.socket.emit("location", $scope.user );

            done();
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
     * helpers
     */
    //update chat //TODO move to video controller
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
        if(chat)//hack
        if( !chat.classList.contains('open') ){ //&& from !== 'SERVER
            chatmsg.innerHTML = 'New Message from ' + from;
            chatmsg.classList.add('blink');    
        }

        var message = '<li class="'+className+'"><span>'+ from +'</span>: ' + msg + '</li>';
        if(chatmessages)//hack
        chatmessages.innerHTML += message;
        if(chatwindow)//hack
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
                //console.log('other users in room', connected_users[i].email )
                others.push( connected_users[i] );
            }
        }
        //set this.others_in_room
        $scope.others_in_room = others;
        console.log('others_in_room',$scope.others_in_room);
        
    };
});




