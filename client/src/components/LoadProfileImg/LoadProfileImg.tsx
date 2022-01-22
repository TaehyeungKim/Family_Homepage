import React, {useEffect} from 'react'

interface LoadProfileImgProps {
    url: string,
    user_id: string,
    loadProfilePath: (json: any) => void,
}

function LoadProfileImg({url, user_id, loadProfilePath}:LoadProfileImgProps){
    const data = new FormData();
    data.append('user_id', user_id);

    const loadProfile = async(url: string) => {
        const response = await fetch(url, {
            method: "POST",
            body: data
        })
        const json = await response.json()
        .then((value)=>{
            loadProfilePath(value)
            console.log(value)});;
    }
    
    useEffect(()=>{
        loadProfile(url);
    })
    return(
        <>
        </>
    )
}

export {LoadProfileImg};