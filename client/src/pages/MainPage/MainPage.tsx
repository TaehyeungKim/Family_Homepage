import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.scss'
import {Navigate} from 'react-router-dom'
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';




interface LoadUserFeedProps {
    setFeedData:(data: any) => void;
    stopLoading:() => void;
}

function LoadUserFeed({setFeedData, stopLoading}:LoadUserFeedProps) {
    const feedUrl = "./server/loadFeed.php"

    const loadFeedData = async() => {
        const response = await fetch(feedUrl, {
            method: "GET"
        })
        const json = await response.json();
        console.log(json);
        setFeedData(json);
    }
    useEffect(() => {
        loadFeedData();
        stopLoading();
    })
    return(
        <></>
    )
}

function MainPage() {
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const [jsonData, setJsonData] = useState<any>();
    const [stopLoading, setStopLoading] = useState<boolean>(false);

    const setFeedData = (data: any) => {
        setJsonData(data);
    }

    const stopLoadingData = () => {
        setStopLoading(true);
    }

    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    const session = sessionStorage;
    const url = "./server/loadUserInfo.php"
    const data = {'user_id' : session.user_id}

    const loadUserInfo = async (url: string, data: any) => {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type" : "application/json"
            }
        })
        const json = await response.json();
        session.user_name = json.user_name;
        session.user_status = json.user_status;
    }

    const [loadProfileImg, setLoadProfileImg] = useState<boolean>(true);
    const [profileImagePath, setProfileImagePath] = useState<any>();

    const loadProfilePath = (json: any) => {
        setProfileImagePath(json);
        setLoadProfileImg(false);
    }

    useEffect(() => {
        loadUserInfo(url, data);
    })



    return (
        <>
            {session.islogin === 'true' ?
            <> 
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status} profileImagePath={profileImagePath}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                <Nav onClick = {sidebarMove}/>
                <div className = {styles.bodyWrapper}>
                    <div className={styles.jumbotron}> </div>
                    {jsonData === undefined || jsonData.data === 'empty' ? 
                        <div className= {styles.feed_area}>
                            <div className = {styles.noFeed}>
                                아직 우리 가족 피드가 없어요!<br/>새로운 피드를 추가해보세요!
                            </div>
                        </div>
                        :
                        <div className = {styles.feed_area} id ={styles.notEmpty}>
                            {jsonData.data.map((feedData: any, idx: any) => (
                            <React.Fragment key = {idx}>
                            <Feed feedData={feedData} profileImagePath={profileImagePath}/>
                            </React.Fragment>
                        ))
                            }
                        </div>   
                        }
                </div>
            {stopLoading === false ? <LoadUserFeed setFeedData={setFeedData} stopLoading={stopLoadingData}/> : null}
            {loadProfileImg === true ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id = {session.user_id} loadProfilePath={loadProfilePath}/> : null}
            </>
            :
            <Navigate to = {`/login`}/>
            }
        </>
    )
}

export default MainPage;