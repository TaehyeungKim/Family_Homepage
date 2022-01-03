import React from 'react'
import styles from './Write.module.scss'
import camera from '../../images/camera_icon.png'

function Write() {
    return(
        <>
                <div className = {styles.container}>
                    <div className = {styles.header}>새 게시물 만들기</div>
                    <div className = {styles.body}>
                        <div className = {styles.cameraContainer}>
                            <img src = {camera} alt = 'camera'/>
                        </div>
                        <div className = {styles.chooseButtonContainer}>
                            <button className = {styles.chooseButton}>사진 선택하기</button>
                        </div>
                    </div>
                    
                </div>

            
        </>
    )
}

export default Write;