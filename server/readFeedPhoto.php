<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");

include 'connectDB.php';

$photoPath = $_GET['photo_path'];
$photo = new Imagick($photoPath);
echo $photo;

?>