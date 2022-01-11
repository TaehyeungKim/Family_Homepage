<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: image/*");

$user_id = $_GET['user_id'];

$availImgType = ['.jpeg', '.png', '.jpg'];

foreach($availImgType as $type) {
    if(file_exists("./profileImage/" . $user_id . "/profile_" . $user_id . $type)) {
        $fileName = "./profileImage/" . $user_id . "/profile_" . $user_id . $type;
        $image = new Imagick($fileName);
        echo $image;
        exit();
    }
}

//when the user's profile image doesn't exist
$default = "./profileImage/default/default.jpg";
$defaultImg = new Imagick($default);
echo $defaultImg;
?>