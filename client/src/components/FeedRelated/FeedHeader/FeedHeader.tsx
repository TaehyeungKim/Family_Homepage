import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadProfileImg } from '../../LoadProfileImg/LoadProfileImg';
import {DeleteFeedAlert} from '../../DeleteAlert/DeleteAlert';
import styles from './FeedHeader.module.scss';
import Urls from '../../../utils/Url';


interface FeedHeaderProps {
    feedData: any;
    feedProfileImageData: React.MutableRefObject<any>;
    feedProfileImageLoadStatus:string;
}


function FeedHeader({feedData, feedProfileImageData, feedProfileImageLoadStatus}: FeedHeaderProps) {

    const [alertVisible, setAlertVisible] = useState<boolean>(false);

    
    const showAlert = () => {
        setAlertVisible(true);
    }

    const hideAlert = () => {
        setAlertVisible(false);
    }

    let navigate = useNavigate();

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

    const session = sessionStorage


    return(
        <>  
            {/* {profileImageData === undefined ? <LoadProfileImg url = {Urls.readProfileImg} user_id = {feedData.user_id} loadProfileData={loadProfileData}/> : null} */}
            {/* delete feed alert */}
            <DeleteFeedAlert deleteFeed={deleteFeed} alertVisible={alertVisible} hideAlert={hideAlert} feedData={feedData} message={'피드를 정말 삭제하시겠습니까?'}/>
            <div className={styles.feed_header}>
                <div className = {styles.profile_image_container}>
                    <div className={styles.profile_image}>
                        {/* {profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>} */}
                        {feedProfileImageLoadStatus === "toLoadFeedProfileImage" ? null : <img src = {feedProfileImageData.current[`${feedData.user_id}`].src} id = {feedProfileImageData.current[`${feedData.user_id}`].height > feedProfileImageData.current[`${feedData.user_id}`].width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
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