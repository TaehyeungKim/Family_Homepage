import {useState, useEffect, useRef} from 'react'
import styles from './FeedPhoto.module.scss';
import './translate.css';

interface FeedPhotoProps {
    feedData: any;
    index: number;
    photoShownIndex: number;
    touchStatus: string
    touchCoordinateX: number;
    touchEndCoordinateX: number;
    setPhotoShownIndex:(index: number) => void;
    isMobile: boolean;
    touchStartMs: number;
    
}

function FeedPhoto({feedData, index, photoShownIndex, touchStatus, touchCoordinateX, touchEndCoordinateX, setPhotoShownIndex, isMobile, touchStartMs}:FeedPhotoProps){

    const [feedPhoto, setFeedPhoto] = useState<any>()
    const photo_container = useRef<HTMLDivElement>(null);
    const prevIndex = useRef<number>(0);

    const startX = useRef<number>(0);

    const [offsetX, setOffsetX] = useState<number>(0);

    useEffect(()=>{
        const xhr = new XMLHttpRequest()
        xhr.open("GET",`http://localhost:8080/family-homepage/server/${feedData.photo_path.split(',')[index]}`);
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

    useEffect(()=>{
        photo_container.current?.classList.add("index_0")
        prevIndex.current = 0
    },[feedPhoto])

    useEffect(()=>{
        photo_container.current?.classList.replace(`index_${prevIndex.current}`,`index_${photoShownIndex}`)
        prevIndex.current = photoShownIndex
    },[photoShownIndex])



    useEffect(()=>{
        if(isMobile && touchStatus === "moving") {
            if(photo_container.current !== null 
                && !(photoShownIndex === 0 && touchCoordinateX - startX.current > 0) 
                && !(photoShownIndex === feedData.photo_path.split(',').length-1 && touchCoordinateX - startX.current < 0)) {
                setOffsetX(-(photoShownIndex * 100) + (touchCoordinateX - startX.current)/photo_container.current.offsetWidth * 100)
                photo_container.current.style.transform = `translateX(${offsetX}%)`
            }
        }
    },[touchCoordinateX])

    useEffect(()=>{
        if(isMobile) {
            if(touchStatus === "start") {
                startX.current = touchCoordinateX
                if(photo_container.current !== null) {
                    setOffsetX(-(photoShownIndex * 100)+ (touchCoordinateX - startX.current)/photo_container.current.offsetWidth * 100)
                    photo_container.current.classList.add('mobile_swipe_duration')
                }
            }
            else if (touchStatus === "end") {
                if(photo_container.current !== null && photoShownIndex <= feedData.photo_path.split(',').length - 1 && photoShownIndex >= 0) {
                    photo_container.current.classList.remove('mobile_swipe_duration')
                    photo_container.current.style.transform = '';

                    const velocity = Math.abs((-(photoShownIndex * photo_container.current.offsetWidth) - offsetX)/(touchStartMs-Date.now()))
                    switch(true) {
                        case (velocity >= 0.1):
                            if(-(photoShownIndex * 100) - offsetX > 0) {
                                setPhotoShownIndex(prevIndex.current + 1)
                            }
                            else if(-(photoShownIndex * 100) - offsetX < 0) {
                                setPhotoShownIndex(prevIndex.current - 1)
                            }
                            break;
                        default:
                            setPhotoShownIndex(Math.round(-offsetX/100))
                        
                    }
                  
                } 
                startX.current = 0;
            }
        }
    },[touchStatus])



    return(
        <>
        {feedPhoto !== undefined ? 
        <>
            <div className = {styles.photo_container} ref={photo_container}>
                <div className = {styles.photo_wrapper}>
                <img src={feedPhoto.src} alt='feed_image' id = {feedPhoto.height > feedPhoto.width ? styles.fitHeight : styles.fitWidth}/>
                </div>
            </div>
        </>
        : null}
        </>
    )
}

export default FeedPhoto