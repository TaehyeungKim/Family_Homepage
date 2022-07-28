import styles from './FeedPhotoIndex.module.scss'

interface FeedPhotoIndex {
    feedData:any;
    photoShownIndex:number;
}

function FeedPhotoIndex({feedData, photoShownIndex}:FeedPhotoIndex) {
    return(
        <>
        <div className = {styles.photoIndex}>
            {feedData.photo_path.split(',').map((i:string)=>{
                return (
                <div className = {styles.dotContainer}>
                    <svg viewBox="-50 -50 100 100">
                        <circle r="20" id = {feedData.photo_path.split(',').indexOf(i) === photoShownIndex ? styles.filled : styles.notFilled}></circle>
                    </svg>
                </div>)
            })}
        </div></>
    )
}

export default FeedPhotoIndex;