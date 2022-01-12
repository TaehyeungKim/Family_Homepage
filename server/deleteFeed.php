<?php
header("Access-Control-Allow-Origin: http://localhost:3000");

include 'connectDB.php';

$user_id = $_POST['user_id'];
$feed_id = $_POST['feed_id'];
$photo_type = $_POST['photo_type'];

$deleteQuery = "delete from feed_$user_id where feed_id = '$feed_id'";

mysqli_query($con, $deleteQuery);
unlink("./feedImgs/$user_id/$feed_id/$feed_id$photo_type");
rmdir("./feedImgs/$user_id/$feed_id");

echo "delete success!"
?>