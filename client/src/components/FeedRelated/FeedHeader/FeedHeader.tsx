import React, {useState} from 'react';
import styles from './FeedHeader.module.scss'
import {useNavigate} from 'react-router-dom'


interface FeedHeaderProps {
    feedData: any;
}


function FeedHeader({feedData}: FeedHeaderProps) {

    const [alertVisible, setAlertVisible] = useState<boolean>(false);

    const showAlert = () => {
        setAlertVisible(true);
    }

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
            {/* delete feed alert */}
            <div className = {styles.deleteFeedAlert} id={alertVisible === true ? styles.alertVisible : styles.alertNotVisible}>
                <div className = {styles.alertContainer}>
                    <p>피드를 정말 삭제하시겠습니까?</p>
                    <div className = {styles.buttonContainer}>
                        <button id = {styles.yes} onClick={() => {
                    deleteFeed(url, feedData.user_id, feedData.feed_id, feedData.photo_type);
                }}>Yes</button>
                        <button id = {styles.no} onClick={()=>{setAlertVisible(false)}}>No</button>
                    </div>
                </div>
            </div>
            <div className={styles.feed_header}>
                <div className = {styles.profile_image_container}>
                    <div className={styles.profile_image}>
                        <img src={`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${feedData.user_id}`} alt='profile'/>
                    </div>
                </div>
                <div className ={styles.profile_name}>
                    <p>{feedData.user_id}</p>
                </div>
                {session.user_id === feedData.user_id ? <button className = {styles.feed_delete_button} onClick = {showAlert}>삭제</button> : null}

            </div>
        </>
    )
}

export default FeedHeader;