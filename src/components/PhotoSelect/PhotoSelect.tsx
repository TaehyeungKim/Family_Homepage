import React, {useState, useRef, useEffect} from 'react'
import styles from './PhotoSelect.module.scss'
import camera from '../../images/camera_icon.png'

interface PhotoSelectHeaderProps {
    backButtonDisplay:string;
    onClick?: () => void;
}

function PhotoSelectHeader({backButtonDisplay, onClick}:PhotoSelectHeaderProps) {
    return(
        <>
            <div className = {styles.header}>
                <button className = {styles.backButton} style={{display: backButtonDisplay}} onClick = {onClick}>취소</button>
                <p>새 게시물 만들기</p>
            </div>
        </>
    )
}


function PhotoSelect() {
    const Select = () => {
       photoInput.current?.click();
    }
    const photoInput = useRef<HTMLInputElement>(null);
    const [selectDone, setSelectDone] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [image, setImage] = useState<File>();
    

    useEffect(()=>{
        const reader = new FileReader();
        reader.readAsDataURL(image as File);
        reader.onloadend = () => {
            setPreviewImage(reader.result as string);
        }
    }, [image])


    return(
        <>
        {selectDone === false ?
        <>
        <PhotoSelectHeader backButtonDisplay='none'/>
        <div className = {styles.body}>
            <div className = {styles.cameraContainer}>
                <img src = {camera} alt = 'camera'/>
            </div>
            <div className = {styles.chooseButtonContainer}>
                <button className = {styles.chooseButton} onClick={Select}>사진 선택하기</button>
                <input type = 'file' hidden id = 'file' accept='image/*' multiple onChange={(event) => {
                    const file = event.target?.files?.item(0)
                    if (file) {
                        setImage(file);
                    } else {
                        setImage(undefined);
                    }
                    setSelectDone(true);
                }} ref={photoInput}/>
            </div>
        </div>
        </>
        :
        <>
        <PhotoSelectHeader backButtonDisplay='block' onClick={()=>{
            setSelectDone(false);
        }}/>
        <div className = {styles.body}>
            <div className={styles.imageContainer}>
                <img src={previewImage}/>
            </div>
        </div>
        </>}
            
        </>
    )
}

export default PhotoSelect;