import React from 'react';
import styles from './LoginPage.module.scss'
import house from '../../images/christmas_house.png'

function LoginPage() {
    return (
        <>
        <div className = {styles.frame}>
        <div className= {styles.login}>
                <div className= {styles.login_image}>
                    <img src={house} id={styles.login_image}/>
                </div>
                <div className={styles.login_title}>
                    <h3>Knock Knock!</h3>
                </div>
                <div className={styles.login_form}>
                    <form method='post' action='http://localhost:8080/family-homepage/server/login.php'>
                        <input name='user_id' type='text' placeholder='아이디'/>
                        <input name='user_password' type='password' placeholder='비밀번호'/>
                        <div id={styles.submit_button}>
                            <input type='submit' id='submit' value='로그인'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
            
        </>
    )
}

export default LoginPage;