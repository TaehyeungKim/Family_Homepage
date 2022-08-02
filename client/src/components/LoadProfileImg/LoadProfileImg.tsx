import React, {useEffect} from 'react'
import Urls from '../../utils/Url'

interface LoadProfileImgProps {
    url: string,
    user_id: string,
    // loadProfileData: (json: any) => void,
    setLoadStatus?:(status:string) => void;
    // setFeedProfileImageData?:(data:any) => void;
    feedProfileImageData?:React.MutableRefObject<any>;
    profileImageData?:React.MutableRefObject<any>;
    setFeedProfileImageLoadStatus?: (status:string) => void;
    userFeedData?:React.MutableRefObject<any>

}

function LoadProfileImg({url, user_id, setLoadStatus, profileImageData, feedProfileImageData, setFeedProfileImageLoadStatus, userFeedData}:LoadProfileImgProps){
    const data = new FormData();
    data.append('user_id', user_id);

    const loadProfile = async(url: string) => {
        const response = await fetch(url, {
            method: "POST",
            body: data
        })
        const json = await response.json()
        .then((value)=>{
            const xmlRequest = (data:React.MutableRefObject<any>, settingStatus:(status:string) => void, status:string) => {
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
                            switch(data) {
                                case profileImageData:
                                    data.current = {src:img.src, height:img.height, width:img.width};
                                    settingStatus(status);
                                    break;        
                                case feedProfileImageData:
                                    data.current[`${user_id}`] = {src:img.src, height: img.height, width: img.width};
                                    if(userFeedData !== undefined && userFeedData.current.user_id_array.length + 1 === Object.keys(feedProfileImageData?.current).length) {
                                        settingStatus(status);
                                    }

                            }
                        }
                    }
                }
                xhr.send();
            }
            if(profileImageData !== undefined && setLoadStatus !== undefined) {
                xmlRequest(profileImageData, setLoadStatus, "loadingFinished");
            }
            if(feedProfileImageData !== undefined && setFeedProfileImageLoadStatus !== undefined &&userFeedData !== undefined) {
                xmlRequest(feedProfileImageData, setFeedProfileImageLoadStatus, "feedProfileImageLoadFinished")
            }
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