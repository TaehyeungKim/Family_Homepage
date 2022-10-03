import {useRef, useState, useEffect, useContext} from 'react';
import {useNavigate, useLocation} from 'react-router-dom'
import styles from './LoginPage.module.scss'
import winter_house from '../../images/winter_house.png'
import Urls from '../../utils/Url';
import {HandlerContext} from '../../App'


interface WrongLoginAlertProps { 
    onClick: () => void;
    message: string;
}


function WrongLoginAlert({onClick, message}:WrongLoginAlertProps) {
    return(
        <>
            <div className = {styles.deactivate}>
            <div className = {styles.popUp}>
                <p>{message === "Wrong User Id" ? '아이디가 존재하지 않습니다.' : '비밀번호가 틀렸습니다.'}</p>
                <button className = {styles.popUpClose} onClick={onClick}>확인</button>
            </div>
            </div>
        </>
    )
}




function LoginPage() {
    const inpId = useRef<HTMLInputElement>(null);
    const inpPw = useRef<HTMLInputElement>(null);
    const [loginState, setLoginState] = useState<string>("");
    let navigate = useNavigate();
    const location = useLocation();

    const loginUrl = Urls.login;

    const session = sessionStorage
    const context = useContext(HandlerContext)

    const fetchData = async(url:string, data:any) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        const json = await response.json()
        if (json.message === 'Login Success') {
            context.setLoginUser({user_id: json.user_id});    
            navigate('/main');
        } else if (json.message === 'Wrong User Id') {
            setLoginState("Wrong User Id");
        } else if (json.message === 'Wrong Password') {
            setLoginState("Wrong Password");
        }
    }

    const handleLogin = () => {
        const data = {
            'inpId' : inpId.current?.value,
            'inpPw' : inpPw.current?.value
        }
        fetchData(loginUrl, data);
    }

    useEffect(()=>{
        session.page = location.pathname;
    })


    return (
        <>
        <div className = {styles.frame}>
            {loginState === "Wrong User Id" || loginState === "Wrong Password" ? 
                <WrongLoginAlert onClick = {()=> setLoginState("")} message = {loginState}/>
            :
            null
            }
            <div className= {styles.login_image}>
                <img src={winter_house} alt = 'house' id={styles.login_image}/>
            </div>
            <div className={styles.login_title}>
                <h3>Knock Knock!</h3>
            </div>
            <div className={styles.login_form}>
                <form method='post'>
                    <div className={styles.form_floating}>
                    <input className = {styles.idInp} name='user_id' type='text' ref={inpId} placeholder='아이디'/>
                    </div>
                    <div className = {styles.form_floating}>
                    <input className = {styles.pwInp} name='user_password' type='password' ref={inpPw} placeholder='비밀번호'/>
                    </div>
                    <div id={styles.submit_button}>
                        <input type='submit' id='submit' name = 'submit' value='로그인' onClick={(event) => {
                            event.preventDefault();
                            handleLogin();
                        }}/>
                    </div>
                </form>
            </div>
        </div>
            
        </>
    )
}

export default LoginPage;