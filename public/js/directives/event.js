"use strict";

App.directive('event', function () {
	return {
		templateUrl: "templates/_directives/event.html",
        link: function($scope, $element, attrs) {
            var $editBtn = $element.find('.editBtn');
            var $inviteBtn = $element.find('inviteBtn');
            var $joinBtn = $element.find('joinBtn');

            console.log($scope.event.isMine)

            $editBtn.click(function(e){
            	e.preventDefault();
            	//console.log($scope.event.id);
            	//$scope.currentEditEventId = $scope.event.id;
            	//window.location = $editBtn.attr('href');
                //$state.go('^.editEvent($scope.event.id)')
            });
        }
	}
});