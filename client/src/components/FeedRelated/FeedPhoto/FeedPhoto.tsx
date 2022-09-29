import {useState, useEffect, useRef} from 'react'
import styles from './FeedPhoto.module.scss';
import Urls from '../../../utils/Url'

interface FeedPhotoProps {
    feedData: any;
    index: number;
}

function FeedPhoto({feedData, index}:FeedPhotoProps){

    const [feedPhoto, setFeedPhoto] = useState<any>()

    useEffect(()=>{
        const xhr = new XMLHttpRequest()
        xhr.open("GET",`${Urls.hostPath}${feedData.photo_path.split(',')[index]}`);
        xhr.responseType= "blob";
        xhr.onload = () =>{ //asynchronous
            const reader = new FileReader();
            reader.readAsDataURL(xhr.response);
            reader.onloadend = () => {
                const photo = new Image();
                photo.src = reader.result as string;
                photo.onload = () => {
                    setFeedPhoto({src:photo.src, height: photo.height, width: photo.width})
                }
        }
        }
        xhr.send() 
    },[index])


    return(
        <>
        {feedPhoto !== undefined ? 
        <>
            
                <div className = {`${styles.photo_wrapper} photo_wrapper`}>
                <img src={feedPhoto.src} alt='feed_image' id = {feedPhoto.height > feedPhoto.width ? styles.fitHeight : styles.fitWidth}/>
                </div>
        </>
        : null}
        </>
    )
}

export default FeedPhoto