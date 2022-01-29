import {useState, useEffect} from 'react';
import styles from './DeleteAlert.module.scss';
import Urls from '../../utils/Url'

interface DeleteFeedAlertProps {
    deleteFeed:(url: string, user_id: string, feed_id: string, photo_type: string) => void;
    alertVisible: boolean,
    hideAlert:()=>void,
    feedData: any,
    message: string
}

function DeleteFeedAlert({deleteFeed, alertVisible, hideAlert, feedData, message}:DeleteFeedAlertProps) {

    const [waitPopupVisible, setWaitPopupVisible] = useState<boolean>(false);

    const url = Urls.deleteFeed;


    return(
        <>
            <div className = {styles.deleteAlert} id={alertVisible === true ? styles.alertVisible : styles.alertNotVisible}>
                {waitPopupVisible === true ?
                <div className = {styles.waitPopupBackground}> 
                    <div className = {styles.waitPopup}>
                        <p>피드를 삭제중입니다.<br/>잠시만 기다려주세요.</p>
                    </div>
                </div> : null}
                <div className = {styles.alertContainer}>
                    <p>{message}</p>
                    <div className = {styles.buttonContainer}>
                        <button id = {styles.yes} onClick={()=>{
                            deleteFeed(url, feedData.user_id, feedData.feed_id, feedData.photo_type);
                            setWaitPopupVisible(true);
                        }}>Yes</button>
                        <button id = {styles.no} onClick={hideAlert}>No</button>
                    </div>
                </div>
            </div>
        </>
    )
}

interface DeleteCommentAlertProps {
    em: any,
    feedData: any,
    alertVisible: boolean,
    hideAlert:()=>void,
    message: string,
    showComment: (feed_id: number, feed_user: string) => void,
    commentIsUpdated: () => void
}

function DeleteCommentAlert({em, feedData, alertVisible, hideAlert, message, showComment, commentIsUpdated}:DeleteCommentAlertProps) {
    const [waitPopupVisible, setWaitPopupVisible] = useState<boolean>(false);

    const deleteComment = async (feed_user: string, feed_id: number, comment_id: number) => {
        const data = new FormData();
        const url = Urls.deleteComment;
        data.append('feed_user', feed_user);
        data.append('comment_id', comment_id.toString());
        data.append('feed_id', feed_id.toString());
        const response = await fetch(url, {
            method: "POST",
            body: data
        })
        const text= await response.text()
        .then((value)=>{
            showComment(feed_id, feed_user)
            commentIsUpdated()
            hideAlert()});
    }

    useEffect(()=>{
        return ()=>{
            setWaitPopupVisible(false);
        }
    },[waitPopupVisible]);

    return(
        <>
        <div className = {styles.deleteAlert} id={alertVisible === true ? styles.alertVisible : styles.alertNotVisible}>
                {waitPopupVisible === true ?
                    <div className = {styles.waitPopupBackground}> 
                        <div className = {styles.waitPopup}>
                            <p>댓글을 삭제중입니다.<br/>잠시만 기다려주세요.</p>
                        </div>
                    </div> : null}
                <div className = {styles.alertContainer}>
                    <p>{message}</p>
                    <div className = {styles.buttonContainer}>
                        <button id = {styles.yes} onClick={()=>{
                            deleteComment(feedData.user_id, em.feed_id, em.comment_id);
                            setWaitPopupVisible(true);
                        }}>Yes</button>
                        <button id = {styles.no} onClick={hideAlert}>No</button>
                    </div>
                </div>
        </div>
        </>
    )
}

export {DeleteFeedAlert, DeleteCommentAlert};