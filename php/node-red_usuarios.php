<?php
// añadimos el archivo de conexion
require 'conexion.php';

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  echo json_encode(null);
  die();
}

// recuperamos los usuarios de la tabla
$sql = "SELECT `username`,`password`,`permissions` FROM `usuarios`";
$resultado = mysqli_query($conexion, $sql);

// modelamos los datos para ser devueltos
$num_rows = mysqli_num_rows($resultado);
$rows = array();

for ($i=0; $i < $num_rows; $i++) {
  $row = mysqli_fetch_array($resultado);
  $new_row = array();
  $new_row['username'] = $row['username'];
  $new_row['password'] = $row['password'];
  $new_row['permissions'] = $row['permissions'];
  $rows[$i] = $new_row;
}

// devolvemos los datos
echo json_encode($rows);

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
