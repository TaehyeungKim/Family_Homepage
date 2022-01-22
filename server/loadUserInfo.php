<?php

include "connectDB.php";

$jsonData = file_get_contents("php://input");
$dataObject = json_decode($jsonData);

$user_id = $dataObject -> user_id;

$sqlUserName = "select name from members where user_id='$user_id'";
$sqlUserStatus = "select status from members where user_id='$user_id'";

$nameResult = mysqli_query($con, $sqlUserName);
$nameArray = mysqli_fetch_array($nameResult);
$name = $nameArray['name'];

$statusResult = mysqli_query($con, $sqlUserStatus);
$statusArray = mysqli_fetch_array($statusResult);
$status = $statusArray['status'];

$result = json_encode(array('user_name' => $name, 'user_status' => $status));
echo $result;


?>