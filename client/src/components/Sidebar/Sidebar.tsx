import React from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Sidebar.module.scss'
import testProfile from '../../images/testProfile.jpeg'

interface SidebarProps {
    onClick: () => void;
    visible: boolean;
}

function Sidebar({onClick, visible}:SidebarProps) {
    let navigate = useNavigate();
    const loginPage = `/login`
    const Logout = () => {
        navigate(loginPage, {replace: true})
        console.log('logout');
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
                    <img src = {testProfile}/>
                </div>
                <div className = {styles.profileName}>
                    김태형 / @taehyeungkim98
                </div>
                <div className = {styles.buttonsContainer}>
                    <button id = {styles.myInfo}>내 정보</button>
                    <button id = {styles.logout} onClick={Logout}>로그아웃</button>
                </div>

            </div>

        </div>

        </>
    )
}

export default Sidebar;