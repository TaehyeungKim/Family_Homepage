<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");

include 'connectDB.php';

$user_id = $_POST['user_id'];
$user_desc_array = explode("'", $_POST['description']);
$user_desc = "";

for ($c = 1; $c <= (count($user_desc_array) - 1); $c++) {
    $user_desc = $user_desc . $user_desc_array[$c-1] . "'";
} 

$user_desc = $user_desc . end($user_desc_array);

$availableImgType = ['.jpeg', '.png', '.jpg', '.gif'];
$fileType = explode("/", $_FILES['image']['type'])[1];

//check if individual feed table exists
$checkIfFeedExists = mysqli_query($con, "select feed_exists from members where user_id='$user_id'");
$checkResult = mysqli_fetch_array($checkIfFeedExists);
if ($checkResult['feed_exists'] != 'true')  {
    mysqli_query($con, "create table feed_" . $user_id . " (feed_id int(11) auto_increment not null, user_id varchar(255) not null, created_at datetime, text varchar(10000), photo_path varchar(5000), photo_type varchar(10), comment_exists varchar(4), primary key(feed_id))");
    mysqli_query($con, "create table comment_to_$user_id (comment_id int(11) auto_increment not null, feed_id int(11) not null, comment_user varchar(255) not null, created_at datetime, comment varchar(5000), primary key(comment_id), foreign key(feed_id) references feed_$user_id(feed_id) on delete cascade)");
    mysqli_query($con, "update members set feed_exists = 'true' where user_id = '$user_id'");   
}

//insert feed data except photo
$insertSql = "insert into feed_$user_id (user_id, created_at, text) values (\"$user_id\", NOW(), \"$user_desc\")";
mysqli_query($con, $insertSql);

$queryFeedIdCommand = "select feed_id from feed_$user_id";
$queryFeedId = mysqli_query($con, $queryFeedIdCommand);

$feedIdArray = array();

while($queryFeedIdResult = mysqli_fetch_array($queryFeedId)) {
    array_push($feedIdArray, $queryFeedIdResult);
}

$newFeedId = end($feedIdArray)['feed_id'];

//check if individual user folder exists
if(!(file_exists('./feedImgs/' . $user_id))) {
    mkdir('./feedImgs/' . $user_id);
}

$newImgDir = "feedImgs/$user_id/$newFeedId";
mkdir($newImgDir);
move_uploaded_file($_FILES['image']['tmp_name'], $newImgDir . "/" . $newFeedId . "." . $fileType);

$setPhotoPath = "update feed_$user_id set photo_path = '$newImgDir/$newFeedId.$fileType' where feed_id=$newFeedId";
$setPhotoType = "update feed_$user_id set photo_type = '.$fileType' where feed_id=$newFeedId";

mysqli_query($con, $setPhotoPath);
mysqli_query($con, $setPhotoType);
?>