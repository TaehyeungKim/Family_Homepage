import React, {useEffect} from 'react'

interface LoadProfileImgProps {
    url: string,
    user_id: string,
    loadProfileData: (json: any) => void,
}

function LoadProfileImg({url, user_id, loadProfileData}:LoadProfileImgProps){
    const data = new FormData();
    data.append('user_id', user_id);

    const loadProfile = async(url: string) => {
        const response = await fetch(url, {
            method: "POST",
            body: data
        })
        const json = await response.json()
        .then((value)=>{
            const img = new Image();
            img.src = value.path;
            loadProfileData({
                'path' : value.path,
                'height' : img.height,
                'width' : img.width
            })
        });;
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