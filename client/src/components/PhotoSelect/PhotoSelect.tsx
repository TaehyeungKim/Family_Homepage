import React, {useState, useRef, useEffect} from 'react'
import styles from './PhotoSelect.module.scss'
import camera from '../../images/camera_icon.png'


interface SubmitImageProps {
    file: any;
    setImg: (files: FileList) => void;
}

function SubmitImage({file, setImg}: SubmitImageProps) {

    useEffect(() => {
        setImg(file)
    });

    return (
        <>
        </>
    )
}


interface PhotoSelectProps {
    status: string;
    fetchData: boolean;
    setImg: (files: FileList) => void;
    photoSelectFinished:() => void;
}


function PhotoSelect({status, fetchData, setImg, photoSelectFinished}:PhotoSelectProps) {
    const Select = (event: any) => {
       event.preventDefault();
       photoInput.current?.click();
    }
    const photoInput = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [image, setImage] = useState<File>();
    const [storedFiles, setStoredFiles] = useState<FileList>();


    useEffect(()=>{
        if (image) {
            const reader = new FileReader();
            reader.readAsDataURL(image as File);
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                console.log((reader.result as string).length);
            }
        }
        console.log(image);

    }, [image]);
    

    return(
        <>
        {status === "beforeUploadImage" ?
        <>
        <div className = {styles.wrapper}>
            <div className = {styles.cameraContainer}>
                <img src = {camera} alt = 'camera'/>
            </div>
            <div className = {styles.chooseButtonContainer}>
                <button className = {styles.chooseButton} onClick={Select}>사진 선택하기</button>
                <input type = 'file' hidden id = 'file' accept='image/*' multiple onChange={(event) => {
                    setStoredFiles(event.target?.files as FileList);
                    const file = event.target?.files?.item(0)
                    if (file) {
                        setImage(file);
                    }
                    photoSelectFinished();
                }} ref={photoInput}/>
            </div>
        </div>    
        </>
        :
        <>
            <div className={styles.imageContainer}>
                <img src={previewImage} alt = 'preview'/>
                {status === 'write' ? <input hidden type = 'file'/> : null}
            </div>

        </>}
        {fetchData === true ? <SubmitImage file={storedFiles} setImg={setImg}/> : null}
        </>
    )
}

export default PhotoSelect;