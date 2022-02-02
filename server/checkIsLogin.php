<?php
header("Access-Control-Allow-Origin: http://localhost:3000");

session_start();

if(isset($_SESSION['isLogin'])) {
    $json = json_encode(array('isLogin' => 'true'));
    echo $json;
} else {
    $json = json_encode(array('isLogin' => 'false'));
    echo $json;
}
?>