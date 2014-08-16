'use strict';

App.controller('profileController', function($scope,$state,userFactory){
    /**
     * get user
     */
    userFactory.getByEmail(document.getElementById('email').value).then(function(data){
        $scope.user = data;
    },function(data){
        alert(data);
    });

    
    //grade obj
    $scope.gradeLevelOptions = [
        {
            name : 'Pre-K to Grade 2',
            value : 'PreKToGrade2'
        },
        {
            name : '2Grade 3-5',
            value : 'Grade3To5'
        },
        {
            name : 'Grade 9-12',
            value : 'Grade9To12'
        },
        {
            name : 'Post Secondary',
            value : 'PostSecondary'
        },
        {
            name : 'Adults',
            value : 'Adults'
        },
        {
            name : 'Families',
            value : 'Families'
        }
    ];


    /**
     * set interests
     */
    $scope.interests = 'todo';

});
