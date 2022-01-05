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
    

    return (
        <>
            <div className = {styles.frame}>
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