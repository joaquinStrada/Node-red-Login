<?php
// añadimos el archivo de conexion
require 'conexion.php';

// traemos los datos de javascript
$id = $_POST['id'];

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  $error = array(false, "Error al conectar a la base de datos");
  echo json_encode($error);
  die();
}

// eliminamos el usuario de la bd
$sql = "DELETE FROM `usuarios` WHERE `usuarios`.`id` = '$id'";
$resultado = mysqli_query($conexion, $sql);

if ($resultado) {
  $error = array(true, "Usuario eliminado Satisfactoriamente");
  echo json_encode($error);
} else {
  $error = array(false, "Ocurrio un error al intentar eliminar el usuario");
  echo json_encode($error);
}

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
