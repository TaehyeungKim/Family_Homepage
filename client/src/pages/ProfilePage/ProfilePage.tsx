import {useState, useRef, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import styles from './ProfilePage.module.scss'
import Nav from '../../components/Nav/Nav'
import Sidebar from '../../components/Sidebar/Sidebar';
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';
import LoadUser from '../../components/LoadUser/LoadUser';
import defaultImg from '../../images/default.jpg';

interface ProfilePageDescAreaProps {
    jsonData: any;
}


function ProfilePageDescArea({jsonData}:ProfilePageDescAreaProps) {
    const [lineNumber, setLineNumber] = useState<number>(jsonData.desc.length);
    const [changedOccured, setChangeOccured] = useState<boolean>(false);

    useEffect(()=>{
        setChangeOccured(true);
        console.log('change occured')
    },[])

    return(
        <div>
            <ul>
                {(()=>{
                    let lines = []
                    switch (lineNumber) {
                        case 0:
                            lines.push(
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label id = {styles.descLabel}>한 줄 소개1</label>
                                    <input name = {`desc${1}`} placeholder = '소개를 입력하세요'></input>
                                    </div>
                                    <div className = {styles.descAddDelete}>
                                    <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber+2);
                                    }}>줄 추가</button></div>   
                                </li>)
                            break;
                        default:
                            for (let i = 0; i <= lineNumber-1; i++) {
                                lines.push(
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label id = {styles.descLabel}>{`한 줄 소개${i+1}`}</label>
                                    <input name = {`desc${i+1}`} defaultValue = { jsonData.desc.length === 0 || changedOccured === true ? null : 
                                        i+1 <= jsonData.desc.length ? jsonData.desc[i] : null} placeholder = '소개를 입력하세요'></input>
                                    </div>
                                    <div className = {styles.descAddDelete}>
                                    {i === lineNumber -1 && i !== 4 ? <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber+1);
                                    }}>줄 추가</button> : null}
                                    {i === lineNumber - 1 && i !==0 ? <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber-1);
                                    }}>줄 삭제</button> : null}
                                    </div>    
                                </li>)
                            }
                            break;
                    }
                    return lines
                })()}
            </ul>
        </div>
    )
}


function ProfilePage() {
    const session = sessionStorage;
    const location = useLocation();
    const [changedProfileImgPreview, setChangedProfileImgPreview] = useState<string>("");
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const [userInfoData, setUserInfoData] = useState<any>();
    const changeProfile = useRef<HTMLInputElement>(null);

    const [profileImageData, setProfileImageData] = useState<any>();

    const loadProfileData = (json: any) => {
        setProfileImageData(json);
    }

    const loadUserInfoData = (json: any) => {
        setUserInfoData(json);
    }

    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    useEffect(()=>{
        session.page = location.pathname;
    })

    return(
        <>
        <LoadUser loadUserInfoData={loadUserInfoData}/>
        {userInfoData === undefined ? null
        :
        <>
        {profileImageData === undefined ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id = {session.user_id} loadProfileData={loadProfileData}/> : null}
        <div className = {styles.frame}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} userInfoData={userInfoData} user_id={session.user_id} profileImageData={profileImageData}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
            <Nav onClick={sidebarMove}/>
            <form method='post' action = "./server/profileChange.php" encType='multipart/form-data'>
            <div className = {styles.profileCard}>
                <div className = {styles.header}>
                    내 프로필
                </div>
                <div className = {styles.body}>
                    <div className = {styles.profileImageAndId}>
                        <div className = {styles.imageContainer}>
                            {changedProfileImgPreview === "" ? 
                                profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>
                            :
                            <img src = {changedProfileImgPreview} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                        </div>
                        <div className = {styles.profileChange}>
                            <button onClick = {(event) => {
                                event.preventDefault();
                                changeProfile.current?.click();
                            }}>프로필 사진 바꾸기</button>

                            <input type = 'file' hidden ref = {changeProfile} accept = 'image/*' name="profile_image" onChange = {(event) => {
                                const file = event.target.files?.item(0);
                                if (file) {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        setChangedProfileImgPreview(reader.result as string)
                                    }
                                }
                            }}/>
                            <button onClick = {(e)=>{
                                e.preventDefault();
                                setChangedProfileImgPreview(defaultImg);
                            }}>기본 이미지로 바꾸기</button>
                        </div>
                        
                        <div className = {styles.idContainer}>
                            <input name = 'user_id' value = {session.user_id} readOnly/>
                        </div>
                    </div>
                    <div className = {styles.userInfo}>
                        <div>
                            <ul>
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label>이름</label>
                                    <input type='text' name = 'user_name' defaultValue = {userInfoData.user_name} placeholder = '이름을 입력하세요'></input>
                                    </div>
                                </li>
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label>지위</label>
                                    <input type='text' name = 'user_status' defaultValue = {userInfoData.user_status} placeholder = '가족 내 지위를 입력하세요'></input>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <ProfilePageDescArea jsonData={userInfoData}/>
                    </div>
                </div>
                <div className = {styles.footer}>
                    <div className = {styles.submitButtonContainer}>
                        <button type = 'submit' name = {changedProfileImgPreview === defaultImg ? 'default' : 'NotDefault'} id = {styles.submitButton}>저장하기</button>
                    </div>
                </div>
            </div>
            </form>
        </div>
        </>
        }
        </>
    )
}

export default ProfilePage;