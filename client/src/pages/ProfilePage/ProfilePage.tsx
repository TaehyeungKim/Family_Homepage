import {useState, useRef, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import styles from './ProfilePage.module.scss'
import Nav from '../../components/Nav/Nav'
import Sidebar from '../../components/Sidebar/Sidebar';
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';
import defaultImg from '../../images/default.jpg';


function ProfilePage() {
    const session = sessionStorage;
    const location = useLocation();
    const [changedProfileImgPreview, setChangedProfileImgPreview] = useState<string>("");
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const changeProfile = useRef<HTMLInputElement>(null);


    const [profileImageData, setProfileImageData] = useState<any>();

    const loadProfileData = (json: any) => {
        setProfileImageData(json);
    }

    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    useEffect(()=>{
        session.page = location.pathname;
    })

    return(
        <>
        {profileImageData === undefined ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id = {session.user_id} loadProfileData={loadProfileData}/> : null}
        <div className = {styles.frame}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status} profileImageData={profileImageData}/>
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
                                console.log(changeProfile.current?.files);
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
                                    <label>이름</label>
                                    <input type='text' name = 'user_name' defaultValue = {session.user_name} placeholder = '이름을 입력하세요'></input>
                                </li>
                                <li>
                                     <label>지위</label>
                                     <input type='text' name = 'user_status' defaultValue = {session.user_status} placeholder = '가족 내 지위를 입력하세요'></input>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <ul>
                                <li>
                                    <label>소개</label>
                                    <textarea name = 'self_description' defaultValue = {session.user_description === 'null' ? null : session.user_description} placeholder = '소개를 입력하세요'></textarea>    
                                </li>
                            </ul>

                        </div>
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
    )
}

export default ProfilePage;