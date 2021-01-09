<?php
// añadimos el archivo de conexion
require 'conexion.php';

// traemos los datos del formulario
$user = $_POST['user'];
$pass = $_POST['pass'];
$permits = $_POST['permits'];

// encriptamos la contraseña
$config_hash = [
    'cost' => 12,
];
$pass_encrypt = password_hash($pass, PASSWORD_BCRYPT, $config_hash);

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  $error = array(false, "Error al conectar a la base de datos");
  echo json_encode($error);
  die();
}

// validamos de que el usuario no exista
$sql = "SELECT `username` FROM `usuarios` WHERE `username` = '$user'";
$resultado = mysqli_query($conexion, $sql);
$row = mysqli_fetch_array($resultado);

if (!is_null($row) && $row[0] == $user) {
  $error = array(false, "El usuario ya esta registrado en la bd");
  echo json_encode($error);
  die();
}

// registramos el usuario en la bd
$sql = "INSERT INTO `usuarios` (`id`, `fechayhora`, `username`, `password`, `permissions`) VALUES (NULL, CURRENT_TIMESTAMP, '$user', '$pass_encrypt', '$permits');";
$resultado = mysqli_query($conexion, $sql);

if ($resultado) {
  $error = array(true, "Usuario registrado Satisfactoriamente");
  echo json_encode($error);
} else {
  $error = array(false, "Ocurrio un error al intentar registrar el usuario");
  echo json_encode($error);
}

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
