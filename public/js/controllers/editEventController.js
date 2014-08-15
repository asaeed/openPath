"use strict";

App.controller('editEventController', function($scope,$http,$stateParams,eventFactory){
    console.log($stateParams,$stateParams.eventId);

    //dom vars
    var form = document.getElementById("editEventForm"),
		name = document.getElementById("name"),
		link = document.getElementById("link"),
		date = document.getElementById("date"),
		startTime = document.getElementById("startTime"),
		endTime = document.getElementById("endTime"),
		description = document.getElementById("description"),
		locationInput = document.getElementById("location"),
		longitudeInput = document.getElementById("longitude"),
		latitudeInput = document.getElementById("latitude"),
		referenceInput = document.getElementById("reference"),
		formattedAddressInput = document.getElementById("formattedAddress"),
		saveEventBtn = document.getElementById('saveEventBtn');


    if($stateParams.eventId){
	    /**
	     * get event
	     */
	    eventFactory.getOne($stateParams.eventId).then(function(data){
	        $scope.item = data;
	        console.log($scope.item)
	        //set date & time values
	        date.setAttribute('value',OpenPath.Utils.formatDateForHTMLInput($scope.item.date) );
	        startTime.setAttribute('value',OpenPath.Utils.formatTimeForHTMLInput($scope.item.startTime) );
	        endTime.setAttribute('value',OpenPath.Utils.formatTimeForHTMLInput($scope.item.endTime) );

	    },function(data){
	        alert(data);
	    });
	   		
    }
//valueAsDate



	//reset form
	//form.reset();
	//try dom hack //form.onkeypress = console.log( OpenPath.Utils.checkEnter() );
	/**
	 * autocompleteLocationInput
	 */
	function autocompleteLocationInput(){
		var autocomplete = new google.maps.places.Autocomplete(locationInput);
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			//infowindow.close();
			

			var place = autocomplete.getPlace();
			if (!place.geometry) {
				// Inform the user that a place was not found and return.
				alert('location not found')
				return;
			}else{
				console.log('adding',place)
				longitudeInput.value = place.geometry.location.lng();
				latitudeInput.value = place.geometry.location.lat();
				referenceInput.value = place.reference;
				formattedAddressInput.value = place.formatted_address;
				console.log(place.reference);	
			}
		});
	}
	//call auto complete
	autocompleteLocationInput();
	
	/**
	 * grade level //TODO
	 */
	var gradelevelsArr = [];
	/*
	this.form.find('input:checkbox[name=gradelevel]:checked').each(function(){
		gradelevelsArr.push( $(this).val() );
	});
	*/

	this.postNewEvent = function(e){
		e.preventDefault();
		var dSplit = date.value.split('-');
		var newDate = new Date( dSplit[0], dSplit[1]-1, dSplit[2] );
		//create model (above) auto post


		
		var data = {
			name: name.value,
			link: link.value,
			description: description.value,
			location : {
				name : locationInput.value,
				longitude : longitudeInput.value ,
				latitude : latitudeInput.value,
				reference : referenceInput.value,
				formattedAddress : formattedAddressInput.value
			},
			date : newDate,
			startTime:  startTime.value,
			endTime : endTime.value
		};


		//call update in service
		eventFactory.update($stateParams.eventId, data, function(d){
			console.log('ev put', d);
			window.location = '#/events/';
		});
	}

	//don't add more that one event listener
	if(saveEventBtn._hasEventListener) return;
	saveEventBtn.addEventListener('click',this.postNewEvent,false);
	saveEventBtn._hasEventListener = true;
});