<?php

session_start();
// if($session_dir = scandir("../../../php/tmp")) {
//     foreach($session_dir as $file ) {
//         if($file[0] != "." and $file[1] != ".") {
//             $session_content = file_get_contents("../../../php/tmp/$file", false);
//             if(strlen($session_content) == 0) {
//                 break;
//             }
//             $ext1 = explode("user_id|s",$session_content);
//             $ext2 = explode("time|i", $ext1[1]);
//             $name = explode('"',$ext2[0])[1];
//             if($name != $_SESSION['user_id']) {
//                 break;
//             }
//             else {
//                 $time = intval(explode(";",explode(':',$ext2[1])[1])[0]);
//                 if(intval($_SESSION['time']) - $time > 60) {
//                     unlink("../../../php/tmp/$file");
//                 }
//             }
//         }
//     }
// }
$_SESSION['time'] = time();
$time = $_SESSION['time'];
$user_id = $_SESSION['user_id'];

include 'connectDB.php';

if(!$query = mysqli_query($con, "update members set lastlogin = $time where user_id = '$user_id'")) {
    echo("mysqli Error: " . mysqli_error($con));
}

mysqli_close($con);

?>



