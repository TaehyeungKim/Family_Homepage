import React, {useRef, useState} from 'react';
import {useNavigate} from 'react-router-dom'
import styles from './LoginPage.module.scss'
import house from '../../images/christmas_house.png'




function LoginPage() {
    const [loginSuccess, setLoginSuccess] = useState<boolean>(false);
    const inpId = useRef<HTMLInputElement>(null);
    const inpPw = useRef<HTMLInputElement>(null);
    let navigate = useNavigate();
    console.log(house);

    const loginUrl = "http://localhost:8080/family-homepage/server/login.php"

    const session = sessionStorage

    const fetchData = async(url:string, data:any) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type' : 'application/json'
            }
        });
        const json = await response.json();
        if (json.message === 'Login Success') {
            session.user_name = json.name
            session.user_id = json.userId
            session.user_status = json.userStat
            session.islogin = 'true';
            navigate('/main');
        } 
    }

    const handleLogin = () => {
        const data = {
            'inpId' : inpId.current?.value,
            'inpPw' : inpPw.current?.value
        }
        fetchData(loginUrl, data);
    }


    return (
        <>
        <div className = {styles.frame}>
        <div className= {styles.login}>
                <div className= {styles.login_image}>
                    <img src={house} alt = 'house' id={styles.login_image}/>
                </div>
                <div className={styles.login_title}>
                    <h3>Knock Knock!</h3>
                </div>
                <div className={styles.login_form}>
                    <form method='post'>
                        <input name='user_id' type='text' placeholder='아이디' ref={inpId}/>
                        <input name='user_password' type='password' placeholder='비밀번호' ref={inpPw}/>
                        <div id={styles.submit_button}>
                            <input type='submit' id='submit' name = 'submit' value='로그인' onClick={(event) => {
                                event.preventDefault();
                                handleLogin();
                            }}/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LoginPage;