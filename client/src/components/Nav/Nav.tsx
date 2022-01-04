import React from 'react'
import styles from './Nav.module.scss'
import house from '../../images/christmas_house.png'
import { useNavigate } from 'react-router-dom';


interface NavProps {
    onClick: () => void,
}

function Nav({onClick}:NavProps) {
    const CreatePage = `/create`
    let navigate = useNavigate();

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
                <button className = {styles.write_button} onClick = {Create}>
                    <div id = {styles.icon}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/>
                        </svg>
                    </div>
                    <div id = {styles.label}>글쓰기</div>
                </button>
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