<?php
// Ruta al archivo JSON
$rutaArchivoJson = 'alimentos.json';

// Verificar si el archivo existe
if (file_exists($rutaArchivoJson)) {
    // Leer el contenido del archivo JSON
    $contenidoJson = file_get_contents($rutaArchivoJson);

    // Imprimir el contenido JSON
    echo $contenidoJson;
} else {
    // Manejar el error si el archivo no existe
    echo json_encode(['error' => 'El archivo no existe']);
}
?>