<?php

# Requerir archivo base..
require_once 'base.php';

# Instancia de Zendframwork/zend-validation.
$filter = new Zend\Validator\StringLength(array('min'=>4,'max' => 32));

# Peticion POST.
$app->post('/',function($request) use ($db,$app,$main,$filter) {
	
	# Optener variables.
	$json     = json_decode($request->getBody());
	$usuario  = filter_var($json->user,FILTER_SANITIZE_STRING);
	$password = filter_var($json->pass,FILTER_SANITIZE_STRING);

	// Validar datos.
	if($filter->isValid($usuario) && $filter->isValid($password)){
		$sql   = $db->select(array(
				'u.id id',
				'u.per_cuil usuario',
				'u.app app',
				'ju.usu_pass password',
				'ju.usu_estado estado',
				'jp.per_nombres nombre',
				'jp.per_apellidos apellido'

			))
			->from('usuarios u')
			->join('jujuy_usuarios ju','ju.per_cuil','=','u.per_cuil')
			->join('jujuy_personas jp','jp.per_cuil','=','u.per_cuil')
			->where('u.per_cuil','=',$usuario)
			->where('ju.usu_pass','=',$password)
			->where('ju.usu_estado','=',1)
			->where('u.app','=','adminpre');
		$query = $sql->execute();
		$user  = $query->fetch();
		if(is_array($user) && count($user) && $user['id']){

			// Buscar categorias de partes de prensa.
			$sql = $db->select(array(
				"upper(replace(pc.nombre,'-',' ')) nombre",
				'pc.id categoria'
			))
			->from('bloque_prensa bp')
			->join('partes_categoria pc','pc.id','=','bp.partes_categoria_id')
			->where('bp.jujuy_usuarios_per_cuil','=',$usuario);
			$query = $sql->execute();
			$categorias = $query->fetchAll();
			if(count($categorias)){
				$date                   = new DateTime();
				$_SESSION['loggedin']   = true;
				$_SESSION['loggeddate'] = $date->getTimestamp();
				$_SESSION['user']       = array(
					'id' => $user['id'],
					'nombre' => $user['nombre'].' '.$user['apellido'],
					'categorias' => $categorias
				);
				echo json_encode(array('result'=>true,'user'=>$_SESSION['user']),JSON_FORCE_OBJECT);
			}
			else {
				$main->error404();
			}			
		} else {
			$main->error404();
		}
	} else {
		$main->error404();
	}

});

$app->delete('/logout',function() use ($app,$db,$main){
	$json = json_encode(array('result'=>$main->loggedOut()));
	echo $json;
});

$app->get('/session',function() use ($app,$db,$main){
	$json = array(
		'result' => false
	);
	if(is_array($_SESSION) && (count($_SESSION) >= 3)){
		if($_SESSION['loggedin']){
			$date = new DateTime();
			$diff = ($date->getTimestamp() - intval($_SESSION['loggeddate'])) /1000;
			if($diff<=3600){
				$_SESSION['loggeddate'] = $date->getTimestamp();
				$json['result'] = true;
				echo json_encode($json,JSON_FORCE_OBJECT);
			}
			else {
				$main->error404();
			}
		}
		else{
			$main->error404();
		}
	}
	else {
		$main->error404();
	}
});

$app->run();