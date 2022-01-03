import React from 'react'
import styles from './Nav.module.scss'
import house from '../../images/christmas_house.png'
import { useNavigate } from 'react-router-dom';


interface NavProps {
    onClick: () => void,
}

function Nav({onClick}:NavProps) {
    const loginPage = `/login`
    const CreatePage = `/create`
    let navigate = useNavigate();
    const Logout = () => {
        navigate(loginPage, {replace: true})
        console.log('logout');
    }
    const Create = () => {
        navigate(CreatePage, {replace: true})
    }
    
    return(
        <>
            <div className= {styles.nav}>
                <div className = {styles.logo}>
                    <img src = {house} alt = 'logo'/>
                </div>
                <div className = {styles.title}>
                    <p>Knock Knock!</p>
                </div>
                <button className = {styles.write_button} onClick = {Create}>글쓰기</button>
                <button className={styles.login_button} onClick = {Logout}>로그아웃</button>
                <div className = {styles.menu} onClick={onClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width='45' height='45' viewBox= '0 0 16 16'>
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                </div>
            </div>
        </>
    )
}

export default Nav;