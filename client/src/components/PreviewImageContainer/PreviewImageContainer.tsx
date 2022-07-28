import React, {useState, useEffect, useRef} from 'react'
import styles from './PreviewImageContainer.module.scss'
import './previewTransition.css'

interface PreviewImageContainerProps {
    previewImage: any,
    status: string,
    previewShownIndex: number
}

function PreviewImageContainer({previewImage, status, previewShownIndex}:PreviewImageContainerProps) {

    return(
    <div className={styles.imageContainer}>
        {previewImage.current.map((i:any) => {
            return(<PreviewImage i={i} key={i.index} previewShownIndex={previewShownIndex}/>)
            }
        )}
    </div>
    )
}

interface PreviewImageProps {
    i: any,
    previewShownIndex: number;
}

function PreviewImage({i, previewShownIndex}:PreviewImageProps) {

    const previewImageFrame = useRef<HTMLDivElement>(null);
    const previewShownIndexBefore = useRef<number>(0);

    useEffect(()=>{
        previewImageFrame.current?.classList.replace(`index_${previewShownIndexBefore.current}`,`index_${previewShownIndex}`)
        previewShownIndexBefore.current = previewShownIndex;
    },[previewShownIndex])

    useEffect(()=>{
        previewImageFrame.current?.classList.add('index_0')
    },[])
    return(
        <>
        <div className = {styles.imageFrame} ref = {previewImageFrame}>
            <div className = {styles.flexWrapper}>
                <img src={i.src} alt = 'preview' id = {i.height > i.width ? styles.fitHeight : styles.fitWidth}/>
            </div>
        </div>  
        </>
    )
}

export default PreviewImageContainer;