import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Write.module.scss'
import PhotoSelect from '../PhotoSelect/PhotoSelect';
import Description from '../Description/Description';

interface FetchDataProps {
    imgFiles: FileList | undefined;
    desc: string;
}

function FetchData({imgFiles, desc}: FetchDataProps) {
    const navigate = useNavigate();

    const session = sessionStorage

    const url = "../server/postFeed.php"

    const fetchData = async(data: FormData) => {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        })
        const text = await response.text().then((value)=>{
            navigate(`/main_proxy`)});
    }

    useEffect(() => {
        const fileList = imgFiles as FileList;
        const formData = new FormData();
        formData.append("image", fileList[0]);
        formData.append("description", desc);
        formData.append("user_id", session.user_id);
        fetchData(formData);
    })
    return(
        <>
        <div className = {styles.waitFrame}>
            <div className = {styles.waitToUploadPopup}>
                <p>업로드 중입니다. 잠시만 기다려주세요.</p>
            </div>
        </div>
        </>
    )
}

interface WriteHeaderProps {
    backButtonDisplay:string;
    back?: (event: any) => void;
    nextButtonDisplay:string;
    next?: (event: any) => void;
    status: string;
    submit?:(event: any) => void;
}

function WriteHeader({backButtonDisplay, back, nextButtonDisplay, next, status, submit}:WriteHeaderProps) {
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


function Write() {

    const [status, setStatus] = useState<string>('beforeUploadImage');
    const [submit, setSubmit] = useState<boolean>(false);

    const [imgFiles, setImgFiles] = useState<FileList>();
    const [desc, setDesc] = useState<string>("");


    const setImg = (files: FileList) => {
        setImgFiles(files);
    }

    const setDescription = (desc: string) => {
        setDesc(desc);
    } 

    const moveToWrite = (event: any) => {
        event.preventDefault();
        setStatus('write')
    }
    const backToImageSelect = (event: any) => {
        event.preventDefault();
        setStatus('beforeUploadImage')
    }

    const photoSelectFinished = () => {
        setStatus('imagePreview');
    }

    return(
        <>
            <div className = {styles.container} id = {status === 'write' ? styles.containerWrite : styles.containerSelect}>
                {status === 'beforeUploadImage' ? 
                <WriteHeader backButtonDisplay='none' nextButtonDisplay='none' status={status}/>
                :
                <WriteHeader backButtonDisplay='block' nextButtonDisplay='block' status={status} back={
                    status === 'imagePreview' ? backToImageSelect
                :
                (e) => {
                    e.preventDefault();
                    photoSelectFinished();
                }} next = {moveToWrite} submit={()=>setSubmit(true)}/> }
                <div className = {styles.bodyContainer}>
                    <PhotoSelect status={status} fetchData={submit} setImg={setImg} photoSelectFinished={photoSelectFinished}/>
                    <Description status={status} setDescription={setDescription} fetchData={submit}/>
                </div>
            </div>
            {submit === true && imgFiles !== undefined && desc !=="" ? <FetchData imgFiles={imgFiles} desc={desc}/>: null}
        </>
    )
}

export default Write;