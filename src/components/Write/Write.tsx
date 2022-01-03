import React from 'react'
import styles from './Write.module.scss'
import PhotoSelect from '../PhotoSelect/PhotoSelect';


function Write() {
    return(
        <>
                <div className = {styles.container}>
                    <PhotoSelect/>
                </div>

            
        </>
    )
}

export default Write;