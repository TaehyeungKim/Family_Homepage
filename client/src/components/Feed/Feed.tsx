import React, {useState, useRef, useEffect, useMemo, useContext} from 'react'
import styles from './Feed.module.scss'

import FeedHeader from '../FeedRelated/FeedHeader/FeedHeader'
import FeedCommentShow from '../FeedRelated/FeedCommentShow/FeedCommentShow'
import FeedPhoto from '../FeedRelated/FeedPhoto/FeedPhoto'
import Urls from '../../utils/Url';
import FeedPhotoIndex from '../FeedRelated/FeedPhotoIndex/FeedPhotoIndex'
import './translate.css'
import {useMediaQuery} from 'react-responsive'; 

import { HandlerContext } from '../../App'


//chrome browser requires passive option when adding event
var supportsPassiveOption = false;
try {
    window.addEventListener('test',()=>{return;},Object.defineProperty({},'passive',{
        get: function() {supportsPassiveOption=true}
    }))
} catch(e:any) {
    console.log(e.message)
}

const opt = supportsPassiveOption ? {passive:false, capture: true} : false;
const preventDefault = (e:Event) => {
    e.preventDefault();
}

interface FeedProps {
    feedData: any,
    feedProfileImageLoadStatus: string;
    idx: number;
}


function Feed({feedData, feedProfileImageLoadStatus, idx}: FeedProps) {

    const [buttonActive, setButtonActive] = useState<boolean>(false);

    const [commentData, setCommentData] = useState<any>();
    const [commentShown, setCommentShown] = useState<boolean>(false);
    const [commentUpdated, setCommentUpdated] = useState<boolean>(false);

    const [photoShownIndex, setPhotoShownIndex] = useState<number>(0);

    const isMobile = useMediaQuery({query: '(max-width: 600px)'})
    const photoPathSplit = useMemo(()=>{return feedData.photo_path.split(',')},[feedData])

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
        try {
            const response = await fetch(loadUrl, {
                method: "POST",
                body: data
            })
            const json = await response.json()
            setCommentData(json);
            setCommentShown(true);
        } catch(e) {console.log(e)}
        
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

        try {
            const fetchData = await fetch(url, {
                method: "POST",
                body: data
            })
    
            const text = await fetchData.text().then((value)=>{
                showComment(feed_id, feed_user);
            }).then((value)=>{
                setButtonActive(false)
                setCommentUpdated(true)});
        } catch(e) {console.log(e)}
        return ""
    }


    const clearComInp = (clear: string, target: HTMLTextAreaElement) => {
        target.value = clear;
    }

    //created_at date
    const year = feedData.created_at.split(" ")[0].split("-")[0];
    const month = feedData.created_at.split(" ")[0].split("-")[1];
    const day = feedData.created_at.split(" ")[0].split("-")[2];


    const frame = useRef<HTMLDivElement>(null);

    const switchShownPhotos = (direction:string) => {
        const executeSwitch = (direction: string) => {
            if(direction === 'left') {
                if(photoShownIndex > 0) {
                    setPhotoShownIndex(photoShownIndex-1)
                }
            } else if(direction === 'right') {
                if(photoShownIndex < photoPathSplit.length-1) {
                    setPhotoShownIndex(photoShownIndex+1);   
                }
            }
        }
        executeSwitch(direction);
    }



    const photoTouchFrame = useRef<HTMLDivElement>(null);
    const photo_container = useRef<HTMLDivElement>(null);
    

    const swipeRefObject = useRef<any>({
        touchStartCoordinateX:0,
        touchStartCoordinateY:0,
        touchTranslate:0,
        touchStartMs:0,
        swipe:false,
        makeDecision:true,
        currentFrame:0
    })
    
    const prevIndex = useRef<number>(0);
    const collection = useRef<HTMLCollectionOf<Element>>(document.getElementsByClassName(`photo_container_${idx}`))
    const mapFunc = (f:Function) => {
        for(let i = 0; i < collection.current.length; i++) {
            f(collection.current.item(i))
        }
    }
  
    const funcRefStore = useRef<any>({
        touchStartFunc: (e: TouchEvent) => {
            swipeRefObject.current.touchStartMs = Date.now()
            swipeRefObject.current.touchStartCoordinateX = e.targetTouches[0].clientX;
            swipeRefObject.current.touchStartCoordinateY = e.targetTouches[0].clientY;
        },
        touchMoveFunc: (e: TouchEvent) => {
            //determine whether to swipe or scroll in the initial time
            if(swipeRefObject.current.makeDecision) {
                const hypotenuse = Math.sqrt((e.targetTouches[0].clientX-swipeRefObject.current.touchStartCoordinateX)**2+(e.targetTouches[0].clientY-swipeRefObject.current.touchStartCoordinateY)**2)
                const opposite = Math.abs(e.targetTouches[0].clientY-swipeRefObject.current.touchStartCoordinateY)
                opposite/hypotenuse < Math.sqrt(1/2) ? swipeRefObject.current.swipe = true : swipeRefObject.current.swipe = false;
                swipeRefObject.current.makeDecision = false;
            }
            
            if(swipeRefObject.current.swipe) {
                window.addEventListener('touchmove',preventDefault,opt)
                const swipeOffset = (e.targetTouches[0].clientX - swipeRefObject.current.touchStartCoordinateX)/ photo_container.current!.offsetWidth * 100     
                swipeRefObject.current.touchTranslate = -(prevIndex.current * 100) + swipeOffset
                if(!(prevIndex.current === 0 && swipeOffset >0)&&!(prevIndex.current === photoPathSplit.length-1 && swipeOffset < 0)) {
                    mapFunc((elm:Element)=>{elm.setAttribute('style',`transform: translateX(${swipeRefObject.current.touchTranslate}%)`)})
                }
            }
        },
        touchEndFunc: (e: TouchEvent) => {
            if(photo_container.current) {
                const storedIndex = prevIndex.current
                const distance = -(prevIndex.current * 100) - swipeRefObject.current.touchTranslate
                const velocity = Math.abs(distance/(swipeRefObject.current.touchStartMs-Date.now()))
                const moveLeftCon = distance > 0 && storedIndex < photoPathSplit.length-1
                const moveRightCon = distance < 0 && storedIndex > 0
                const swipeCompute = (arg:number, dir:string, forward:boolean) => {
                    const forwardExp = dir === 'left' ? (arg:number) => {return (arg*0.01)*(arg-200)} : (arg:number) => {return -(arg*0.01)*(arg-200)}
                    const backExp = dir === 'left' ? (arg:number)=>{return -(arg*0.01)*(arg)} : (arg:number)=>{return (arg*0.01)*(arg)}
                    const swipeInterval = setInterval(()=>{
                        const innerExp = forward ? forwardExp(arg)-storedIndex*100 : backExp(arg)-storedIndex*100
                        mapFunc((elm: Element)=>{elm.setAttribute('style',`transform: translateX(${innerExp}%)`)})
                        if(forward ? arg >= 100 : arg <= 0) {
                            clearInterval(swipeInterval)
                            mapFunc((elm:Element)=>elm.removeAttribute('style'))
                            if(forward===true && dir==='left') swipeRefObject.current.touchTranslate=-(storedIndex+1)*100;
                            else if(forward===true&&dir==='right') swipeRefObject.current.touchTranslate=-(storedIndex-1)*100;
                            else if(forward===false) swipeRefObject.current.touchTranslate = -(storedIndex)*100;
                        }
                        forward ? arg++ : arg--
                    },5)
                }
                switch(true) {    
                    case (velocity >= 0.1):
                        if(moveLeftCon) {
                            swipeCompute(-swipeRefObject.current.touchTranslate - prevIndex.current*100,'left',true)
                            setPhotoShownIndex(prevIndex.current+1)
                        }
                        else if(moveRightCon) {
                            swipeCompute(prevIndex.current*100 + swipeRefObject.current.touchTranslate,'right',true)
                            setPhotoShownIndex(prevIndex.current-1)
                        }
                        break;
                    default:
                        if(moveLeftCon) {
                            swipeCompute(-swipeRefObject.current.touchTranslate-prevIndex.current*100,'left',false)   
                            
                        } else if(moveRightCon) {
                            swipeCompute(prevIndex.current*100 + swipeRefObject.current.touchTranslate,'right',false)
                            
                        }
                        // setPhotoShownIndex(Math.round(-touchTranslate.current/100))
                 
                }
            }
            Object.defineProperties(swipeRefObject.current, {
                touchStartCoordinateX: {value:0},
                touchStartCoordinateY:{value:0},
                touchStartMs:{value:0},
                swipe:{value:false},
                makeDecision:{value:true},
                currentFrame:{value:0}
            })
            window.removeEventListener('touchmove',preventDefault,opt)
        }
    });

    const context = useContext(HandlerContext)

    useEffect(()=>{
        if(photoTouchFrame.current) {
            if(isMobile) {
                photoTouchFrame.current.addEventListener('touchstart', funcRefStore.current.touchStartFunc)
                photoTouchFrame.current.addEventListener('touchmove', funcRefStore.current.touchMoveFunc)
                photoTouchFrame.current.addEventListener('touchend', funcRefStore.current.touchEndFunc)
            
            }
            else {
                photoTouchFrame.current.removeEventListener('touchstart', funcRefStore.current.touchStartFunc)
                photoTouchFrame.current.removeEventListener('touchmove', funcRefStore.current.touchMoveFunc)
                photoTouchFrame.current.removeEventListener('touchend', funcRefStore.current.touchEndFunc)   
            }
        }
    },[isMobile])

    useEffect(()=>{
        mapFunc((e:Element)=>{
            e.classList.replace(`index_${prevIndex.current}`,`index_${photoShownIndex}`)})
        prevIndex.current = photoShownIndex;
    },[photoShownIndex])

    return(
        <>
        <article className={styles.feed_container}>
            <div className={styles.feed}>
                <FeedHeader feedData={feedData} feedProfileImageLoadStatus={feedProfileImageLoadStatus}/>
                {/* <hr/> */}

                {/* Feed Photo */}
                <div className={styles.feed_photo} ref={photoTouchFrame}>
                    <div className = {styles.feed_photo_innerframe}>
                {!isMobile && photoPathSplit.length > 1 ? 
                    <div className = {styles.buttonArea} id ={styles.left}>
                        <button onClick = {()=>switchShownPhotos('left')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                                <circle r="8" cx="8" cy="8"></circle>
                            </svg>
                        </button>
                    </div> : null}
                {!isMobile && photoPathSplit.length > 1 ? 
                    <div className = {styles.buttonArea} id = {styles.right}>
                        <button onClick = {()=>switchShownPhotos('right')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
                                <circle r="8" cx="8" cy="8"></circle>
                            </svg>
                        </button>
                    </div> : null}
                    <div className = {styles.wrapper} ref={frame} id="frame">
                    {
                    photoPathSplit.map((i:any, index:number)=>{
                        return (
                        <div className = {`${styles.photo_container} photo_container_${idx} index_${photoShownIndex} ${isMobile ? 'mobile_swipe_duration':'desktop_switch_duration'}`} ref={photo_container} id = {`feed_photo_position_${index}`}>
                            <FeedPhoto feedData={feedData} index={index}/>
                        </div>)
                    })}
                    </div>
                    </div>
                </div>




                {/* Feed Photo Index */}
                {photoPathSplit.length > 1 ? 
                    <FeedPhotoIndex feedData={feedData} photoShownIndex={photoShownIndex}/> : null}
                {/* <hr/> */}




                {/* Feed Content */}
                <div className={styles.feed_content}>
                    <p id = {styles.feedText}>{feedData.text}</p>
                    <p id = {styles.feedDate}>{year + "년 " + month + "월 " + day + "일"}</p>
                </div>




                {/* Feed Comment */}
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
                            <div className = {styles.profile_innerframe}>
                            { context.getLoginUser('image') === undefined ? null : <img src = {context.getLoginUser('image').src} id = {context.getLoginUser('image').height > context.getLoginUser('image').width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                            </div>
                        </div>
                        <div className = {styles.textareaContainer}>
                        <textarea placeholder='댓글 달기' ref={comment} onChange={(e)=> {
                            e.preventDefault();
                            comment.current?.value !== "" ? activateButton() : deactivateButton();
                        }}></textarea>
                        </div>
                        <div className={styles.buttonContainer}>
                        <button onClick = { buttonActive === true ? (e)=>{
                            uploadComment(feedData.feed_id, feedData.user_id, context.getLoginUser('user_id'), comment.current?.value as string)
                            .then((resolve) =>{clearComInp(resolve, comment.current as HTMLTextAreaElement)});
                        }:undefined} id = {buttonActive === true ? styles.active : styles.notActive}>게시</button>
                        </div>
                    </div>
                </div>
            </div>
        </article>
        </>
    )
}

export default Feed;