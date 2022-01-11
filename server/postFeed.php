<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");

include 'connectDB.php';

$user_id = $_POST['user_id'];
$user_desc = $_POST['description'];

$availableImgType = ['.jpeg', '.png', '.jpg', '.gif'];
$fileType = explode("/", $_FILES['image']['type'])[1];

//check if individual feed table exists
$checkIfFeedExists = mysqli_query($con, "select feed_exists from members where user_id='$user_id'");
$checkResult = mysqli_fetch_array($checkIfFeedExists);
if ($checkResult['feed_exists'] != 'true')  {
    mysqli_query($con, "create table feed_" . $user_id . " (feed_id int(11) auto_increment not null, user_id varchar(255) not null, created_at datetime, text varchar(10000), photo_path varchar(5000), primary key(feed_id))");
    mysqli_query($con, "update members set feed_exists = 'true' where user_id = '$user_id'");   
}

$queryFeedIdCommand = "select feed_id from feed_" . $user_id;
$queryFeedId = mysqli_query($con, $queryFeedIdCommand);

$feedIdArray = array();

while($queryFeedIdResult = mysqli_fetch_array($queryFeedId)) {
    array_push($feedIdArray, $queryFeedIdResult);
}

if (!empty($feedIdArray)) {
    $lastFeedId = end($feedIdArray)['feed_id'];
    $newFeedId = $lastFeedId + 1;
} else {
    $newFeedId = 1;
}

//check if individual user folder exists
if(!(file_exists('./feedImgs/' . $user_id))) {
    mkdir('./feedImgs/' . $user_id);
}

$newImgDir = "feedImgs/" . $user_id . "/" . $newFeedId;
mkdir($newImgDir);
move_uploaded_file($_FILES['image']['tmp_name'], $newImgDir . "/" . $newFeedId . "." . $fileType);

$insertQuery = "insert into feed_" . $user_id . " (user_id, created_at, text, photo_path) values ('$user_id', NOW(), '$user_desc', '$newImgDir/$newFeedId.$fileType')";
mysqli_query($con, $insertQuery);
?>