<?php
header("Access-Control-Allow-Origin: http://localhost:3000");

include 'connectDB.php';

$comment_created_at = $_POST['created_at'];
$comment_user = $_POST['comment_user'];
$feed_user = $_POST['feed_user'];
$feed_id = $_POST['feed_id'];
settype($feed_id, "integer");

if(!mysqli_query($con, "delete from comment_to_$feed_user where created_at='$comment_created_at' and comment_user='$comment_user' and feed_id=$feed_id")) {
    echo mysqli_error($con);
} else {
    echo "delete success";
}

//check whether any comments of this feed exist
$comment_data_array = array();
$query = mysqli_query($con, "select comment from comment_to_$feed_user where feed_id=$feed_id");
while($r=mysqli_fetch_array($query)) {
    array_push($comment_data_array, $r);
}

if(empty($comment_data_array)) {
    if(!mysqli_query($con, "update feed_$feed_user set comment_exists=null where feed_id=$feed_id")) {
        echo mysqli_error($con);
    }
}
?>