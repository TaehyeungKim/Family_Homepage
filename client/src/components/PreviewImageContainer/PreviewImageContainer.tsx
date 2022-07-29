import React, {useState, useEffect, useRef} from 'react'
import styles from './PreviewImageContainer.module.scss'
import './previewTransition.css'


interface PreviewImageContainerProps {
    previewImage: any,
    status: string,
    previewShownIndex: number,
    setPreviewShownIndex:(index:number)=>void;
    isMobile:boolean;
    touchOffsetX: number;
    setTouchOffsetx: (offset: number) => void;
    touchStatus: string;
    setTouchStatus:(status:string)=>void;
    touchStartMs:number
}

function PreviewImageContainer({previewImage, status, previewShownIndex, setPreviewShownIndex, isMobile, touchOffsetX, setTouchOffsetx, touchStatus, setTouchStatus, touchStartMs}:PreviewImageContainerProps) {

    return(
    <div className={styles.imageContainer}>
        {previewImage.current.map((i:any) => {
            return(<PreviewImage i={i} key={i.index} previewShownIndex={previewShownIndex} setPreviewShownIndex={setPreviewShownIndex} isMobile={isMobile} touchOffsetX={touchOffsetX} setTouchOffsetX={setTouchOffsetx} touchStatus={touchStatus} setTouchStatus={setTouchStatus} numberOfPreviewPhotos={previewImage.current.length} touchStartMs={touchStartMs}/>)
            }
        )}
    </div>
    )
}

interface PreviewImageProps {
    i: any,
    previewShownIndex: number;
    setPreviewShownIndex:(index:number)=>void;
    isMobile: boolean;
    touchOffsetX: number;
    setTouchOffsetX:(offset:number)=>void;
    touchStatus:string;
    setTouchStatus:(status:string) => void;
    numberOfPreviewPhotos: number;
    touchStartMs:number
}

function PreviewImage({i, previewShownIndex, setPreviewShownIndex, isMobile, touchOffsetX, setTouchOffsetX, touchStatus, setTouchStatus, numberOfPreviewPhotos, touchStartMs}:PreviewImageProps) {

    const previewImageFrame = useRef<HTMLDivElement>(null);
    const previewShownIndexBefore = useRef<number>(0);
    const touchStartX = useRef<number>(0);
    
    useEffect(()=>{
        previewImageFrame.current?.classList.replace(`preview_index_${previewShownIndexBefore.current}`,`preview_index_${previewShownIndex}`)
        previewShownIndexBefore.current = previewShownIndex;
    },[previewShownIndex])

    useEffect(()=>{
        previewImageFrame.current?.classList.add('preview_index_0')
    },[])

    useEffect(()=>{
        if(previewImageFrame.current !== null) {
            if(isMobile) {
                previewImageFrame.current.addEventListener('touchstart', (e) => {
                    setTouchStatus('start')
                    touchStartX.current = e.targetTouches[0].clientX
                })
                previewImageFrame.current.addEventListener('touchmove',(e)=> {
                    setTouchStatus('moving')
                    //why is previewShonwIndex '0' for all time?

                    switch(previewShownIndexBefore.current) {
                        case 0:
                            if(e.targetTouches[0].clientX - touchStartX.current < 0) {
                                setTouchOffsetX(e.targetTouches[0].clientX - touchStartX.current)
                            }
                            break;
                        case numberOfPreviewPhotos-1:
                            if(e.targetTouches[0].clientX - touchStartX.current > 0) {
                                setTouchOffsetX(e.targetTouches[0].clientX - touchStartX.current)
                            }
                            break;
                        default:
                            setTouchOffsetX(e.targetTouches[0].clientX - touchStartX.current);
                    }
                    
                })
                previewImageFrame.current.addEventListener('touchend', ()=>{
                    setTouchStatus('end')
                    setTouchOffsetX(0);
                })
            }
        }
    },[isMobile])

    useEffect(()=>{
        if(previewImageFrame.current !== null && touchStatus === 'moving') {
            previewImageFrame.current!.style.transitionDuration='0ms'
            previewImageFrame.current!.style.transform = `translateX(${-(previewShownIndex*100)+(touchOffsetX/previewImageFrame.current!.offsetWidth)*100}%)`
        }
    },[touchOffsetX])

    useEffect(()=>{
        if(previewImageFrame.current !== null && touchStatus === 'end') {
            console.log(Math.abs(touchOffsetX/(Date.now() - touchStartMs)))
            previewImageFrame.current.style.transitionDuration=''
            previewImageFrame.current.style.transform = ''
            if(Math.abs(touchOffsetX/(Date.now() - touchStartMs)) > 0.11) {
                if(touchOffsetX < 0) {
                    setPreviewShownIndex(previewShownIndex+1)
                }
                else if(touchOffsetX > 0) {
                    setPreviewShownIndex(previewShownIndex-1)
                }
            } else {
                setPreviewShownIndex(previewShownIndex - Math.round(touchOffsetX/previewImageFrame.current.offsetWidth))
            }
            touchStartX.current = 0;
        }
    },[touchStatus])

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