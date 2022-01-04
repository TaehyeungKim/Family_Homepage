import React from 'react';
import styles from './Description.module.scss'


interface DescriptionProps {
    status: string;
}

function Description({status}:DescriptionProps) {
    return(
        <>
        <div className = {styles.frame} id = {status === 'write' ? styles.frameWidthAtDescription : styles.frameWidthBeforeDescription}>
            <div className = {styles.profile}>
                <div className = {styles.imageContainer}>

                </div>
                <div className = {styles.name}>
                    taehyeungkim98
                </div>
            </div>
            <div className = {styles.descContainer} id = {status === 'write' ? styles.descWidthAtDescription: styles.descWidthBeforeDescription}>
                <textarea placeholder='문구 입력...'/>
            </div>
            

        </div>
        </>
    )
}

export default Description;