<?php

include 'connectDB.php';

session_start();

if ($_SESSION['isLogin'] === 'true') {
    exit();
}

$jsonData = file_get_contents("php://input");
$dataObject = json_decode($jsonData);

$inpId = $dataObject -> inpId;
$inpPw = $dataObject -> inpPw;

$sql = "select * from members where user_id ='$inpId'";

$result = mysqli_query($con, $sql);
$info = mysqli_fetch_array($result);

//Data to be Fetched to Client

if ($info == null) {
    $iderror = json_encode(array('message' => 'Wrong User Id', 'error_desc' => "ID doesn't exist"));
    echo $iderror;
} else {
    if ($info["user_password"] != $inpPw) {
        $pwerror = json_encode(array('message' => 'Wrong Password', 'error_desc' => "Password doesn't match"));
        echo $pwerror;
    } else {
        $_SESSION['isLogin'] = 'true';
        $_SESSION['user_id'] = $info['user_id'];
        $userData = json_encode(array('message' => 'Login Success', 'user_id' => $_SESSION['user_id'], 'isLogin' => $_SESSION['isLogin']));
        echo $userData;
    }
}

mysqli_close($con);
exit();
?>