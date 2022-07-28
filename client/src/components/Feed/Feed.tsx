import React, {useState, useRef, useEffect} from 'react'
import styles from './Feed.module.scss'

import FeedHeader from '../FeedRelated/FeedHeader/FeedHeader'
import FeedCommentShow from '../FeedRelated/FeedCommentShow/FeedCommentShow'
import FeedPhoto from '../FeedRelated/FeedPhoto/FeedPhoto'
import Urls from '../../utils/Url';
import FeedPhotoIndex from '../FeedRelated/FeedPhotoIndex/FeedPhotoIndex'
import {useMediaQuery} from 'react-responsive'; 

interface FeedProps {
    feedData: any,
    profileImageData: any
}


function Feed({feedData, profileImageData}: FeedProps) {

    const [buttonActive, setButtonActive] = useState<boolean>(false);

    const activateButton = () => {
        if (buttonActive === false) {
            setButtonActive(true);
        }
    }

    const deactivateButton = () => {
        setButtonActive(false);
    }

    const [commentData, setCommentData] = useState<any>();
    const [commentShown, setCommentShown] = useState<boolean>(false);
    const [commentUpdated, setCommentUpdated] = useState<boolean>(false);

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
    const [photoShownIndex, setPhotoShownIndex] = useState<number>(0);

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

    const isMobile = useMediaQuery({query: '(max-width: 600px)'})

    const photoTouchFrame = useRef<HTMLDivElement>(null);
    const touchStatus = useRef<string>("");
    const [touchCoordinateX, setTouchCoordinateX] = useState<number>(0);
    const touchEndCoordinateX = useRef<number>(0);

    const touchStartMs = useRef<number>(0);

    useEffect(()=>{
        if(isMobile) {
            photoTouchFrame.current?.addEventListener('touchstart', (e)=>{
                touchStatus.current = "start"
                setTouchCoordinateX(e.targetTouches[0].clientX);
                touchStartMs.current = Date.now()
            })
            photoTouchFrame.current?.addEventListener('touchend', (e)=>{
                touchStatus.current = "end";
                touchEndCoordinateX.current = touchCoordinateX;
                setTouchCoordinateX(0);
            })
            photoTouchFrame.current?.addEventListener('touchmove', (e)=>{
                touchStatus.current = "moving"
                setTouchCoordinateX(e.targetTouches[0].clientX);
            })
        }
    },[isMobile])


    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <FeedHeader feedData={feedData}/>
                <hr/>
                <div className={styles.feed_photo} ref={photoTouchFrame}>
                {!isMobile && feedData.photo_path.split(",").length > 1 ? 
                    <div className = {styles.buttonArea} id ={styles.left}>
                        <button onClick = {()=>switchShownPhotos('left')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M9.224 1.553a.5.5 0 0 1 .223.67L6.56 8l2.888 5.776a.5.5 0 1 1-.894.448l-3-6a.5.5 0 0 1 0-.448l3-6a.5.5 0 0 1 .67-.223z"/>
                            </svg>
                        </button>
                    </div> : null}
                {!isMobile && feedData.photo_path.split(",").length > 1 ? 
                    <div className = {styles.buttonArea} id = {styles.right}>
                        <button onClick = {()=>switchShownPhotos('right')}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671z"/>
                            </svg>
                </button></div> : null}
                    <div className = {styles.wrapper} ref={frame} id="frame">
                    {
                    feedData.photo_path.split(',').map((i:any)=>{
                        return <FeedPhoto feedData={feedData} index={feedData.photo_path.split(',').indexOf(i)} photoShownIndex={photoShownIndex} touchStatus={touchStatus.current} touchCoordinateX={touchCoordinateX} touchEndCoordinateX={touchEndCoordinateX.current} setPhotoShownIndex={setPhotoShownIndex} 
                        isMobile={isMobile} touchStartMs={touchStartMs.current}/>
                    })}
                    </div>
                    {feedData.photo_path.split(',').length > 1 ? 
                    <FeedPhotoIndex feedData={feedData} photoShownIndex={photoShownIndex}/> : null}
                </div>
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
                            {profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
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