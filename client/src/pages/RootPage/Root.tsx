 
import { useState, useEffect } from 'react';
import {Navigate, useNavigate} from 'react-router-dom' 
import Urls from '../../utils/Url';

interface RedirectToMainProps {
    redirectToLogin: ()=>void;
}

function RedirectToMain({redirectToLogin}:RedirectToMainProps) {
    const url = Urls.checkIsLogin;
    const session = sessionStorage;
    const navigate = useNavigate();
    const checkLogin = async() => {
        const response = await fetch(url, {
            method: "GET"
        })

        const json = await response.json()
        .then((value) => {
            console.log(value);
            if (value.isLogin === 'true') {
                session.user_id = value.user_id;
                navigate('/main');
            } else {
                redirectToLogin();
            }
        })
        .catch((error)=>console.log('error: ',error));
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