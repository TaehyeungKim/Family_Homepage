import React from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Sidebar.module.scss'

import closeIcon from '../../icons/closeIcon.svg';


interface SidebarProps {
    onClick: () => void;
    visible: boolean;
    user_name: string;
    user_id: string;
    user_status: string;
}

function Sidebar({onClick, visible, user_name, user_id, user_status}:SidebarProps) {
    const session = sessionStorage;
    let navigate = useNavigate();
    const loginPage = `/login`
    const profilePage = `/profile`
    const Logout = () => {
        session.clear();
        navigate(loginPage, {replace: true})
    }
    const moveToProfile = () => {
        navigate(profilePage)
    }


    return(
        <>
        <div className={styles.sidebar} id={visible === true ? styles.sidebar_visible : styles.sidebar_closed}>
            <div className ={styles.close_mark} onClick={onClick}>
                <img src = {closeIcon}/>
            </div>
            <div className = {styles.sidebarProfileArea}>
                <div className = {styles.profileImageContainer}>
                    <img src = {`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${session.user_id}`} alt = 'profile'/>
                </div>
                <div className = {styles.profileName}>
                    {user_name} / {user_id}
                </div>
                <div className = {styles.buttonsContainer}>
                    <button id = {styles.myInfo} onClick = {moveToProfile}>내 정보</button>
                    <button id = {styles.logout} onClick={Logout}>로그아웃</button>
                </div>

            </div>

        </div>

        </>
    )
}

export default Sidebar;