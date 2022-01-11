import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Sidebar.module.scss'


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
        <div className={styles.sidebar} id='sidebar' style = {visible === true ? {width: '350px'}:{width: '0px'}}>
            <div className ={styles.close_mark} onClick={onClick}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8zm-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5z"/>
                </svg>
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