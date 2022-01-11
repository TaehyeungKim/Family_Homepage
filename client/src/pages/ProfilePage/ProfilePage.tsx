import React, {useState, useRef} from 'react'
import styles from './ProfilePage.module.scss'
import Nav from '../../components/Nav/Nav'
import Sidebar from '../../components/Sidebar/Sidebar';

function ProfilePage() {
    const session = sessionStorage;
    const [profileImageData, setProfileImageData] = useState<string>(`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${session.user_id}`);
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const changeProfile = useRef<HTMLInputElement>(null);
    const imageAfterChange = useRef<HTMLImageElement>(null);

    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    return(
        <>
        <div className = {styles.frame}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
            <Nav onClick={sidebarMove}/>
            <form method='post' action = "http://localhost:8080/family-homepage/server/profileChange.php" encType='multipart/form-data'>
            <div className = {styles.profileCard}>
                <div className = {styles.header}>
                    내 프로필
                </div>
                <div className = {styles.body}>
                    <div className = {styles.profileImageAndId}>
                        <div className = {styles.imageContainer}>
                            <img src = {profileImageData} alt = 'profileImage' ref={imageAfterChange}/>
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
                                        setProfileImageData(reader.result as string)
                                    }
                                }
                            }}/>
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
                                    <textarea></textarea>    
                                </li>
                            </ul>

                        </div>
                    </div>
                </div>
                <div className = {styles.footer}>
                    <div className = {styles.submitButtonContainer}>
                        <input type = 'submit' value='저장하기' name = 'submit'/>
                    </div>
                </div>
            </div>
            </form>
        </div>
        </>
    )
}

export default ProfilePage;