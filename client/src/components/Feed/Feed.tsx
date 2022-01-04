import React from 'react'
import styles from './Feed.module.scss'

function Feed() {
    return(
        <>
        <div className={styles.feed_container}>
            <div className={styles.feed}>
                <div className={styles.feed_header}>
                    <div className = {styles.profile_image_container}>
                        <div className={styles.profile_image}>

                        </div>
                        <div className ={styles.profile_name}>
                            <p>taehyuengkim98</p>
                        </div>

                    </div>
                </div>
                <hr/>
                <div className={styles.feed_photo}>

                </div>
                <hr/>
                <div className={styles.feed_content}>

                </div>
            </div>
        </div>
        </>
    )
}

export default Feed;