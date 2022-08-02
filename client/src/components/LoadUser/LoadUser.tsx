import {useEffect} from 'react'
import Urls from '../../utils/Url';

interface LoadUserProps {
    setLoadStatus:(status:string) => void;
    userInfoData: React.MutableRefObject<any>;
}

function LoadUser({setLoadStatus, userInfoData}:LoadUserProps) {
    const session = sessionStorage;
    const loadUserInfo = async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json().then(
            (value)=>{
                userInfoData.current = value;
                console.log('loadUser')
                setLoadStatus("toLoadUserFeed")
            }
        );
        // loadUserInfoData(json);
    }


    const data = {'user_id' : session.user_id}
    useEffect(()=>{
        loadUserInfo(Urls.loadUserInfo, data)
    },[])
    return(
        <></>
    )
}

export default LoadUser;