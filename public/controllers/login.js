angular
.module('login')
.controller('login',function($scope,$location,$http,$session){
	// Rutas.
	$scope.routesToLoginForm = 'views/dialogs/login.html';			
	
	// Iniclizadora.
	$scope.init = ()=>{
		$('#cargando').hide();
		$session.destroy();
	};

	$scope.login = ()=>{
		alert('Login');
	}

	// Inicializar.
	$scope.init();
});