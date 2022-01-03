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
    
    // function redirToLogin() {
    //     location.replace('./login/login.html')
    // }

    
    return (
        <>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar}/>
            <Nav onClick = {sidebarMove}/>
            <div className = {styles.frame}>
                <div className={styles.jumbotron}> </div>
                <div className= {styles.feed_area}>
                    <Feed/>
                </div>
            </div>

            
        </>
    )
}

export default MainPage;