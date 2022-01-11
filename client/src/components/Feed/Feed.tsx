import React from 'react'
import styles from './Feed.module.scss'

interface FeedProps {
    feedData: any;
}


function Feed({feedData}: FeedProps) {
    const session = sessionStorage;

    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <div className={styles.feed_header}>
                    <div className = {styles.profile_image_container}>
                        <div className={styles.profile_image}>
                            <img src={`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${feedData.user_id}`}/>
                        </div>
                        <div className ={styles.profile_name}>
                            <p>{feedData.user_id}</p>
                        </div>

                    </div>
                </div>
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