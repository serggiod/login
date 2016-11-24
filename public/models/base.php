<?php
// Inicio de session.
session_start();

// Requerir instacia de Wordpress.
require_once '../../vendor/autoload.php';

// Funciones.
class main {

	function loggedIn(){
	    $return = false;
	    $time   = time() - $_SESSION['loggedtime'];
	    if($_SESSION['loggedin'] && $time<=3600) $return = true;
	    return $return;
	}

	function loggedOut(){
		$_SESSION['loggedin']   = false;
		$_SESSION['loggeddate'] = null;
		unset($_SESSION);
		session_unset();
		session_destroy();
		return true;
	}

	function error404(){
		header("Status: 404 Not Found",true);
		header('HTTP/1.0 404 Not Found',true);
		header('Conection: close',true);
		die;
	}

	function sessionStatus(){
		if(is_array($_SESSION) && (count($_SESSION) >= 3)){
			if($_SESSION['loggedin']){
				$date = new DateTime();
				$diff = ($date->getTimestamp() - intval($_SESSION['loggeddate'])) /1000;
				
				if($diff<=3600){
					$_SESSION['loggeddate'] = $date->getTimestamp();
					return true;
				}

				else {
					return false;
				}
			}
			
			else{
				return false;
			}
		}

		else {
			return false;
		}
	}

}

// Instancia de main.
$main = new main();

// Instancia de Slim Framework.
$app = new \Slim\App;

// Instancia de las base de datos Slim.
$dns   = explode('|',file_get_contents('../../../dblegweb.dsn'));
$db  = new \Slim\PDO\Database(trim($dns[0]),trim($dns[1]),trim($dns[2]));