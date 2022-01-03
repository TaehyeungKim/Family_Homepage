import React, {useState} from 'react'
import styles from './Write.module.scss'
import PhotoSelect from '../PhotoSelect/PhotoSelect';
import Description from '../Description/Description';


function Write() {

    const [status, setStatus] = useState<string>('uploadImage');
    const moveToWrite = () => {
        setStatus('write')
    }
    const backToImageSelect = () => {
        setStatus('uploadImage')
    }

    return(
        <>
            <div className = {styles.container} id = {status === 'write' ? styles.containerWrite : styles.containerSelect}>
                <PhotoSelect next={moveToWrite} back={backToImageSelect} status={status}/>
                <Description status={status}/>
            </div>

            
        </>
    )
}

export default Write;