<?php
// añadimos el archivo de conexion
require 'conexion.php';

// nos conectamos a la bd
$conexion = conectar();
if (!$conexion) {
  $error = array(false, "Error al conectar a la base de datos");
  echo json_encode($error);
  die();
}

// recuperamos los datos de la tabla usuarios
$sql = "SELECT `id`,`fechayhora`,`username`,`permissions` FROM `usuarios`";
$resultado = mysqli_query($conexion, $sql);

// modelamos los datos para ser devueltos
$num_rows = mysqli_num_rows($resultado);
$rows = array();

for ($i=0; $i < $num_rows; $i++) {
  $rows[$i] = mysqli_fetch_array($resultado);
}

// devolvemos los datos
echo json_encode($rows);

// cerramos la conexion con la bd
mysqli_close($conexion);
?>
