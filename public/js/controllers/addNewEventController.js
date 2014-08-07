
App.controller('addNewEventController', function($scope,$http){
    /**
     * get events
     */
	var form = document.getElementById("addNewEventForm"),
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


		$http({method: 'POST', url: '/events'}).success(function(data){
	        console.log('d',data);
	        $scope.events = data.events;
	    }).error(function(){
	        console.log('error');
	    });



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
	}

	//don't add more that one event listener
	if(saveEventBtn._hasEventListener) return;
	saveEventBtn.addEventListener('click',this.postNewEvent,false);
	saveEventBtn._hasEventListener = true;
});