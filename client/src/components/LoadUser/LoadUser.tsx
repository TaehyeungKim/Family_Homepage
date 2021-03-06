import {useEffect} from 'react'
import Urls from '../../utils/Url';

interface LoadUserProps {
    loadUserInfoData:(json:any) => void;
}

function LoadUser({loadUserInfoData}:LoadUserProps) {
    const session = sessionStorage;
    const loadUserInfo = async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json();
        loadUserInfoData(json);
    }


    const data = {'user_id' : session.user_id}
    useEffect(()=>{
        loadUserInfo(Urls.loadUserInfo, data)
        console.log('loadFinished')
    },[])
    return(
        <></>
    )
}

export default LoadUser;