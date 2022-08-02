import {useState, useEffect, useRef} from 'react';
import { LoadProfileImg } from '../LoadProfileImg/LoadProfileImg';
import styles from './Description.module.scss'
import Urls from '../../utils/Url';

interface SubmitDescProps {
    setDescription: (desc: string) => void;
    description: string;
}

function SubmitDesc({setDescription, description}:SubmitDescProps) {
    useEffect(() => {
        setDescription(description);
    })
    return(
        <></>
    )
}

interface DescriptionProps {
    status: string;
    setDescription: (description: string) => void;
    fetchData: boolean;
    userInfoData: React.MutableRefObject<any>;
    profileImageData: React.MutableRefObject<any>;
}

function Description({status, setDescription, fetchData, userInfoData, profileImageData}:DescriptionProps) {
    // const [profileImageData, setProfileImageData] = useState<any>();

    // const loadProfileData = (json: any) => {
    //     setProfileImageData(json);
    // }

    const session = sessionStorage;
    const descArea = useRef<HTMLTextAreaElement>(null);

    useEffect(()=>{
        if(status === 'beforeUploadImage') {
            session.desc = '';
        }
        if(status === 'beforeUploadImage' || status === 'imagePreview') {
            if(descArea.current !== null) {
                descArea.current.value = ''
            }  
        }
    },[status])
    return(
        <>
        {/* {profileImageData === undefined ? <LoadProfileImg url = {Urls.readProfileImg} user_id={session.user_id} loadProfileData={loadProfileData}/> : null} */}
        <div className = {styles.frame} id = {status === 'write' ? styles.frameAtDescription : styles.frameBeforeDescription}>
            <div className = {styles.profile}>
                <div className = {styles.imageContainer}>
                    {profileImageData.current === undefined ? null : <img src = {`.${profileImageData.current.path}`} id = {profileImageData.current.height > profileImageData.current.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                </div>
                <div className = {styles.name}>
                    <input name = 'user_id' defaultValue={session.user_id} disabled/>
                </div>
            </div>
            <div className = {styles.descContainer} id = {status === 'write' ? styles.descWidthAtDescription: styles.descWidthBeforeDescription}>
                <textarea placeholder='문구 입력...' name = 'desc' onChange={(event) => {
                    session.desc = event.target.value;
                }
                } ref={descArea}/>
            </div>
        </div>
        {fetchData === true ? <SubmitDesc setDescription={setDescription} description={session.desc}/> : null}
        </>
    )
}

export default Description;