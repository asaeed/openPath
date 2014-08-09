App.directive('map', function () {
	return {
		template: "no map",
        link: function($scope, $element, attrs) {
            var $loc = $scope.event.location;
            if($loc.latitude){

                console.log($loc,$element);
                OpenPath.Ui.renderMap($element[0], $loc.latitude, $loc.longitude, $loc.reference, $loc.formattedAddress );
            }
            
        }
	}
});