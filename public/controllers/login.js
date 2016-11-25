angular
.module('legapp')
.controller('login',function($scope,$location,$http,$session,md5){
	// Rutas.
	$scope.routesToLogin = '/rest/ful/session.php/login';
	$scope.alert = {};			
	
	// Iniclizadora.
	$scope.init = ()=>{
		$('#cargando').hide();
		$session.destroy();
		$scope.usuario='';
		$scope.password='';
		$scope.alert.type = 'light-green lighten-3';
		$scope.alert.text = 'Ingrese sus datos personales.s';
	};

	$scope.login = ()=>{
		if($scope.usuario==''||$scope.password==''){
			$scope.alert.type = 'red lighten-4';
			$scope.alert.text = 'Todos los campos son obligatorios.';
		}
		else {
			pass = md5.createHash($scope.password);
			body = {user:$scope.usuario,pass:pass};
			$http
				.post($scope.routesToLogin,body)
				.error(()=>{
					$scope.alert.type = 'red lighten-4';
					$scope.alert.text = 'El usuario o el password no son válidos.';
				})
				.success((json)=>{
					if(json.result){
						$session.start(json.rows);
						$location.path('/applications');
					}
				});
		}
	}

	// Inicializar.
	$scope.init();
});