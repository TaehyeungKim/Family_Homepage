import React, { useState } from 'react';
import styles from './MainPage.module.scss'

import Sidebar from '../../components/Sidebar/Sidebar'
import Nav from '../../components/Nav/Nav'
import Feed from '../../components/Feed/Feed';

function MainPage() {
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);

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

    return (
        <>
            <div className = {styles.frame} onLoad={() => {
                loadUserInfo(url, data)
            }}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar} user_id={session.user_id} user_name={session.user_name} user_status={session.user_status}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
                <Nav onClick = {sidebarMove}/>
                <div className={styles.jumbotron}> </div>
                <div className= {styles.feed_area}>
                    <Feed/>
                </div>
            </div>
        </>
    )
}

export default MainPage;