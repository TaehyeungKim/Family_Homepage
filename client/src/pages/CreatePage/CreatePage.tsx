import React from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './CreatePage.module.scss'
import MainPage from '../MainPage/MainPage'
import Write from '../../components/Write/Write'

import X_icon from '../../icons/X_icon.svg'


function CreatePage() {

    let navigate = useNavigate();
    const mainPage = `/main`
    const backToMain = () => {
        navigate(mainPage, {replace: true})
    }


    return(
        <>
            <div className = {styles.frame}>
                <div className = {styles.background}>
                    <button className = {styles.back_button} onClick = {backToMain}>
                        <img src={X_icon}/>
                    </button>
                    <Write/>
                </div>
                <MainPage/>
            </div>
        </>
    )
}

export default CreatePage;