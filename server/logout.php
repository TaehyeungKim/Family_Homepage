<?php
session_start();

include "connectDB.php";


$user_id = $_SESSION['user_id'];
$json = json_encode(array('message' => 'Logout Success', 'user_id'=>$user_id));

mysqli_query($con, "update members set isLogin = 'false' where user_id = '$user_id'");


session_destroy();

echo $json;

?>