"use strict";

App.controller('eventsController', function($scope,$http,$state,eventFactory){
    $scope.currentEditEvent = null;

    //onload, default to upcoming
    if($state.current.name ==='events'){
        $state.go('.upcoming')
    }
    console.log('evevv')
    /**
     * get events
     
    eventFactory.query(function(data){
        console.log('d',data);
        //$scope.content = data;
        $scope.events = data;
    });

     */
    eventFactory.get().then(function(data){
        $scope.events = data;
    },function(data){
        alert(data);
    });


    //date filter
    $scope.dateFilter = function(item){
    	var today = new Date();
		var yesterday = today.setDate(today.getDate() - 1);
		return(Date.parse(item.date) > yesterday);//if today or in future
    }

    //watch for edit event
    /*
    $scope.$watch('currentEditEventId',function(){
        console.log('ev change')
        angular.forEach($scope.events, function(item) {          
            if($scope.currentEditEventId === item.id){
                $scope.currentEditEvent = item;
                if($scope.currentEditEventId)
                console.log($scope.currentEditEventId,$scope.currentEditEvent.name)
            }
        });
    });
    */

});

App.controller('nearbyEventsController',function($scope,$http,$state,eventFactory){
    var nearByEvents = document.getElementById('nearByEvents');
    var aside = nearByEvents.getElementsByTagName('aside')[0];
    var nearbyMap = document.getElementById('nearByMap');
    nearbyMap.style.height = window.innerHeight - 200 + 'px';


    eventFactory.get().then(function(data){
        $scope.events = data;
        console.log('near',$scope.events);
        //init map
        initMap();

    },function(data){
        alert(data);
    });




    /**
     * MAP
     */
    function initMap(){
        //@see http://wrightshq.com/playground/placing-multiple-markers-on-a-google-map-using-api-3/
        var markers = [];
        var infoWindowContent = [];
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            zoom: 3,
            //center: new google.maps.LatLng(OpenPath.user.obj.location.coords.latitude, OpenPath.user.obj.location.coords.longitude),
            mapTypeId: google.maps.MapTypeId.TERRAIN
        };
        var map = new google.maps.Map(nearbyMap,mapOptions);
        map.setTilt(45);

        //loop events, make locations and info windows
        for(var i=0;i<$scope.events.length;i++){
            //markers.push(new google.maps.LatLng(locations[i].latitude,locations[i].longitude));
            //
            /*
date: "June 21, 2015"
description: "ba ba ba ba ba barbra anne"
endTime: "1:00 AM"
id: "53a50985decc9ade03a75527"
isMine: true
link: "boster.com"
location: Object
name: "bosster"
room: "53a50985decc9ade03a75526"
startTime: "1:00 AM"
            */
            var e = $scope.events[i];
            markers.push([e.location.name,e.location.latitude,e.location.longitude]);
            var infoMarkup = '<div class="event">' +
                                '<article>' +
                                    '<h3><a href="javascript:void(0);" target="_blank">'+e.name+'</a></h3>' +
                                    '<p class="link"><a href="'+e.link+'">'+e.link+'</a></p>' +
                                    '<p class="date">'+e.date+' <span class="startTime">'+e.startTime+'</span> - <span class="endTime">'+e.endTime+'</span></p>' +
                                    '<p class="location">'+e.location.name+'</p>' +
                                    '<p class="description">'+e.description+'</p>' +
                                '</article>'+
                              '</div>';
            infoMarkup = '<div>hi dear</div>'; 
            infoWindowContent.push(infoMarkup);
            console.log($scope.events[i])
        }
    

        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;
        
        // Loop through our array of markers & place each one on the map  
        for( i = 0; i < markers.length; i++ ) {
            var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: markers[i][0]
            });
            
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            //this.setZoom(14);
            google.maps.event.removeListener(boundsListener);
        });

        /*
        var pinsMap = new google.maps.Polyline({
            path: pins,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        pinsMap.setMap(map);
        */
        /*
        marker.setIcon(({
            url: place.icon,
            //url: 'images/marker.png',
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(35, 35)
        }));
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        */
        /*
        //if onload this page location not saved to server so load at great pyramid     
        if(OpenPath.user.obj.location.coords.latitude!==null && OpenPath.user.obj.location.coords.longitude!==null){
            //OpenPath.Ui.renderMap(nearbyMap, OpenPath.user.obj.location.coords.latitude, OpenPath.user.obj.location.coords.longitude );
        }else{
            //OpenPath.Ui.renderMap(nearbyMap, 29.979252, 31.133874 );
        }
        */
    }
});
