import {useState, useRef, useEffect} from 'react'
import styles from './PhotoSelect.module.scss'
import camera from '../../images/camera_icon.png'
import PreviewImageContainer from '../PreviewImageContainer/PreviewImageContainer'
import {useMediaQuery} from 'react-responsive'; 

interface ImgExceedAlertProps {
    setStatus:(status:string) => void;
}

function ImgExceedAlert({setStatus}:ImgExceedAlertProps){

    const shouldDivideLine = useMediaQuery({
        query: '(max-width: 400px)'
    })
    return(
        <>
        <div className={styles.alertFrame}>
            <div className = {styles.alertBackground}></div>
            <div className = {styles.alertBox}>
                    {!shouldDivideLine ? 
                    <p>사진은 최대 5장까지 업로드할 수 있습니다.</p> : 
                    <p>사진은 최대 5장까지<br/>업로드할 수 있습니다.</p>}
                    
                    <button onClick = {()=>{setStatus('beforeUploadImage')}}>확인</button>
            </div>
        </div>
        </>
    )
}



interface SubmitImageProps {
    files: Array<File>;
    setImgFiles: (files: Array<File>) => void;
}

function SubmitImage({files, setImgFiles}: SubmitImageProps) {

    useEffect(() => {
        setImgFiles(files)
    });

    return (
        <>
        </>
    )
}


interface PhotoSelectProps {
    status: string;
    fetchData: boolean;
    setImgFiles: (files: Array<File>) => void;
    setStatus:(status:string) => void;
}


function PhotoSelect({status, fetchData, setImgFiles, setStatus}:PhotoSelectProps) {
    const Select = (event: any) => {
       event.preventDefault();
       photoInput.current?.click();
    }
    const photoInput = useRef<HTMLInputElement>(null);

    const [storedFiles, setStoredFiles] = useState<Array<File>>([]);
    const updateStoredFiles = (filelist:FileList, index: number) => {
        var copy = storedFiles
        copy.push(filelist.item(index) as File)
        setStoredFiles(copy)
    }

    const previewImage = useRef<Array<any>>([]);
    const [previewShownIndex, setPreviewShownIndex] = useState<number>(0);

    const changePreviewShownIndex = (direction: string) => {
        switch (direction) {
            case 'left':
                if(previewShownIndex > 0) {
                    setPreviewShownIndex(previewShownIndex-1)
                }
                break;
            case 'right':
                if(previewShownIndex < storedFiles.length - 1) {
                    setPreviewShownIndex(previewShownIndex+1)
                }
        }
    }

    const [touchOffsetX, setTouchOffsetX] = useState<number>(0);
    const [touchStatus, setTouchStatus] = useState<string>('')
    const touchStartMs = useRef<number>(0);

    const isMobile = useMediaQuery({
        query: '(max-width: 600px)'
    })

    const previewImageRendering = (filelist: FileList, index: number) => {
        
        const reader = new FileReader();
        reader.readAsDataURL(filelist.item(index) as File);
        reader.onloadend = () => {
            const img = new Image();
            img.src = reader.result as string;
            console.log('reader load end')
            img.onload = () => {
                previewImage.current.push({src: img.src, height: img.height, width: img.width})
                if(index < filelist.length-1) {
                    previewImageRendering(filelist, index+1);
                } else {
                    console.log('preview rendering finished', previewImage.current)
                    setStatus('imagePreview')
                }
            }
        }
    }

    useEffect(()=>{
        if(status === 'beforeUploadImage') {
            previewImage.current = [];
            setStoredFiles([]);
        }
    },[status])

    useEffect(()=>{
        if(touchStatus === 'start') {
            touchStartMs.current = Date.now();
        }
    },[touchStatus])
    

    return(
        <>
        {(()=>{
            switch(status) {
                case "beforeUploadImage":
                    return(
                        <>
                        <div className = {styles.wrapper}>
                            <div className = {styles.cameraContainer}>
                                <img src = {camera} alt = 'camera'/>
                            </div>
                            <div className = {styles.chooseButtonContainer}>
                                <button className = {styles.chooseButton} onClick={Select}>사진 선택하기</button>
                                <input type = 'file' hidden id = 'file' accept='image/*' multiple onChange={(event) => {
                                    const fileList = event.target?.files as FileList;
                                    for(let i = 0; i <= fileList.length-1; i++) {
                                        updateStoredFiles(fileList, i);
                                    }
                                    previewImageRendering(fileList, 0)
                                }} ref={photoInput}/>
                            </div>
                        </div>    
                        </>)
                default:
                    return(
                        <>  
                            {storedFiles.length > 5 ? <ImgExceedAlert setStatus={setStatus}/>:null}
                            <div className = {styles.prevButtonArea} id = {styles.left}>
                                <button onClick = {()=>{
                                changePreviewShownIndex('left')
                            }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                                    </svg>
                                </button>
                            </div>
                            <div className = {styles.prevButtonArea} id = {styles.right}>
                                <button onClick = {()=>{
                                changePreviewShownIndex('right')
                            }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                        <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
                                    </svg>
                                </button>
                                </div>
                            <PreviewImageContainer previewImage={previewImage} status={status} previewShownIndex={previewShownIndex} setPreviewShownIndex={setPreviewShownIndex} isMobile={isMobile} touchOffsetX={touchOffsetX} setTouchOffsetx={setTouchOffsetX} touchStatus={touchStatus} setTouchStatus={setTouchStatus} touchStartMs={touchStartMs.current}/>
                        </>
                    )           
            }})()}
        {fetchData === true ? <SubmitImage files={storedFiles} setImgFiles={setImgFiles}/> : null}
        </>
    )
}

export default PhotoSelect;