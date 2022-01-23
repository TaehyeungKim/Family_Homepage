import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadProfileImg } from '../../LoadProfileImg/LoadProfileImg';
import {DeleteFeedAlert} from '../../DeleteAlert/DeleteAlert';
import styles from './FeedHeader.module.scss';

// interface LoadFeedUserProfileImgProps {
//     url: string,
//     feed_user_id: string,
//     loadProfilePath: (path: string)=>void;
// }

// function LoadFeedUserProfileImg({url, feed_user_id, loadProfilePath}:LoadFeedUserProfileImgProps) {

//     const data = new FormData();
//     data.append('user_id', feed_user_id);

//     const loadData = async() => {
//         const response = await fetch(url, {
//             method: "POST",
//             body: data
//         })

//         const json = await response.json()
//         .then((value)=>{loadProfilePath(value.path)});
//     }

//     useEffect(()=>{
//         loadData();
//     })
//     return(
//         <>
//         </>
//     )
// }



interface FeedHeaderProps {
    feedData: any;
}


function FeedHeader({feedData}: FeedHeaderProps) {

    const [alertVisible, setAlertVisible] = useState<boolean>(false);
    
    const [loadProfileImg, setLoadProfileImg] = useState<boolean>(true);
    const [profileImageData, setProfileImageData] = useState<any>();

    const loadProfileData = (json: any) => {
        setProfileImageData(json);
        setLoadProfileImg(false);
    }

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
            {loadProfileImg === true ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id = {feedData.user_id} loadProfileData={loadProfileData}/> : null}
        {/* {profileImagePath !== "" ? null : <LoadFeedUserProfileImg url={"./server/readProfileImg.php"} feed_user_id={feedData.user_id} loadProfilePath={loadProfilePath}/>} */}
            {/* delete feed alert */}
            <DeleteFeedAlert deleteFeed={deleteFeed} alertVisible={alertVisible} hideAlert={hideAlert} feedData={feedData} message={'피드를 정말 삭제하시겠습니까?'}/>
            <div className={styles.feed_header}>
                <div className = {styles.profile_image_container}>
                    <div className={styles.profile_image}>
                        {profileImageData === undefined ? null : <img src = {profileImageData.path} id = {profileImageData.height > profileImageData.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                        {/* <img src={profileImagePath} alt='profile'/> */}
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