angular
.module('login')
.controller('logout',function($scope,$location,$http,$session){

    // Aceptar.
    $scope.aceptar = ()=>{
        //$session.destroy();
        alert('Destruir sesion.');
    };
    
    // Cancel.
    $scope.cancelar = ()=>{
        alert('Volver a la aplicacion actual.');
    };

    $scope.init = ()=>{
		$('#cargando').hide();
	};

    $scope.init();

});