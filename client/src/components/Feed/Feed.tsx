import React, {useState, useRef} from 'react'
import {useNavigate} from 'react-router-dom'
import styles from './Feed.module.scss'


interface FeedHeaderProps {
    feedData: any;
}


function FeedHeader({feedData}: FeedHeaderProps) {

    let navigate = useNavigate();
    const session = sessionStorage

    const url = "http://localhost:8080/family-homepage/server/deleteFeed.php";

    const deleteFeed = async(url: string, user_id: string, feed_id: string, photo_type: string) => {
        const formData = new FormData();
        formData.append('user_id', user_id)
        formData.append('feed_id', feed_id);
        formData.append('photo_type', photo_type);
        const response = await fetch(url, {
            method: "POST",
            body: formData
        })
        const text = await response.text()
            .then((value) => {console.log(value)})
            .then(() => navigate(`/main_proxy`));

    }

    return(
        <>
            <div className={styles.feed_header}>
                <div className = {styles.profile_image_container}>
                    <div className={styles.profile_image}>
                        <img src={`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${feedData.user_id}`} alt='profile'/>
                    </div>
                </div>
                <div className ={styles.profile_name}>
                    <p>{feedData.user_id}</p>
                </div>
                {session.user_id === feedData.user_id ? <button className = {styles.feed_delete_button} onClick = {() => {
                    deleteFeed(url, feedData.user_id, feedData.feed_id, feedData.photo_type);
                }}>삭제</button> : null}

            </div>
        </>
    )
}

interface FeedProps {
    feedData: any;
}


function Feed({feedData}: FeedProps) {

    const [buttonActive, setButtonActive] = useState<boolean>(false);

    const activateButton = () => {
        if (buttonActive === false) {
            setButtonActive(true);
        }
    }

    const deactivateButton = () => {
        setButtonActive(false);
    }

    const [commentShown, setCommentShown] = useState<any>(false);

    const showComment = async (feed_id: number, feed_user: string) => {
        const loadUrl = "http://localhost:8080/family-homepage/server/loadComment.php"
        const data = new FormData();
        data.append('feed_id', feed_id.toString());
        data.append('feed_user', feed_user);
        const response = await fetch(loadUrl, {
            method: "POST",
            body: data
        })
        const json = await response.json()
        setCommentShown(json);
        console.log(json);
    }

    const hideComment = () => {
        setCommentShown(false);
    }

    const comment = useRef<HTMLTextAreaElement>(null);

    const fetchComment = async (feed_id: number, feed_user: string, comment_user: string, comment: string) => {
        const url = "http://localhost:8080/family-homepage/server/commentUpload.php"
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
        })

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
                    <img src={`http://localhost:8080/family-homepage/server/readFeedPhoto.php?photo_path=${feedData.photo_path}`} alt='feed_image'/>
                </div>
                <hr/>
                <div className={styles.feed_content}>
                    <p id = {styles.feedText}>{feedData.text}</p>
                    <p id = {styles.feedDate}>{year + "년 " + month + "월 " + day + "일"}</p>
                </div>
                <div className={styles.feed_comment}>
                    {feedData.comment_exists === 'true' ? 
                    <button className = {styles.commentShowOrHideButton} onClick = {commentShown === false ? 
                        () => {
                            showComment(feedData.feed_id, feedData.user_id)} : hideComment}>{commentShown === false ? "댓글 보기" : "댓글 감추기"}</button> 
                    : 
                    null}
                    {commentShown === false ? null 
                    : 
                    commentShown.data.map((em: any) =>(
                        <div className = {styles.commentLine}>
                            <span>{em.comment_user}</span>
                            {em.comment}
                        </div>
                    ))}
                    <div className={styles.comment_write}>
                        <div className = {styles.comment_profile_container}>
                            <img src = {`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${session.user_id}`} alt = 'profile'/>
                        </div>
                        
                        <textarea placeholder='댓글 달기' ref={comment} onChange={(e)=> {
                            e.preventDefault();
                            comment.current?.value !== "" ? activateButton() : deactivateButton();
                        }}></textarea>
         
                        <button onClick = { buttonActive === true ? (e)=>{
                            fetchComment(feedData.feed_id, feedData.user_id, session.user_id, comment.current?.value as string)
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