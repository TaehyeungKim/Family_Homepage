import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import styles from './MainPage.module.scss'
import {Outlet, Navigate, useLocation} from 'react-router-dom'
import { LoadProfileImg } from '../../components/LoadProfileImg/LoadProfileImg';
import LoadUser from '../../components/LoadUser/LoadUser';

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';

import Urls from '../../utils/Url';

import  {HandlerContext} from '../../App'




interface LoadUserFeedProps {
    setLoadStatus:(status:string) => void;
}

function LoadUserFeed({setLoadStatus}:LoadUserFeedProps) {
    const feedUrl = Urls.loadFeed;
    const context = useContext(HandlerContext)

    const loadFeedData = async() => {
        try {
            const response = await fetch(feedUrl, {
                method: "GET"
            })
            await response.json().then((value)=>{
            context.setFeedData(value);
            setLoadStatus("toLoadProfileImage");       
            });
        } catch(e) {console.log(e)}
    }
    useEffect(() => {
        loadFeedData();
    },[])
    return(
        <></>
    )
}


function MainPage() {
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);

    const [loadStatus, setLoadStatus] = useState<string>("toLoadUserInfo");

    const context = useContext(HandlerContext)

    const bodyRef = useRef<HTMLDivElement>(null)

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
                        return <LoadUser setLoadStatus={setLoadStatus}/>;
                    case "toLoadUserFeed":
                        return <LoadUserFeed setLoadStatus={setLoadStatus}/>
                    case "toLoadProfileImage":
                        return <LoadProfileImg url = {Urls.readProfileImg} user_id = {context.getLoginUser('user_id')} target = {'profileImageData'} setLoadStatus={setLoadStatus}/>
                    case "loadingFinished":
                        return(
                            <>
                            { !bodyRef.current ? 
                            context.getFeedData('user_id_array').map((e:string, idx:number)=> {
                                return (<LoadProfileImg url = {Urls.readProfileImg} user_id = {e} setFeedProfileImageLoadStatus={setFeedProfileImageLoadStatus} idx={idx} target={'feedProfileImageData'}/>)
                            }
                            )
                             : null}
                            <Sidebar onClick = {sidebarMove} visible={visibleSidebar}/>
                            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                                <Nav onClick = {sidebarMove}/>
                                <main className = {styles.bodyWrapper} ref={bodyRef}>
                                    {context.getFeedData('data') === 'empty' ? 
                                        <section className= {styles.feed_area}>
                                            <div className = {styles.noFeed}>
                                                아직 우리 가족 피드가 없어요!<br/>새로운 피드를 추가해보세요!
                                            </div>
                                        </section>
                                        :
                                        <>
                                        <section className = {styles.feed_area}>
                                            {context.getFeedData('data').map((feedData: any, idx: number) => (
                                            <React.Fragment key = {idx}>
                                                <Feed feedData={feedData} feedProfileImageLoadStatus={feedProfileImageLoadStatus} idx={idx}/>
                                            </React.Fragment>
                                        ))
                                            }
                                        </section>
                                        <section className = {styles.showLoginedUserArea}>
                                        
                                        </section> 
                                        </>
                                    
                                        }
                                </main>
                            </>
                                )
                            }
            })()}
            <Outlet/>
        </>
    )
}

export default MainPage;