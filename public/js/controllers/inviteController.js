'use strict';

App.controller('inviteController', function($scope,$http){
	//show footer
    $('#mainFooter').show();
    
    /**
     * get user
     */
    $http({method: 'GET', url: '/user/'+document.getElementById('email').value }).success(function(data){
        console.log('d',data);
        $scope.user = data;
    }).error(function(){
        console.log('error');
    });


});
