<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");

var_dump($_GET);

// $jsonData = file_get_contents("php://input");

// $dataObject = json_decode($jsonData);

// $user_id = $dataObject -> user_id;
// $imageData = $dataObject -> image;

// file_put_contents("./utils/profileImage/profile_'$user_id'")

?>