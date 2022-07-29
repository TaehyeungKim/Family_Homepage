<?php

include 'connectDB.php';

$user_id = $_POST['user_id'];
$feed_id = $_POST['feed_id'];
$photo_type_arr = explode(",", $_POST['photo_type']);


$inquire = mysqli_query($con, "select photo_path from feed_$user_id where feed_id = '$feed_id'");
$inquireResult = mysqli_fetch_array($inquire)['photo_path'];
$numberOfImg = count(explode(",",$inquireResult));

$deleteQuery = "delete from feed_$user_id where feed_id = '$feed_id'";
mysqli_query($con, $deleteQuery);
//deleting feed image files and directory of feed
for($i = 1; $i <= $numberOfImg; $i++) {
    $e = $photo_type_arr[$i-1];
    unlink("./feedImgs/$user_id/$feed_id/$feed_id-$i$e");
}
rmdir("./feedImgs/$user_id/$feed_id");

echo "delete success!";

//when any feeds of the individual exist, change the column 'feed_exists' of table 'members' to null
$feed_data_array = array();
$queryResult = mysqli_query($con, "select * from feed_$user_id");
while($r = mysqli_fetch_array($queryResult)) {
    array_push($feed_data_array, $r);
}

if (empty($feed_data_array)) {
    mysqli_query($con, "update members set feed_exists=null where user_id='$user_id'");
    //drop the comment table first, due to the data referential integrity
    mysqli_query($con, "drop table comment_to_$user_id");
    mysqli_query($con, "drop table feed_$user_id");
}

?>