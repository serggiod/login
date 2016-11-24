angular
.module('login')
.controller('session',function($scope,$location,$http,$session){
    $scope.init = ()=>{
        $('#cargando').hide();
        json = {
            result:true,
            rows:'esta sesion esta activa'        
        };
        $scope.response = JSON.stringify(json);
    };
    $scope.init();
});