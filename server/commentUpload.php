<?php
header("Access-Control-Allow-Origin: http://localhost:3000");

include 'connectDB.php';

$feed_id = $_POST['feed_id'];
settype($feed_id, "integer");

$feed_user = $_POST['feed_user'];
$comment_user = $_POST['comment_user'];
$comment = $_POST['comment'];

if(!mysqli_query($con, "insert into comment_to_$feed_user (feed_id, comment_user, created_at, comment) values (
    $feed_id, 
    '$comment_user',
    NOW(),
    '$comment'
    )")
) {
    echo mysqli_error($con);
}

//change the 'comment_exists' colmun to 'true' if that was null
$checkquery = mysqli_query($con, "select comment_exists from feed_$feed_user where feed_id=$feed_id");
$r = mysqli_fetch_array($checkquery);
if ($r['comment_exists'] != 'true') {
    mysqli_query($con, "update feed_$feed_user set comment_exists = 'true' where feed_id = $feed_id");    
}
?>