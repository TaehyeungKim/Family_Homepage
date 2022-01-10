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

interface PhotoSelectHeaderProps {
    backButtonDisplay:string;
    back?: (event: any) => void;
    nextButtonDisplay:string;
    next?: (event: any) => void;
    status: string;
    submit?:(event: any) => void;
}

function PhotoSelectHeader({backButtonDisplay, back, nextButtonDisplay, next, status, submit}:PhotoSelectHeaderProps) {
    return(
        <>
            <div className = {styles.header}>
                <button className = {styles.headerButton} id = {styles.back} style={{display: backButtonDisplay}} onClick = {back}>취소</button>
                <p>새 게시물 만들기</p>
                {status === 'write' ? 
                <button className = {styles.headerButton} id = {styles.next} style={{display: nextButtonDisplay}} onClick={submit} name='submit'>게시</button>
                :
                <button className = {styles.headerButton} id = {styles.next} style={{display: nextButtonDisplay}} onClick = {next}>다음</button>
                }
            </div>
        </>
    )
}

interface PhotoSelectProps {
    back?:(event: any) => void;
    next?:(event: any) => void;
    status: string;
    submit: (event: any) => void;
    fetchData: boolean;
    setImg: (files: FileList) => void;
}


function PhotoSelect({back, next, status, submit, fetchData, setImg}:PhotoSelectProps) {
    const Select = (event: any) => {
       event.preventDefault();
       photoInput.current?.click();
    }
    const photoInput = useRef<HTMLInputElement>(null);
    const [selectDone, setSelectDone] = useState<boolean>(false);
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
    
    const url = "http://localhost:8080/family-homepage/server/postFeed.php";

    return(
        <>
        {selectDone === false ?
        <>
        <PhotoSelectHeader backButtonDisplay='none' nextButtonDisplay='none' status={status}/>
        <div className = {styles.body}>
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
                    setSelectDone(true);
                }} ref={photoInput}/>
            </div>
        </div>
        </>
        :
        <>
        <PhotoSelectHeader backButtonDisplay='block' nextButtonDisplay='block' status={status} back={
            status === 'write' ? back
        :
        (e) => {
            e.preventDefault();
            setSelectDone(false);
        }} next = {next} submit={submit}/>
        <div className = {styles.body}>
            <div className={styles.imageContainer}>
                <img src={previewImage} alt = 'preview'/>
                {status === 'write' ? <input hidden type = 'file'/> : null}
            </div>
        </div>
        </>}
        {fetchData === true ? <SubmitImage file={storedFiles} setImg={setImg}/> : null}
        </>
    )
}

export default PhotoSelect;