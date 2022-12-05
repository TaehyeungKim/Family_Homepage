import { useState, useEffect, useContext } from 'react';
import styles from './ShowUserLogin.module.scss'
import Urls from '../../utils/Url';

import {HandlerContext} from '../../App'

interface UserStatusBarProps {
    profileImg: string;
    user_id: string;
    isLogin: boolean;
}

function UserStatusBar({profileImg, user_id, isLogin}:UserStatusBarProps) {
    return(
        <>
        <li className={styles.userStatusBar}>
            <div className={styles.statusProfile}>
                <figure>
                    <img src={profileImg} alt={`${user_id}의 프로파일 이미지`}/>
                </figure>
            </div>
            <span>{user_id}</span>
            <div className={styles.loginDotContainer}>
                <div className={isLogin ? `${styles.loginDot} ${styles.login}` : `${styles.loginDot} ${styles.unlogin}`}></div>
            </div>                    
        </li>
        </>
    )
}

function ShowUserLogin() {
    const url = Urls.queryLoginUser;

    const [userLoginData, setUserLoginData] = useState<any>(null);
    const [profileImgLoadingFinished, setProfileImgLoadingFinished] = useState<boolean>(false);

    const context = useContext(HandlerContext);

    const allMembers = () => {
        if(userLoginData) {
            return Object.keys(context.getFeedProfileImageData()).length === [...userLoginData.login, ...userLoginData.unlogin].length
        }
        return null;
    }

    const queryLoginUser = async(url:string) => {
        try {
            const res = await fetch(url, {
                method: 'GET'
            }).then((res)=>{return res.json()})
            setUserLoginData(res);
            
        } catch(e){
            console.log(e);
        }
    }
    useEffect(()=>{
        queryLoginUser(url)
    },[])
    useEffect(()=>{
        if(allMembers()) setProfileImgLoadingFinished(true);
    },[Object.keys(context.getFeedProfileImageData()).length])
    return(
        <>
        <section className = {styles.showLoginedUserArea} id={userLoginData && allMembers() ? styles.addHeightAnim : undefined}>
            <div className={styles.blurBox} id={allMembers() ? styles.addBlurAnim : undefined}></div>
            {userLoginData && allMembers()? 
            <ul>
            {[...userLoginData.login].map(
                (e:string)=>{
                     return <UserStatusBar profileImg={context.getFeedProfileImageData(e).src} user_id={e} isLogin={true}/> 
                }
            )}
            {[...userLoginData.unlogin].map(
                (e:string)=>{
                     return <UserStatusBar profileImg={context.getFeedProfileImageData(e).src} user_id={e} isLogin={false}/> 
                }
            )}
            </ul> : <div className={styles.loading}>로딩중</div>}
        </section>
        </>
    )
}

export default ShowUserLogin;