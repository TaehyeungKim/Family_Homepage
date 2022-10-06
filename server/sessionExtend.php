<?php
session_start();

//storing prev session info

$prev_ss_id = $_SESSION['user_id'];
$prev_ss_isLogin = $_SESSION['isLogin'];

session_destroy();

$_SESSION['user_id'] = $prev_ss_id;
$_SESSION['isLogin'] = $prev_ss_isLogin;

echo "session updated";
?>

