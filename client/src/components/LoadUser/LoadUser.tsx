import {useEffect, useContext} from 'react'
import Urls from '../../utils/Url';
import {HandlerContext} from '../../App'

interface LoadUserProps {
    setLoadStatus:(status:string) => void;
}

function LoadUser({setLoadStatus}:LoadUserProps) {
    const loadUserInfo = async (url: string, data: any) => {
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    "Content-Type" : "application/json"
                }
            })
            const json = await response.json().then(
                (value)=>{
                    context.setLoginUser(value);      
                    setLoadStatus("toLoadUserFeed")
                }
            );
        } catch(e) {console.log(e)}
        
    }
    const context = useContext(HandlerContext)

    const loadUserIdFromSession = async() => {
        try {
            const userIdFromSession = await fetch(Urls.checkIsLogin, {
                method: "GET"
            })
            const userId = await userIdFromSession.json().then(
                (value)=>{
                    context.setLoginUser({'user_id':value.user_id})
                    loadUserInfo(Urls.loadUserInfo, {'user_id':value.user_id})
                }
            );
        } catch(e) {console.log(e)}
        
    }


    const data = {'user_id' : context.getLoginUser('user_id')}
    useEffect(()=>{
        if(context.getLoginUser('user_id')) loadUserInfo(Urls.loadUserInfo, data)
        else {
            loadUserIdFromSession()
        }
    },[])
    return(
        <></>
    )
}

export default LoadUser;