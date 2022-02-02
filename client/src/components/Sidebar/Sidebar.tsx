import React from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import styles from './Sidebar.module.scss'

import closeIcon from '../../icons/closeIcon.svg';
import pin_icon from '../../icons/pin_icon.png';
import Urls from '../../utils/Url';


interface SidebarProps {
    onClick: () => void;
    visible: boolean;
    userInfoData: any;
    user_id: string;
    profileImageData: any
}

function Sidebar({onClick, visible, userInfoData, user_id, profileImageData}:SidebarProps) {

    const session = sessionStorage;
    const url = Urls.logout
    let navigate = useNavigate();
    const loginPage = `/login`
    const profilePage = `/profile`
    const mainPage = `/main`
    const Logout = async () => {
        const response = await fetch (url, {
            method: "GET"
        })
        const json = await response.json()
        .then((value)=>{
            console.log(value);
            session.clear();
            navigate(loginPage, {replace: true})
        });
       
    }
    const moveToProfile = () => {
        navigate(profilePage)
    }

    const moveToHome = () => {
        navigate(mainPage);
    }

    const location = useLocation();

    return(
        <>
        <div className={styles.sidebar} id={visible === true ? styles.sidebar_visible : styles.sidebar_closed}>
            <div className ={styles.close_mark} onClick={onClick}>
                <img src = {closeIcon}/>
            </div>
            <div className = {styles.sidebarProfileArea}>
                <div className = {styles.profileImageContainer}>
                {profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                </div>
                <div className = {styles.profileName}>
                    {userInfoData.user_name} <br/> <span>{user_id}</span> <br/>
                    <div className = {styles.descriptionContainer}>
                    {userInfoData.desc.map((description: string, idx: any) => (
                        <React.Fragment key = {idx}>
                        <div className = {styles.description}>
                            <img src = {pin_icon}/>
                            <div className = {styles.descriptionContent}>
                                <span>{description}</span>
                            </div>
                        </div>
                        </React.Fragment>
                    ))}
                    </div>
                </div>
                <div className = {styles.buttonsContainer}>
                    {location.pathname === '/profile' ? 
                    <button id = {styles.myInfo} onClick = {moveToHome}>홈으로</button>
                    :
                    <button id = {styles.myInfo} onClick = {moveToProfile}>내 정보</button>
                    }
                    <button id = {styles.logout} onClick={Logout}>로그아웃</button>
                </div>

            </div>
        </div>
        </>
    )
}

export default Sidebar;