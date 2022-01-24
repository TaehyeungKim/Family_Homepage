import {useNavigate, useLocation} from 'react-router-dom'
import styles from './Sidebar.module.scss'

import closeIcon from '../../icons/closeIcon.svg';


interface SidebarProps {
    onClick: () => void;
    visible: boolean;
    user_name: string;
    user_id: string;
    user_status: string,
    profileImageData: any
}

function Sidebar({onClick, visible, user_name, user_id, user_status, profileImageData}:SidebarProps) {

    const session = sessionStorage;
    let navigate = useNavigate();
    const loginPage = `/login`
    const profilePage = `/profile`
    const mainPage = `/main`
    const Logout = () => {
        session.clear();
        navigate(loginPage, {replace: true})
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
                    {user_name} / {user_id}
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