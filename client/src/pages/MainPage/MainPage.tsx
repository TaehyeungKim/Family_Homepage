import React, { useState, useEffect } from 'react';
import styles from './MainPage.module.scss'
import {Navigate} from 'react-router-dom'

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';

interface LoadUserFeedProps {
    setFeedData:(data: any) => void;
    stopLoading:() => void;
}

function LoadUserFeed({setFeedData, stopLoading}:LoadUserFeedProps) {
    const feedUrl = "http://localhost:8080/family-homepage/server/loadFeed.php"

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
    const url = "http://localhost:8080/family-homepage/server/loadUserInfo.php"
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

    useEffect(() => {
        loadUserInfo(url, data);
    })



    return (
        <>
            {session.islogin === 'true' ?
            <> 
            <div className = {styles.frame}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                <Nav onClick = {sidebarMove}/>
                <div className={styles.jumbotron}> </div>
                <div className= {styles.feed_area}>
                    {jsonData === undefined ? 
                    <div style={{width: '100px', height: '100px', border: '2px solid black'}}/>
                    :   
                    jsonData.data.map((feedData: any) => (
                        <Feed feedData={feedData}/>
                    ))}
                </div>
            </div>
            {stopLoading === false ? <LoadUserFeed setFeedData={setFeedData} stopLoading={stopLoadingData}/> : null}
            </>
            :
            <Navigate to = {`/login`}/>
            }
            
        </>
    )
}

export default MainPage;