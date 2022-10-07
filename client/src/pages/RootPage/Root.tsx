 
import { useState, useEffect } from 'react';
import {Navigate, useNavigate} from 'react-router-dom' 
import Urls from '../../utils/Url';
import {setSessionInterval} from '../../utils/SessionExtend';

interface RedirectToMainProps {
    redirectToLogin: ()=>void;
}

function RedirectToMain({redirectToLogin}:RedirectToMainProps) {
    const url = Urls.checkIsLogin;
    const session = sessionStorage;
    const navigate = useNavigate();
    const updateLastLogin = async() => {
        try {
            await fetch(Urls.sessionExtend, {
                method: "GET"
            }).then(()=>{console.log('session updated')});
        }  catch(e) {console.log(e)}
    }
    const checkLogin = async() => {
        try {
            const response = await fetch(url, {
                method: "GET"
            })
    
            await response.json()
            .then((value) => {
                console.log(value);
                if (value.isLogin === 'true') {
                    session.user_id = value.user_id; 
                    updateLastLogin();
                    document.body.addEventListener("load", ()=>{
                        setSessionInterval(60000);
                    })
                    navigate('/main');
                } else {
                    redirectToLogin();
                }
            })
            
        } catch(e) {
            console.log(e);
        }
        
    }
    useEffect(()=>{
        checkLogin();
    })
    return(
        <></>
    )
}

function Root() {
    const [directToMain, setDirectToMain] = useState<boolean>(true);
    const redirectToLogin = () => {
        setDirectToMain(false);
    }
    return(
        <>
        {directToMain === true ? <RedirectToMain redirectToLogin={redirectToLogin}/> : <Navigate to = {'/login'}/>}
        </>
    )
}

export default Root;