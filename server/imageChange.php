<?php

$availableImgType = ['.jpeg', '.png', '.jpg'];
$path = "./profileImage/" . $_POST['user_id'] . "/" . "profile_" . $_POST['user_id'];

foreach($availableImgType as $type) {
    if(file_exists($path . $type)) {
        unlink($path . $type);
        break;
    }
}

$fileType= explode("/",$_FILES['profile_image']['type'])[1];

if(file_exists("./profileImage/" . $_POST['user_id'])) {
    $fileDir = $path . "." . $fileType;
    move_uploaded_file($_FILES['profile_image']['tmp_name'],$fileDir);
} else {
    mkdir("./profileImage/" . $_POST['user_id']);
    move_uploaded_file($_FILES['profile_image']['tmp_name'], "./profileImage/" . $_POST['user_id'] . "/" . "profile_" . $_POST['user_id'] . "." . $fileType);
}
?>