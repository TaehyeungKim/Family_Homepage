<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Location: http://localhost:3000/main_proxy");

include 'connectDB.php';

//if the user doesn't change the profile image
if(!($_FILES['profile_image']['name'] === "")) {
    include 'imageChange.php';
};

$changedName = $_POST['user_name'];
$changedStatus = $_POST['user_status'];
$user_id = $_POST['user_id'];
$changed_description = $_POST['self_description'];

$sqlUpdateName = "update members set name='$changedName' where user_id='$user_id'";
mysqli_query($con, $sqlUpdateName);

$sqlUpdateStatus = "update members set status='$changedStatus' where user_id='$user_id'";
mysqli_query($con, $sqlUpdateStatus);

$sqlUpdateDescription = "update members set self_description='$changed_description' where user_id='$user_id'";
mysqli_query($con, $sqlUpdateDescription);

?>