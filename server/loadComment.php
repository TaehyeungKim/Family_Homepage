<?php

include 'connectDB.php';

$feed_user = $_POST['feed_user'];
$feed_id = $_POST['feed_id'];
settype($feed_id, "integer");

$query = mysqli_query($con, "select * from comment_to_$feed_user where feed_id=$feed_id");
$data_array = array();
while ($r = mysqli_fetch_array($query)) {
    array_push($data_array, $r);
}

$json = json_encode(array('data' => $data_array));
echo $json;

?>