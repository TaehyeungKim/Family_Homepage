import {Navigate} from 'react-router-dom'

function MainProxyPage() {
    return(
        <>
            <Navigate to = {`/main`} replace = {true}/>
        </>
    )
}

export default MainProxyPage;