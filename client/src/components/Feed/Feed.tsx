import React from 'react'
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
                        <img src={`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${feedData.user_id}`}/>
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

    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <FeedHeader feedData={feedData}/>
                <hr/>
                <div className={styles.feed_photo}>
                    <img src={`http://localhost:8080/family-homepage/server/readFeedPhoto.php?photo_path=${feedData.photo_path}`}/>
                </div>
                <hr/>
                <div className={styles.feed_content}>
                    <p>{feedData.text}</p>
                </div>
            </div>
        </div>
        </>
    )
}

export default Feed;