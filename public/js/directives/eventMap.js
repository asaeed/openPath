App.directive('menu', function () {
	return {
		templateUrl: "templates/menu.html",
        link: function($scope, $element, attrs) {

            $scope.list = [
                {
                    name: 'Apps',
                    bg: '#FFFFFF',
                    w: 100,
                    h: 75
                },
                {
                    name: 'Lab',
                    bg: '#FFFF00',
                    w: 100,
                    h: 75
                },
                {
                    name: 'About', 
                    bg: '#F00FFF',
                    w: 100,
                    h: 75
                }
            ];

          //  console.log($element.find('ul'))

        }
	}
});