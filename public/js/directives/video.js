"use strict";

App.directive('presenter', function () {
    return {
        templateUrl: "templates/_directives/presenter.html",
        link: function($scope, $element, attrs ) {
            $scope.name;
            if($scope.user.firstName){
                $scope.name = $scope.user.firstName+ ' '+$scope.user.lastName;
            }else{
                $scope.user.email;
            }
            console.log($scope.user)
            $element.find('video.video').attr('muted',false);
        }
    }
});

App.directive('video', ['$timeout', function ($timeout) {
	return {
        restrict: 'A',
        // NB: isolated scope!!
        scope: {
            video: '='
        },
		templateUrl: "templates/_directives/video.html",
        link: function($scope, $element, attrs ) {
            console.log('vid dir',$scope.video);


        }
	}
}]);