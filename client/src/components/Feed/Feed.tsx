import React, {useState, useRef, useEffect} from 'react'
import styles from './Feed.module.scss'

import FeedHeader from '../FeedRelated/FeedHeader/FeedHeader'
import FeedCommentShow from '../FeedRelated/FeedCommentShow/FeedCommentShow'
import FeedPhoto from '../FeedRelated/FeedPhoto/FeedPhoto'
import Urls from '../../utils/Url';
import FeedPhotoIndex from '../FeedRelated/FeedPhotoIndex/FeedPhotoIndex'
import './translate.css'
import {useMediaQuery} from 'react-responsive'; 
import { ScriptElementKindModifier } from 'typescript'

interface FeedProps {
    feedData: any,
    profileImageData: React.MutableRefObject<any>;
    feedProfileImageData: React.MutableRefObject<any>;
    feedProfileImageLoadStatus: string;
    idx: number;
}


function Feed({feedData, profileImageData, feedProfileImageData, feedProfileImageLoadStatus, idx}: FeedProps) {

    const [buttonActive, setButtonActive] = useState<boolean>(false);

    const [commentData, setCommentData] = useState<any>();
    const [commentShown, setCommentShown] = useState<boolean>(false);
    const [commentUpdated, setCommentUpdated] = useState<boolean>(false);

    const [photoShownIndex, setPhotoShownIndex] = useState<number>(0);

    const isMobile = useMediaQuery({query: '(max-width: 600px)'})

    const activateButton = () => {
        if (buttonActive === false) {
            setButtonActive(true);
        }
    }

    const deactivateButton = () => {
        setButtonActive(false);
    }


    const commentIsUpdated = () => {
        setCommentUpdated(true);
    }

    const showComment = async (feed_id: number, feed_user: string) => {
        const loadUrl = Urls.loadComment;
        const data = new FormData();
        data.append('feed_id', feed_id.toString());
        data.append('feed_user', feed_user);
        const response = await fetch(loadUrl, {
            method: "POST",
            body: data
        })
        const json = await response.json()
        setCommentData(json);
        setCommentShown(true);
    }

    const hideComment = () => {
        setCommentShown(false);
    }

    const comment = useRef<HTMLTextAreaElement>(null);

    const uploadComment = async (feed_id: number, feed_user: string, comment_user: string, comment: string) => {
        const url = Urls.commentUpload;
        const data = new FormData();
        data.append('feed_id', feed_id.toString());
        data.append('feed_user', feed_user);
        data.append('comment_user', comment_user);
        data.append('comment', comment);

        const fetchData = await fetch(url, {
            method: "POST",
            body: data
        })

        const text = await fetchData.text().then((value)=>{
            showComment(feed_id, feed_user);
        }).then((value)=>{
            setButtonActive(false)
            setCommentUpdated(true)});

        return ""
    }


    const clearComInp = (clear: string, target: HTMLTextAreaElement) => {
        target.value = clear;
    }

    //created_at date
    const year = feedData.created_at.split(" ")[0].split("-")[0];
    const month = feedData.created_at.split(" ")[0].split("-")[1];
    const day = feedData.created_at.split(" ")[0].split("-")[2];
    const time = feedData.created_at.split(" ")[1];

    const session = sessionStorage;

    const frame = useRef<HTMLDivElement>(null);

    const switchShownPhotos = (direction:string) => {
        const executeSwitch = (direction: string) => {
            if(direction === 'left') {
                if(photoShownIndex > 0) {
                    setPhotoShownIndex(photoShownIndex-1)
                }
            } else if(direction === 'right') {
                if(photoShownIndex < feedData.photo_path.split(',').length-1) {
                    setPhotoShownIndex(photoShownIndex+1);   
                }
            }
        }
        executeSwitch(direction);
    }



    const photoTouchFrame = useRef<HTMLDivElement>(null);
    
    const touchStartCoordinateX = useRef<number>(0);
    const touchTranslate = useRef<number>(0);
    const photo_container = useRef<HTMLDivElement>(null);

    const touchStartMs = useRef<number>(0);
    const prevIndex = useRef<number>(0);
    const collection = useRef<HTMLCollectionOf<Element>>(document.getElementsByClassName(`photo_container_${idx}`))
    const mapFunc = (f:Function) => {
        for(let i = 0; i < collection.current.length; i++) {
            f(collection.current.item(i))
        }
    }
  
    const funcRefStore = useRef<any>({
        touchStartFunc: (e: TouchEvent) => {
            touchStartMs.current = Date.now()
            touchStartCoordinateX.current = e.targetTouches[0].clientX;
            mapFunc((elm:Element)=>{
                elm.classList.remove('desktop_switch_duration')
                elm.classList.add('mobile_swipe_duration')})
        },
        touchMoveFunc: (e: TouchEvent) => {
            if(photo_container.current) {
                const swipeOffset = (e.targetTouches[0].clientX - touchStartCoordinateX.current)/photo_container.current.offsetWidth * 100     
                touchTranslate.current = -(prevIndex.current * 100) + swipeOffset
                if(!(prevIndex.current === 0 && swipeOffset >0)&&!(prevIndex.current === feedData.photo_path.split(',').length-1 && swipeOffset < 0)) {
                    mapFunc((elm:Element)=>{elm.setAttribute('style',`transform: translateX(${touchTranslate.current}%)`)})
                }
            }
        },
        touchEndFunc: (e: TouchEvent) => {
            // mapFunc((elm:Element) =>{
            //     elm.classList.remove('mobile_swipe_duration')
            //     elm.classList.add('desktop_switch_duration')})
            console.log(prevIndex.current,touchTranslate.current)
            if(photo_container.current) {
                const storedIndex = prevIndex.current
                const distance = -(prevIndex.current * 100) - touchTranslate.current
                const velocity = Math.abs(distance/(touchStartMs.current-Date.now()))
                const moveLeftCon = distance > 0 && storedIndex < feedData.photo_path.split(',').length-1
                const moveRightCon = distance < 0 && storedIndex > 0
                const swipeCompute = (arg:number, dir:string, forward:boolean) => {
                    const forwardExp = dir === 'left' ? (arg:number) => {return (arg*0.01)*(arg-200)} : (arg:number) => {return -(arg*0.01)*(arg-200)}
                    const backExp = dir === 'left' ? (arg:number)=>{return -(arg*0.01)*(arg)} : (arg:number)=>{return (arg*0.01)*(arg)}
                    const swipeInterval = setInterval(()=>{
                        const innerExp = forward ? forwardExp(arg)-storedIndex*100 : backExp(arg)-storedIndex*100
                        mapFunc((elm: Element)=>{elm.setAttribute('style',`transform: translateX(${innerExp}%)`)})
                        if(forward ? arg >= 100 : arg <= 0) {
                            clearInterval(swipeInterval)
                            mapFunc((e:Element)=>e.removeAttribute('style'))
                            if(forward===true && dir==='left') touchTranslate.current=-(storedIndex+1)*100;
                            else if(forward===true&&dir==='right') touchTranslate.current=-(storedIndex-1)*100;
                            else if(forward===false) touchTranslate.current = -(storedIndex)*100;
                        }
                        forward ? arg++ : arg--
                    },5)
                }
                switch(true) {    
                    case (velocity >= 0.1):
                        if(moveLeftCon) {
                            swipeCompute(-touchTranslate.current - prevIndex.current*100,'left',true)
                            setPhotoShownIndex(prevIndex.current+1)
                        }
                        else if(moveRightCon) {
                            swipeCompute(prevIndex.current*100 + touchTranslate.current,'right',true)
                            setPhotoShownIndex(prevIndex.current-1)
                        }
                        break;
                    default:
                        if(moveLeftCon) {
                            swipeCompute(-touchTranslate.current-prevIndex.current*100,'left',false)   
                            
                        } else if(moveRightCon) {
                            swipeCompute(prevIndex.current*100 + touchTranslate.current,'right',false)
                            
                        }
                        // setPhotoShownIndex(Math.round(-touchTranslate.current/100))
                 
                }
            }
            touchStartCoordinateX.current = 0;   
        }
    });

    useEffect(()=>{
        if(isMobile) {
            photoTouchFrame.current?.addEventListener('touchstart', funcRefStore.current.touchStartFunc)
            photoTouchFrame.current?.addEventListener('touchmove', funcRefStore.current.touchMoveFunc)
            photoTouchFrame.current?.addEventListener('touchend', funcRefStore.current.touchEndFunc)   
        }
        else {
            photoTouchFrame.current?.removeEventListener('touchstart', funcRefStore.current.touchStartFunc)
            photoTouchFrame.current?.removeEventListener('touchmove', funcRefStore.current.touchMoveFunc)
            photoTouchFrame.current?.removeEventListener('touchend', funcRefStore.current.touchEndFunc)   
        }
    },[isMobile])

    useEffect(()=>{
        mapFunc((e:Element)=>e.classList.replace(`index_${prevIndex.current}`,`index_${photoShownIndex}`))
        prevIndex.current = photoShownIndex;
    },[photoShownIndex])

    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <FeedHeader feedData={feedData} feedProfileImageData={feedProfileImageData} feedProfileImageLoadStatus={feedProfileImageLoadStatus}/>
                <hr/>
                <div className={styles.feed_photo} ref={photoTouchFrame}>
                {!isMobile && feedData.photo_path.split(",").length > 1 ? 
                    <div className = {styles.buttonArea} id ={styles.left}>
                        <button onClick = {()=>switchShownPhotos('left')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                                <circle r="8" cx="8" cy="8"></circle>
                            </svg>
                        </button>
                    </div> : null}
                {!isMobile && feedData.photo_path.split(",").length > 1 ? 
                    <div className = {styles.buttonArea} id = {styles.right}>
                        <button onClick = {()=>switchShownPhotos('right')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
                                <circle r="8" cx="8" cy="8"></circle>
                            </svg>
                </button></div> : null}
                    <div className = {styles.wrapper} ref={frame} id="frame">
                    {
                    feedData.photo_path.split(',').map((i:any, index:number)=>{
                        return (
                        <div className = {`${styles.photo_container} photo_container_${idx} desktop_switch_duration index_${photoShownIndex}`} ref={photo_container} id = {`feed_photo_position_${index}`}>
                            <FeedPhoto feedData={feedData} index={index}/>
                        </div>)
                    })}
                    </div>
                </div>
                {feedData.photo_path.split(',').length > 1 ? 
                    <FeedPhotoIndex feedData={feedData} photoShownIndex={photoShownIndex}/> : null}
                <hr/>
                <div className={styles.feed_content}>
                    <p id = {styles.feedText}>{feedData.text}</p>
                    <p id = {styles.feedDate}>{year + "년 " + month + "월 " + day + "일"}</p>
                </div>
                <div className={styles.feed_comment}>
                    {/* button before comment updated */}
                    {feedData.comment_exists === 'true' && commentUpdated === false ? 
                    <button className = {styles.commentShowOrHideButton} onClick = {commentShown === false ? 
                        () => {
                            showComment(feedData.feed_id, feedData.user_id)} : hideComment}>{commentShown === false ? "댓글 보기" : "댓글 감추기"}</button> 
                    : 
                    null}
                    {/* button after comment updated */}
                    {commentUpdated === true && commentData !==undefined ? 
                        commentData.data.length !== 0 ? 
                        <button className = {styles.commentShowOrHideButton} onClick = {commentShown === false ? 
                            () => {
                                showComment(feedData.feed_id, feedData.user_id)} : hideComment}>{commentShown === false ? "댓글 보기" : "댓글 감추기"}</button> 
                                : null
                    : 
                    null}
                    <FeedCommentShow feedData={feedData} commentShown = {commentShown} commentData={commentData} showComment={showComment} commentIsUpdated={commentIsUpdated}/>
                    <div className={styles.comment_write}>
                        <div className = {styles.comment_profile_container}>
                            {profileImageData.current === undefined ? null : <img src = {profileImageData.current.src} id = {profileImageData.current.height > profileImageData.current.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                        </div>
                        <div className = {styles.textareaContainer}>
                        <textarea placeholder='댓글 달기' ref={comment} onChange={(e)=> {
                            e.preventDefault();
                            comment.current?.value !== "" ? activateButton() : deactivateButton();
                        }}></textarea>
                        </div>
                        <button onClick = { buttonActive === true ? (e)=>{
                            uploadComment(feedData.feed_id, feedData.user_id, session.user_id, comment.current?.value as string)
                            .then((resolve) =>{clearComInp(resolve, comment.current as HTMLTextAreaElement)});
                        }:undefined} id = {buttonActive === true ? styles.active : styles.notActive}>게시</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Feed;