<?php
function conectar()
{
  // configuracion de la bd
  $host="localhost";
  $user="admin_joaquin";
  $password="joaquin#2005";
  $bd="admin_nodered";

  $conexion = mysqli_connect($host, $user, $password, $bd);
  if ($conexion) {
    mysqli_query($conexion,"SET NAMES 'utf8'");
  }
  return $conexion;
}
?>
