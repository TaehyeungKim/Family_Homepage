import {useState, useRef} from 'react'
import styles from './Feed.module.scss'

import FeedHeader from '../FeedRelated/FeedHeader/FeedHeader'
import FeedCommentShow from '../FeedRelated/FeedCommentShow/FeedCommentShow'
import Urls from '../../utils/Url';


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


    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <FeedHeader feedData={feedData}/>
                <hr/>
                <div className={styles.feed_photo}>
                    <img src={feedData.photo_path} alt='feed_image'/>
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