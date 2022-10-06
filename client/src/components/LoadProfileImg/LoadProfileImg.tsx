import React, {useEffect, useContext} from 'react'
import Urls from '../../utils/Url'

import {HandlerContext} from '../../App'

interface LoadProfileImgProps {
    url: string,
    user_id: string,
    target:string,
    setLoadStatus?:(status:string) => void;
    setFeedProfileImageLoadStatus?: (status:string) => void;
    idx?: number;

}

function LoadProfileImg({url, user_id, target, setLoadStatus, setFeedProfileImageLoadStatus, idx}:LoadProfileImgProps){
    const data = new FormData();
    const context = useContext(HandlerContext)
    switch(target) {
        case 'profileImageData':
            data.append('user_id', context.getLoginUser('user_id'));
            break;
        case 'feedProfileImageData':
            data.append('user_id', user_id);
    }
    

    const loadProfile = async(url: string) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                body: data
            })
            const json = await response.json()
            .then((value)=>{
                const xmlRequest = (context:any, settingStatus:(status:string) => void, target:string) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("GET", `${Urls.hostPath}${value.path}`);
                    xhr.responseType = "blob";
                    xhr.onload = () => {
                        const reader = new FileReader();
                        reader.readAsDataURL(xhr.response);
                        reader.onloadend = () => {
                            const img = new Image();
                            img.src = reader.result as string;
                            img.onload = () => {
                                switch(target) {
                                    case 'profileImageData':
                                        context.setLoginUser({src:img.src, height:img.height, width:img.width},'image')
                                        settingStatus('loadingFinished');
                                        break;        
                                    case 'feedProfileImageData':
                                        context.setFeedProfileImageData({src:img.src, height: img.height, width: img.width}, user_id);
                                        if(Object.keys(context.getFeedProfileImageData()).length === context.getFeedData('user_id_array').length) {
                                            settingStatus("feedProfileImageLoadFinished");
                                        }
                                        console.log(idx, context.getFeedProfileImageData())
                                }
                            }
                        }
                    }
                    xhr.send();
                }
                if(target === 'profileImageData' && setLoadStatus !== undefined) {
                    xmlRequest(context, setLoadStatus, "profileImageData");
                }
                if(target === 'feedProfileImageData' && setFeedProfileImageLoadStatus !== undefined) {
                    xmlRequest(context, setFeedProfileImageLoadStatus, "feedProfileImageData")
                }
            });
        } catch(e) {console.log(e)}
        
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