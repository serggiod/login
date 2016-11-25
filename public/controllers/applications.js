angular
.module('legapp')
.controller('applications',function($scope,$location,$http,$session){
    $session.autorize(()=>{
        data = $session.get('user');
        user = JSON.parse(data)
        $scope.applications = user.applications;
    });

    $scope.logout = ()=>{$location.path('/logout');};
});