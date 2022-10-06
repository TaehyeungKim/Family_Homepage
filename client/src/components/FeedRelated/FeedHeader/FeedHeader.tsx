import {useEffect, useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadProfileImg } from '../../LoadProfileImg/LoadProfileImg';
import {DeleteFeedAlert} from '../../DeleteAlert/DeleteAlert';
import styles from './FeedHeader.module.scss';
import Urls from '../../../utils/Url';

import {HandlerContext} from '../../../App'


interface FeedHeaderProps {
    feedData: any;
    feedProfileImageLoadStatus:string;
}


function FeedHeader({feedData, feedProfileImageLoadStatus}: FeedHeaderProps) {

    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    const context = useContext(HandlerContext)

    
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
        try {
            const response = await fetch(url, {
                method: "POST",
                body: formData
            })
            const text = await response.text()
                .then((value) => {console.log(value)})
                .then(() => navigate(`/main_proxy`));
        }
        catch(e) {console.log(e)}
        

    }

    


    return(
        <>  
            {/* delete feed alert */}
            <DeleteFeedAlert deleteFeed={deleteFeed} alertVisible={alertVisible} hideAlert={hideAlert} feedData={feedData} message={'피드를 정말 삭제하시겠습니까?'}/>
            <div className={styles.feed_header}>
                <div className = {styles.profile_image_container}>
                    <div className={styles.profile_image}>
                        {feedProfileImageLoadStatus === "toLoadFeedProfileImage" ? null : <img src = {context.getFeedProfileImageData(feedData.user_id).src} id = {context.getFeedProfileImageData(feedData.user_id).height > context.getFeedProfileImageData(feedData.user_id).width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                    </div>
                </div>
                <div className ={styles.profile_name}>
                    <p>{feedData.user_id}</p>
                </div>
                {context.getLoginUser('user_id') === feedData.user_id ? <button className = {styles.feed_delete_button} onClick = {showAlert}>삭제</button> : null}
            </div>
        </>
    )
}

export default FeedHeader;