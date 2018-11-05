<!DOCTYPE html>
<html>
<body>

<h2>The PHP Test</h2>

<?php
	$fileh = fopen("productos.txt",r) or die("No se puede abrir el archivo");
	$productos = fread($fileh, filesize("productos.txt"));
	echo($productos);
	fclose($fileh);
	
	$fileh = fopen("newproductos.txt",w) or die("No se puede crear el archivo");
	fwrite($fileh, $productos);
	fclose($fileh);
	
?>

</body>
</html>