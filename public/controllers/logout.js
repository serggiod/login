angular
.module('legapp')
.controller('logout',function($scope,$location,$http,$session){

    // Aceptar.
    $scope.aceptar = ()=>{$session.destroy();};
    
    // Cancel.
    $scope.cancelar = ()=>{$location.path('/applications');};

    $scope.init = ()=>{$('#cargando').hide();};

    $scope.init();

});