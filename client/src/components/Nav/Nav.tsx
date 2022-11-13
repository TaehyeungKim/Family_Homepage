import styles from './Nav.module.scss'
import { useNavigate, useLocation } from 'react-router-dom';

import winter_house from '../../images/winter_house.png'
import menuIcon from '../../icons/menuIcon.svg';
import writeIcon from '../../icons/writeIcon.svg';


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
                        <img src={writeIcon}/>
                    </div>
                <div id = {styles.label}>글쓰기</div>
                </button>
                }
                <div className = {styles.menu} onClick={onClick}>
                    <img src={menuIcon}/>
                </div>
            </nav>
        </>
    )
}

export default Nav;