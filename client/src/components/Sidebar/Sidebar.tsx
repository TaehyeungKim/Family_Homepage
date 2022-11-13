import React, {useContext} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import styles from './Sidebar.module.scss'

import closeIcon from '../../icons/closeIcon.svg';
import pin_icon from '../../icons/pin_icon.png';
import Urls from '../../utils/Url';

import {HandlerContext} from '../../App'

import {clearSessionInterval} from '../../utils/SessionExtend'

interface SidebarProps {
    onClick: () => void;
    visible: boolean;
}

function Sidebar({onClick, visible}:SidebarProps) {

    const session = sessionStorage;
    const url = Urls.logout
    let navigate = useNavigate();
    const loginPage = `/login`
    const profilePage = `/profile`
    const mainPage = `/main`
    const Logout = async () => {
        try {
            const response = await fetch (url, {
                method: "GET"
            })
            const json = await response.json()
            .then((value)=>{
                console.log(value);
                session.clear();
                clearSessionInterval();
                
                navigate(loginPage, {replace: true})
            });
        } catch(e) {console.log(e)}
        
       
    }
    const moveToProfile = () => {
        navigate(profilePage)
    }

    const moveToHome = () => {
        navigate(mainPage);
    }

    const location = useLocation();
    const context = useContext(HandlerContext)

    return(
        <>
        <aside className={styles.sidebar} id={visible === true ? styles.sidebar_visible : styles.sidebar_closed}>
            <div className ={styles.close_mark} onClick={onClick}>
                <img src = {closeIcon}/>
            </div>
            <div className = {styles.sidebarProfileArea}>
                <div className = {styles.profileImageContainer}>
                {context.getLoginUser('image') === undefined ? null : <img src = {context.getLoginUser('image').src} id = {context.getLoginUser('image').height > context.getLoginUser('image').width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                </div>
                <div className = {styles.profileName}>
                    {context.getLoginUser('user_name')} <br/> <span>{context.getLoginUser('user_id')}</span> <br/>
                    <div className = {styles.descriptionContainer}>
                    {context.getLoginUser('desc').map((description: string, idx: any) => (
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
        </aside>
        </>
    )
}

export default Sidebar;