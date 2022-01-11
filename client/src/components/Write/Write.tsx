import React, {useState, useEffect} from 'react'
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

    const url = "http://localhost:8080/family-homepage/server/postFeed.php"

    const fetchData = async(data: FormData) => {
        const response = await fetch(url, {
            method: 'POST',
            body: data
        })
        const text = await response.text().then(()=>{navigate(`/main`)});
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
        <></>
    )
}


function Write() {

    const [status, setStatus] = useState<string>('uploadImage');
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
        setStatus('uploadImage')
    }

    const submitData = (event: any) => {
        event.preventDefault();
        console.log('submit');
        setSubmit(true);
    }

    return(
        <>
            <div className = {styles.container} id = {status === 'write' ? styles.containerWrite : styles.containerSelect}>
                <PhotoSelect next={moveToWrite} back={backToImageSelect} status={status} submit={submitData} fetchData={submit} setImg={setImg}/>
                <Description status={status} setDescription={setDescription} fetchData={submit}/>
            </div>
            {submit === true && imgFiles != undefined ? <FetchData imgFiles={imgFiles} desc={desc}/>: null}
        </>
    )
}

export default Write;