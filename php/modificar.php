<?php
// añadimos el archivo de conexion
require 'conexion.php';

// traemos los datos del formulario
$id = $_POST['id'];
$pass = $_POST['pass'];
$permits = $_POST['permits'];

// definimos las variables
$sql = "";

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  $error = array(false, "Error al conectar a la base de datos");
  echo json_encode($error);
  die();
}

// creamos la consulta sql
if (isset($pass)) {
  // encriptamos la contraseña
  $config_hash = [
      'cost' => 12,
  ];
  $pass_encrypt = password_hash($pass, PASSWORD_BCRYPT, $config_hash);
  $sql = "UPDATE `usuarios` SET `password` = '$pass_encrypt', `permissions` = '$permits' WHERE `usuarios`.`id` = '$id';";
} else {
  $sql = "UPDATE `usuarios` SET `permissions` = '$permits' WHERE `usuarios`.`id` = '$id';";
}
// modificamos el usuario de la bd
$resultado = mysqli_query($conexion, $sql);

if ($resultado) {
  $error = array(true, "Usuario modificado Satisfactoriamente");
  echo json_encode($error);
} else {
  $error = array(false, "Ocurrio un error al intentar modificar el usuario");
  echo json_encode($error);
}

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
