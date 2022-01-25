import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.scss'
import {Outlet, Navigate, useLocation} from 'react-router-dom'
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';




interface LoadUserFeedProps {
    setFeedData:(data: any) => void;
}

function LoadUserFeed({setFeedData}:LoadUserFeedProps) {
    const feedUrl = "./server/loadFeed.php"

    const loadFeedData = async() => {
        const response = await fetch(feedUrl, {
            method: "GET"
        })
        const json = await response.json();
        setFeedData(json);
    }
    useEffect(() => {
        loadFeedData();
    })
    return(
        <></>
    )
}

function MainPage() {
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    const [feedJsonData, setFeedJsonData] = useState<any>();
 
    const setFeedData = (data: any) => {
        setFeedJsonData(data);
    }

    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    const session = sessionStorage;
    const url = "../server/loadUserInfo.php"
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

    const [profileImageData, setProfileImageData] = useState<any>();

    const loadProfileData = (json: any) => {
        setProfileImageData(json);
        console.log('loadProfileImg');
    }

    const location = useLocation();

    useEffect(() => {
        loadUserInfo(url, data);
        session.page = location.pathname;
    })



    return (
        <>
            {session.islogin === 'true' ?
            <> 
            {feedJsonData === undefined ? <LoadUserFeed setFeedData={setFeedData}/> : null}
            {profileImageData === undefined ? <LoadProfileImg url = {"./server/readProfileImg.php"} user_id = {session.user_id} loadProfileData={loadProfileData}/> : null}
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status} profileImageData={profileImageData}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                <Nav onClick = {sidebarMove}/>
                <div className = {styles.bodyWrapper}>
                    <div className={styles.jumbotron}> </div>
                    {feedJsonData === undefined || feedJsonData.data === 'empty' ? 
                        <div className= {styles.feed_area}>
                            <div className = {styles.noFeed}>
                                아직 우리 가족 피드가 없어요!<br/>새로운 피드를 추가해보세요!
                            </div>
                        </div>
                        :
                        <div className = {styles.feed_area} id ={styles.notEmpty}>
                            {feedJsonData.data.map((feedData: any, idx: any) => (
                            <React.Fragment key = {idx}>
                                <Feed feedData={feedData} profileImageData={profileImageData}/>
                            </React.Fragment>
                        ))
                            }
                        </div>   
                        }
                </div>
            </>
            :
            <Navigate to = {`/login`}/>
            }
            <Outlet/>
        </>
    )
}

export default MainPage;