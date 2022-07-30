<?php

include 'connectDB.php';

$user_id = $_POST['user_id'];
$user_desc_array = explode("'", $_POST['description']);
$user_desc = "";

for ($c = 1; $c <= (count($user_desc_array) - 1); $c++) {
    $user_desc = $user_desc . $user_desc_array[$c-1] . "'";
} 

$user_desc = $user_desc . end($user_desc_array);

$availableImgType = ['.jpeg', '.png', '.jpg', '.gif'];
$fileTypeArr = array();
$number = 1;
while(isset($_FILES["image$number"])) {
    $fileType = explode("/", $_FILES["image$number"]['type'])[1];
    array_push($fileTypeArr, $fileType);
    $number = $number + 1;
}

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

//check if individual user folder exists and should make it
if(!(file_exists("./feedImgs/$user_id"))) {
    mkdir("./feedImgs/$user_id");
}
$newImgDir = "feedImgs/$user_id/$newFeedId";
mkdir($newImgDir);


$imgPathGroup = "";
$fileTypeGroup = "";
for ($n=1; $n < $number; $n++) {
    $tmpFile = $_FILES["image$n"]['tmp_name'];
    $type = $fileTypeArr[$n-1];
    //upload compressed image to the new path;
    $imagePath = "$newImgDir/$newFeedId-$n.$type";
    if($n==1) {
        $imgPathGroup = $imgPathGroup . "./server/$imagePath";
        $fileTypeGroup = $fileTypeGroup . "." . $type;
    } else {
        $imgPathGroup = $imgPathGroup . "," . "./server/$imagePath"; 
        $fileTypeGroup = $fileTypeGroup . "," . "." . $type;
    }

    switch ($fileType) {
        case 'jpeg':
            //read exif header of jpeg file
            $exif = exif_read_data($tmpFile);
            $sourceImg= imagecreatefromjpeg($tmpFile);
            switch ($exif['Orientation']) {
                case 8:
                    $sourceImg = imagerotate($sourceImg,90,0); 
                    break;
                case 3:
                    $sourceImg = imagerotate($sourceImg,180,0); 
                    break;
                case 6:
                    $sourceImg = imagerotate($sourceImg,-90,0); 
                    break;
            }
            imagejpeg($sourceImg, $imagePath, 40);
            break;
        case 'png':
            $sourceImg = imagecreatefrompng($tmpFile);
            imagealphablending($sourceImg, true);
            imagesavealpha($sourceImg, true);
            imagepng($sourceImg, $imagePath, 5, -1);
            break;
        case 'gif':
            move_uploaded_file($tmpFile, $imagePath);
            break;
    }
}

$setPhotoPath = "update feed_$user_id set photo_path = '$imgPathGroup' where feed_id=$newFeedId";
$setPhotoType = "update feed_$user_id set photo_type = '$fileTypeGroup' where feed_id=$newFeedId";

mysqli_query($con, $setPhotoPath);
mysqli_query($con, $setPhotoType);

echo "post success";


?>