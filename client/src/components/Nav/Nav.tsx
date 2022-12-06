import styles from './Nav.module.scss'
import { useNavigate, useLocation } from 'react-router-dom';

import winter_house from '../../images/winter_house.png'
import {ReactComponent as MenuIcon} from '../../icons/menuIcon.svg';
import {ReactComponent as WriteIcon} from '../../icons/writeIcon.svg'

import Snowfall from 'react-snowfall'

interface NavProps {
    onClick: () => void,
}

function Nav({onClick}:NavProps) {
    const CreatePage = `/main/create`
    let navigate = useNavigate();

    const location = useLocation();

    const Create = () => {
        navigate(CreatePage, {replace: true})
    }
    
    return(
        <>
            <nav className={styles.nav}>
                <Snowfall color='white' snowflakeCount={50}/>
                <div className={styles.background}></div>
                <div className = {styles.logo}>
                    <img src = {winter_house} alt = 'logo'/>
                </div>
                <div className = {styles.title} onClick={() => {
                    navigate('/main');
                }}>
                    <p>Knock Knock!</p>
                </div>
                {location.pathname === '/profile' ? null
                : 
                <button className = {styles.write_button} onClick = {Create}>
                    <div id = {styles.icon}>
                        <WriteIcon fill="white"/>
                    </div>
                    <div id = {styles.label}><span>글쓰기</span></div>
                </button>
                }
                <div className = {styles.menu} onClick={onClick}>
                    <MenuIcon fill='white'/>
                </div>
            </nav>
        </>
    )
}

export default Nav;