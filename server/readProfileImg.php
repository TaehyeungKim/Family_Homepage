<?php
header("Content-Type: image/*");

$user_id = $_POST['user_id'];

$availImgType = ['.jpeg', '.png', '.jpg'];

foreach($availImgType as $type) {
    if(file_exists("./profileImage/" . $user_id . "/profile_" . $user_id . $type)) {
        $fileName = "./server/profileImage/" . $user_id . "/profile_" . $user_id . $type;
        $jsonData = json_encode(array('path' => $fileName));
        // $image = new Imagick($fileName);
        echo $jsonData;
        exit();
    }
}

//when the user's profile image doesn't exist
$default = "./server/profileImage/default/default.jpg";
$json = json_encode(array('path' => $default));

// $defaultImg = new Imagick($default);
// echo $defaultImg;
echo $json;
?>