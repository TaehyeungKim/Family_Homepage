<?php
session_start();

session_unset();
session_destroy();

$json = json_encode(array('message' => 'Logout Success'));
echo $json;

?>