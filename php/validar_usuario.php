<?php
// añadimos el archivo de conexion
require 'conexion.php';

// guardamos los datos que nos mandaron
$user = $_GET['user'];
$pass = $_GET['pass'];

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  echo json_encode(null);
  die();
}

// validamos el usuario y la contraseña
$sql = "SELECT `username`,`password`,`permissions` FROM `usuarios` WHERE `username` = '$user'";
$resultado = mysqli_query($conexion, $sql);
$row = mysqli_fetch_array($resultado);

if (!is_null($row) && $row[0] == $user && password_verify($pass, $row[1])) {
  $new_row = array();
  $new_row['username'] = $row['username'];
  $new_row['permissions'] = $row['permissions'];
  echo json_encode($new_row);
} else {
  echo json_encode(null);
}

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
