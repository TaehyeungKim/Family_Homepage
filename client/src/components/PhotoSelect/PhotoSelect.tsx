import React, {useState, useRef, useEffect} from 'react'
import styles from './PhotoSelect.module.scss'
import camera from '../../images/camera_icon.png'

interface PhotoSelectHeaderProps {
    backButtonDisplay:string;
    back?: () => void;
    nextButtonDisplay:string;
    next?: () => void;
}

function PhotoSelectHeader({backButtonDisplay, back, nextButtonDisplay, next}:PhotoSelectHeaderProps) {
    return(
        <>
            <div className = {styles.header}>
                <button className = {styles.headerButton} id = {styles.back} style={{display: backButtonDisplay}} onClick = {back}>취소</button>
                <p>새 게시물 만들기</p>
                <button className = {styles.headerButton} id = {styles.next} style={{display: nextButtonDisplay}} onClick = {next}>다음</button>
            </div>
        </>
    )
}

interface PhotoSelectProps {
    back?:() => void;
    next?:() => void;
    status: string;
}


function PhotoSelect({back, next, status}:PhotoSelectProps) {
    const Select = () => {
       photoInput.current?.click();
    }
    const photoInput = useRef<HTMLInputElement>(null);
    const [selectDone, setSelectDone] = useState<boolean>(false);
    const [previewImage, setPreviewImage] = useState<string>("");
    const [image, setImage] = useState<File>();
    

    useEffect(()=>{
        if (image) {
            const reader = new FileReader();
            reader.readAsDataURL(image as File);
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
                console.log((reader.result as string).length);
            }
        }

    }, [image])


    return(
        <>
        {selectDone === false ?
        <>
        <PhotoSelectHeader backButtonDisplay='none' nextButtonDisplay='none'/>
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
        <PhotoSelectHeader backButtonDisplay='block' nextButtonDisplay='block' back={
            status === 'write' ? back
        :
        () => {
            setSelectDone(false);
        }} next = {next}/>
        <div className = {styles.body}>
            <div className={styles.imageContainer}>
                <img src={previewImage} alt = 'preview'/>
            </div>
        </div>
        </>}
            
        </>
    )
}

export default PhotoSelect;