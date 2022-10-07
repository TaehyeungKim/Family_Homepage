<?php
include "connectDB.php";
$now = time();


$loginedUserArr = array();
$unloginedUserArr = array();
$query_result = mysqli_query($con, "select * from members where isLogin='true' and lastlogin > $now - 60");

while($res = mysqli_fetch_array($query_result)) {
    array_push($loginedUserArr, $res['user_id']);
}

$query_result = mysqli_query($con, "select * from members where isLogin <> 'true' or lastlogin <= $now - 60");
while($res = mysqli_fetch_array($query_result)) {
    array_push($unloginedUserArr, $res['user_id']);
}

$json = json_encode(array('login'=>$loginedUserArr, 'unlogin'=>$unloginedUserArr));
echo $json;
?>