import {useState, useEffect, useContext} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Write.module.scss'
import PhotoSelect from '../PhotoSelect/PhotoSelect';
import Description from '../Description/Description';
import Urls from '../../utils/Url';

import {HandlerContext} from '../../App'


interface FetchDataProps {
    imgFiles: Array<File> | undefined;
    description: string;
}

function FetchData({imgFiles, description}: FetchDataProps) {
    const navigate = useNavigate();


    const context = useContext(HandlerContext)

    const url = Urls.postFeed;

    const fetchData = async(data: FormData) => {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        })
        const text = await response.text().then((value)=>{
            navigate(`/main_proxy`)});
    }

    useEffect(() => {
        const fileList = imgFiles as Array<File>;
        const formData = new FormData();
        for(let i = 1; i <= fileList.length; i++) {
            formData.append(`image${i}`, fileList[i-1]);
        }
        formData.append("description", description);
        formData.append("user_id", context.getLoginUser('user_id'));
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

    const [imgFiles, setImgFiles] = useState<Array<File>>([]);
    const [description, setDescription] = useState<string>("");

    return(
        <>
            <div className = {styles.container} id = {status === 'write' ? styles.containerWrite : styles.containerSelect}>
                {status === 'beforeUploadImage' ? 
                <WriteHeader backButtonDisplay='none' nextButtonDisplay='none' status={status}/>
                :
                <WriteHeader backButtonDisplay='block' nextButtonDisplay='block' status={status} back={
                    status === 'imagePreview' ? ()=>{
                        setStatus('beforeUploadImage')}
                :
                (e) => {
                    e.preventDefault();
                    setStatus('imagePreview');
                }} next = {()=>{setStatus('write')}} submit={()=>setSubmit(true)}/> }
                <div className = {styles.bodyContainer}>
                    <PhotoSelect status={status} fetchData={submit} setImgFiles={setImgFiles} setStatus={setStatus}/>
                    <Description status={status} setDescription={setDescription} fetchData={submit}/>
                </div>
            </div>
            {submit === true && imgFiles !== undefined && description !=="" ? <FetchData imgFiles={imgFiles} description={description}/>: null}
        </>
    )
}

export default Write;