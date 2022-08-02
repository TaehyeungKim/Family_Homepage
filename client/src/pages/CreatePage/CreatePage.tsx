import { useEffect } from 'react'
import {useNavigate, useLocation, Navigate} from 'react-router-dom'
import styles from './CreatePage.module.scss'

import Write from '../../components/Write/Write'

import X_icon from '../../icons/X_icon.svg'

interface CreatePageProps {
    userInfoData: React.MutableRefObject<any>;
    profileImageData: React.MutableRefObject<any>;
}


function CreatePage({userInfoData, profileImageData}:CreatePageProps) {

    const location = useLocation();
    const session = sessionStorage;

    let navigate = useNavigate();
    const mainPage = `/main`
    const backToMain = () => {
        navigate(mainPage, {replace: true})
    }

    useEffect(()=>{
        session.page = location.pathname;
    })


    return(
        <>
        {session.page === location.pathname ? <Navigate to = {`../../main_proxy`}/> 
        :
        <div className = {styles.frame}>
            <div className = {styles.background}>
                <button className = {styles.back_button} onClick = {backToMain}>
                    <img src={X_icon}/>
                </button>
                <Write userInfoData={userInfoData} profileImageData={profileImageData}/>
            </div>
        </div>
        }
        </>
    )
}

export default CreatePage;