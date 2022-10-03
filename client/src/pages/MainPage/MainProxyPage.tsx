import { useEffect, useContext } from 'react';
import {Navigate} from 'react-router-dom'

import {HandlerContext} from '../../App'


function MainProxyPage() {
    const context = useContext(HandlerContext)
    const session = sessionStorage

    useEffect(()=>{
            if(session.user_id) {
                context.setLoginUser({'user_id':session.user_id})
                session.clear();
            }
        },[])
    return(
        <>
            <Navigate to = {`/main`} replace = {true}/>
        </>
    )
}

export default MainProxyPage;