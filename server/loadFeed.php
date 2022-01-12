<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");

include 'connectDB.php';

//query the user list who has own feed posts
$query = mysqli_query($con, "select user_id from members where feed_exists='true'");
$user_id_array = array();

while($result = mysqli_fetch_array($query)) {
    $user_id = $result['user_id'];
    array_push($user_id_array, $user_id);
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
$command = $command . "order by created_at asc";

$queryResult = mysqli_query($con, $command);

//data json_encoding
$data_array = array();
while($r = mysqli_fetch_array($queryResult)) {
    array_push($data_array, $r);
}

if(empty($data_array)) {
    $json = json_encode(array('data' => 'empty'));
} else {
    $json = json_encode(array('data' => $data_array));
}

echo $json;
?>