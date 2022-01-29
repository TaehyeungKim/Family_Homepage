<?php
header("Location: ../main_proxy");

include 'connectDB.php';

//if the user doesn't change the profile image
if(!($_FILES['profile_image']['name'] === "")) {
    include 'imageChange.php';
};

$changedName = $_POST['user_name'];
$changedStatus = $_POST['user_status'];
$user_id = $_POST['user_id'];

$sqlUpdateName = "update members set name='$changedName' where user_id='$user_id'";
mysqli_query($con, $sqlUpdateName);

$sqlUpdateStatus = "update members set status='$changedStatus' where user_id='$user_id'";
mysqli_query($con, $sqlUpdateStatus);

//change user_description
for ($i = 1; $i <= 5; $i++) {
    if (isset($_POST["desc$i"])) {
        $desc = $_POST["desc$i"];
        $sqlUpdateDescription = "update members set desc$i='$desc' where user_id='$user_id'";
        mysqli_query($con, $sqlUpdateDescription);
    } else if (!(isset($_POST["desc$i"]))){
        $sqlUpdateDescription = "update members set desc$i=null where user_id='$user_id'";
        if(!mysqli_query($con, $sqlUpdateDescription)) {
            echo "Error";
        }
        
    }
}

//check if the profile image is changed to default
if (isset($_POST['default'])) {
    $scandir = scandir("./profileImage/" . $user_id);
    $file = end($scandir);
    unlink("./profileImage/$user_id/$file");
    echo 'delete success';
}

?>