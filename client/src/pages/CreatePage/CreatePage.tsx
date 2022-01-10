import React from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './CreatePage.module.scss'
import MainPage from '../MainPage/MainPage'
import Write from '../../components/Write/Write'


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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0Z"/>
                            <path fill-rule="evenodd" d="M2.146 2.146a.5.5 0 0 0 0 .708l11 11a.5.5 0 0 0 .708-.708l-11-11a.5.5 0 0 0-.708 0Z"/>
                        </svg>
                    </button>
                    <Write/>

                </div>
                <MainPage/>
            </div>
        </>
    )
}

export default CreatePage;