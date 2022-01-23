import React,{useState, useEffect} from 'react';
import { LoadProfileImg } from '../LoadProfileImg/LoadProfileImg';
import styles from './Description.module.scss'

// interface LoadProfileImgProps {
//     url: string,
//     user_id: string,
//     loadProfilePath: (json: any) => void,
// }

// function LoadProfileImg({url, user_id, loadProfilePath}:LoadProfileImgProps){
//     const data = new FormData();
//     data.append('user_id', user_id);

//     const loadProfile = async(url: string) => {
//         const response = await fetch(url, {
//             method: "POST",
//             body: data
//         })
//         const json = await response.json()
//         .then((value)=>{
//             loadProfilePath(value)
//             console.log(value)});;
//     }
    
//     useEffect(()=>{
//         loadProfile(url);
//     })
//     return(
//         <>
//         </>
//     )
// }


interface SubmitDescProps {
    setDescription: (desc: string) => void;
    desc: string;
}

function SubmitDesc({setDescription, desc}:SubmitDescProps) {
    useEffect(() => {
        setDescription(desc);
    })
    return(
        <></>
    )
}

interface DescriptionProps {
    status: string;
    setDescription: (desc: string) => void;
    fetchData: boolean;
}

function Description({status, setDescription, fetchData}:DescriptionProps) {
    const [loadProfileImg, setLoadProfileImg] = useState<boolean>(true);
    const [profileImageData, setProfileImageData] = useState<any>();

    const loadProfileData = (json: any) => {
        setProfileImageData(json);
        setLoadProfileImg(false);
    }

    const session = sessionStorage;
    return(
        <>
        {loadProfileImg === true ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id={session.user_id} loadProfileData={loadProfileData}/> : null}
        <div className = {styles.frame} id = {status === 'write' ? styles.frameAtDescription : styles.frameBeforeDescription}>
            <div className = {styles.profile}>
                <div className = {styles.imageContainer}>
                    {profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                </div>
                <div className = {styles.name}>
                    <input name = 'user_id' defaultValue={session.user_id} disabled/>
                </div>
            </div>
            <div className = {styles.descContainer} id = {status === 'write' ? styles.descWidthAtDescription: styles.descWidthBeforeDescription}>
                <textarea placeholder='문구 입력...' name = 'desc' onChange={(event) => {
                    session.desc = event.target.value;
                }
                }/>
            </div>
        </div>
        {fetchData === true ? <SubmitDesc setDescription={setDescription} desc={session.desc}/> : null}
        </>
    )
}

export default Description;