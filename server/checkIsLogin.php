<?php

session_start();

if(isset($_SESSION['isLogin'])) {
    $json = json_encode(array('isLogin' => 'true', 'user_id' => $_SESSION['user_id']));
    echo $json;
} else {
    $json = json_encode(array('isLogin' => 'false'));
    echo $json;
}
?>