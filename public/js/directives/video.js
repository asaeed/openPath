"use strict";

App.directive('video', function () {
	return {
		templateUrl: "templates/_directives/video.html",
        link: function($scope, $element, attrs ) {
            console.log('video',$element.find('video.video'), $scope.userFactory);
            /**
             * get user
             */
            $scope.userFactory.getByEmail(document.getElementById('email').value).then(function(data){
                $scope.user = data;
            },function(data){
                alert(data);
            });

            $scope.id='frank'
            $scope.name = 'j'
            //$scope.muted = 'muted';

            $element.find('video.video').attr('muted',true);
        }
	}
});