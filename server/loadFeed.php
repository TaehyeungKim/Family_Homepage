<?php

include 'connectDB.php';

//query the user list who has own feed posts
$query = mysqli_query($con, "select user_id from members where feed_exists='true'");
$user_id_array = array();

while($result = mysqli_fetch_array($query)) {
    $user_id = $result['user_id'];
    array_push($user_id_array, $user_id);
}

$query = mysqli_query($con, "select user_id from members where feed_exists='false' or feed_exists is null");
$nofeed_user_id_array = array();

while($result = mysqli_fetch_array($query)) {
    $user_id = $result['user_id'];
    array_push($nofeed_user_id_array, $user_id);
}

//query the individual feed table
$command = "";
foreach ($user_id_array as $id) {
    if ($command == "") {
        $command = $command . "select * from feed_$id ";
    } else {
        $command = $command . "union select * from feed_$id ";
    }
}
$command = $command . "order by created_at desc";

$queryResult = mysqli_query($con, $command);

//data json_encoding
$data_array = array();
while($r = mysqli_fetch_array($queryResult)) {
    array_push($data_array, $r);
}

if(empty($data_array)) {
    $json = json_encode(array('data' => 'empty'));
} else {
    $json = json_encode(array('data' => $data_array, 'user_id_array' => $user_id_array, 'nofeed_user_id_array' => $nofeed_user_id_array));
}

echo $json;
?>