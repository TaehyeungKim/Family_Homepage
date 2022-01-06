<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: image/jpeg");

$user_id = $_GET['user_id'];

$fileName = "./profileImage/profile_" . $user_id . ".jpeg";
$image = new Imagick($fileName);

echo $image;
?>