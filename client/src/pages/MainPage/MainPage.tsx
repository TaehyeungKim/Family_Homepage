import React, { useState, useEffect, useRef } from 'react';
import styles from './MainPage.module.scss'
import {Outlet, Navigate, useLocation} from 'react-router-dom'
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';
import LoadUser from '../../components/LoadUser/LoadUser';

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';

import Urls from '../../utils/Url';




interface LoadUserFeedProps {
    // setFeedData:(data: any) => void;
    setLoadStatus:(status:string) => void;
    userFeedData:React.MutableRefObject<any>;
}

function LoadUserFeed({setLoadStatus, userFeedData}:LoadUserFeedProps) {
    const feedUrl = Urls.loadFeed;

    const loadFeedData = async() => {
        const response = await fetch(feedUrl, {
            method: "GET"
        })
        const json = await response.json().then((value)=>{
            userFeedData.current = value;
            console.log("loadFeed");
            setLoadStatus("toLoadProfileImage");       
        });
        // setFeedData(json);
    }
    useEffect(() => {
        loadFeedData();
    },[])
    return(
        <></>
    )
}

interface MainPageProps {
    userInfoData: React.MutableRefObject<any>;
    profileImageData: React.MutableRefObject<any>;
}

function MainPage({userInfoData, profileImageData}:MainPageProps) {
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);

    const [loadStatus, setLoadStatus] = useState<string>("toLoadUserInfo");

    
    const userFeedData = useRef<any>();

    const feedProfileImageData = useRef<any>({user_id:"path"});
    const [feedProfileImageLoadStatus,setFeedProfileImageLoadStatus] = useState<string>("toLoadFeedProfileImage");


    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }

    const session = sessionStorage;

    const location = useLocation();

    useEffect(() => {
        session.page = location.pathname;
    })


    return (
        <>  
            {(()=>{
                switch(loadStatus) {
                    case "toLoadUserInfo":
                        return <LoadUser setLoadStatus={setLoadStatus} userInfoData={userInfoData}/>;
                    case "toLoadUserFeed":
                        return <LoadUserFeed setLoadStatus={setLoadStatus} userFeedData={userFeedData}/>
                    case "toLoadProfileImage":
                        return <LoadProfileImg url = {Urls.readProfileImg} user_id = {session.user_id} setLoadStatus={setLoadStatus} profileImageData={profileImageData}/>
                    case "loadingFinished":
                        return(
                            <>
                            {Object.keys(feedProfileImageData.current).length === 1 ? 
                            userFeedData.current.user_id_array.map((e:string)=> {
                                return (<LoadProfileImg url = {Urls.readProfileImg} user_id = {e} setFeedProfileImageLoadStatus={setFeedProfileImageLoadStatus} feedProfileImageData={feedProfileImageData} userFeedData={userFeedData}/>)
                            }
                            )
                             : null}
                            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} userInfoData={userInfoData} user_id={session.user_id} profileImageData={profileImageData}/>
                            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                                <Nav onClick = {sidebarMove}/>
                                <div className = {styles.bodyWrapper}>
                                    <div className={styles.jumbotron}> </div>
                                    {userFeedData.current === undefined || userFeedData.current.data === 'empty' ? 
                                        <div className= {styles.feed_area}>
                                            <div className = {styles.noFeed}>
                                                아직 우리 가족 피드가 없어요!<br/>새로운 피드를 추가해보세요!
                                            </div>
                                        </div>
                                        :
                                        <div className = {styles.feed_area} id ={styles.notEmpty}>
                                            {userFeedData.current.data.map((feedData: any, idx: any) => (
                                            <React.Fragment key = {idx}>
                                                <Feed feedData={feedData} profileImageData={profileImageData} feedProfileImageData={feedProfileImageData} feedProfileImageLoadStatus={feedProfileImageLoadStatus}/>
                                            </React.Fragment>
                                        ))
                                            }
                                        </div>   
                                        }
                                </div>
                            </>
                                )
                            }
            })()}
            {/* // before loading userInfo, not loading the page content */}
            {/* {loadStatus == "toLoadUserInfo" ? <LoadUser setLoadStatus={setLoadStatus} userInfoData={userInfoData}/> : */}
            {/* <>  */}
            {/* {loadStatus === undefined ? <LoadUserFeed setFeedData={setFeedData}/> : null} */}
            {/* {profileImageData === undefined ? <LoadProfileImg url = {Urls.readProfileImg} user_id = {session.user_id} loadProfileData={loadProfileData}/> : null} */}
            {/* <Sidebar onClick = {sidebarMove} visible={visibleSidebar} userInfoData={userInfoData}user_id={session.user_id} profileImageData={profileImageData}/>
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
            </> */}
            <Outlet/>
        </>
    )
}

export default MainPage;