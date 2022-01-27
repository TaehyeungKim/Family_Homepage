<?php

$availableImgType = ['.jpeg', '.png', '.jpg', '.gif'];
$path = "./profileImage/" . $_POST['user_id'] . "/" . "profile_" . $_POST['user_id'];

foreach($availableImgType as $type) {
    if(file_exists($path . $type)) {
        unlink($path . $type);
        break;
    }
}

$fileType= explode("/",$_FILES['profile_image']['type'])[1];
$fileDir = $path . "." . $fileType;

if(!(file_exists("./profileImage/" . $_POST['user_id']))) {
    mkdir("./profileImage/" . $_POST['user_id']);
}

$originFile = $_FILES['profile_image']['tmp_name'];

// move_uploaded_file($_FILES['profile_image']['tmp_name'],$fileDir);

switch ($fileType) {
    case 'jpeg':
        $sourceImg= imagecreatefromjpeg($originFile);
        //read exif header of jpeg file
        $exif = exif_read_data($originFile);
        switch ($exif['Orientation']) {
            case 8:
                $sourceImg = imagerotate($sourceImg,90,0); 
                break;
            case 3:
                $sourceImg = imagerotate($sourceImg,180,0); 
                break;
            case 6:
                $sourceImg = imagerotate($sourceImg,-90,0); 
                break;
        }
        imagejpeg($sourceImg, $fileDir, 40);
        break;
    case 'png':
        $sourceImg = imagecreatefrompng($originFile);
        imagealphablending($sourceImg, true);
        imagesavealpha($sourceImg, true);
        imagepng($sourceImg, $fileDir, 5);
        break;
    case 'gif':
        move_uploaded_file($originFile, $fileDir);
        break;
}

echo 'profile change success';
?>