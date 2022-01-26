<?php

include 'connectDB.php';

$feed_user = $_POST['feed_user'];
$feed_id = $_POST['feed_id'];
$comment_id = $_POST['comment_id'];
settype($feed_id, "integer");
settype($comment_id, "integer");

if(!mysqli_query($con, "delete from comment_to_$feed_user where comment_id=$comment_id")) {
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