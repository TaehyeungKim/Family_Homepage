import React, {useState, useContext} from 'react';
import styles from './FeedCommentShow.module.scss'
import {DeleteCommentAlert} from '../../DeleteAlert/DeleteAlert'

import {HandlerContext} from '../../../App'


interface FeedCommentLineProps {
    em: any,
    feedData: any,
    showComment: (feed_id: number, feed_user: string) => void,
    commentIsUpdated: () => void
}

function FeedCommentLine({em, feedData, showComment, commentIsUpdated}:FeedCommentLineProps) {

    const context = useContext(HandlerContext)

    const [alertVisible, setAlertVisible] = useState<boolean>(false);

    const showAlert = () => {
        setAlertVisible(true);
    }

    const hideAlert = () => {
        setAlertVisible(false);
    }

    return(
        <>
            <DeleteCommentAlert em={em} feedData={feedData} alertVisible={alertVisible} hideAlert={hideAlert} message={"댓글을 지우시겠습니까?"}
                showComment={showComment} commentIsUpdated={commentIsUpdated}/>
            <div className = {styles.commentLine}>
                <div className = {styles.nameAndComment}>
                    <span>{em.comment_user}</span>
                    {em.comment}
                </div> 
                {em.comment_user === context.getLoginUser('user_id') ? 
                <div className = {styles.buttonContainer}>
                    <button onClick={showAlert}>삭제</button>
                </div>
                :
                null}
            </div>
        </>
    )
}

interface FeedCommentShowProps {
    feedData: any,
    commentShown: boolean,
    commentData: any,
    showComment: (feed_id: number, feed_user: string) => void;
    commentIsUpdated: () => void
}

function FeedCommentShow({feedData, commentShown, commentData, showComment, commentIsUpdated}: FeedCommentShowProps) {

    return(
        <>

            {commentShown === false ? null 
                    : 
                    commentData.data.map((em: any, idx: any) =>(
                        <React.Fragment key = {idx}>
                            <FeedCommentLine em = {em} feedData={feedData} showComment={showComment} commentIsUpdated={commentIsUpdated}/>
                        </React.Fragment>
            ))}
        </>
    )

}

export default FeedCommentShow;