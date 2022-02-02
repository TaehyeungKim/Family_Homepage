 
import { useState, useEffect } from 'react';
import {Navigate, useNavigate} from 'react-router-dom' 
import Urls from '../../utils/Url';

interface RedirectToMainProps {
    redirectToLogin: ()=>void;
}

function RedirectToMain({redirectToLogin}:RedirectToMainProps) {
    const url = Urls.checkIsLogin;
    const navigate = useNavigate();
    const checkLogin = async() => {
        const response = await fetch(url, {
            method: "GET"
        })
        const json = await response.json()
        .then((value) => {
            console.log(value);
            if (value.isLogin === 'true') {
                navigate('/main');
            } else {
                redirectToLogin();
            }
        });
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