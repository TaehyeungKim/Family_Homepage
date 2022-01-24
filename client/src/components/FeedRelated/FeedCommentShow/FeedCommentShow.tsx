import {useState} from 'react';
import styles from './FeedCommentShow.module.scss'
import {DeleteCommentAlert} from '../../DeleteAlert/DeleteAlert'

interface FeedCommentShowProps {
    feedData: any,
    commentShown: boolean,
    commentData: any,
    showComment: (feed_id: number, feed_user: string) => void;
    commentIsUpdated: () => void
}

function FeedCommentShow({feedData, commentShown, commentData, showComment, commentIsUpdated}: FeedCommentShowProps) {

    const session = sessionStorage;

    const [alertVisible, setAlertVisible] = useState<boolean>(false);

    const showAlert = () => {
        setAlertVisible(true);
    }

    const hideAlert = () => {
        setAlertVisible(false);
    }
    return(
        <>

            {commentShown === false ? null 
                    : 
                    commentData.data.map((em: any) =>(
                        <>
                        <DeleteCommentAlert em={em} feedData={feedData} alertVisible={alertVisible} hideAlert={hideAlert} message={"댓글을 지우시겠습니까?"}
                            showComment={showComment} commentIsUpdated={commentIsUpdated}/>
                        <div className = {styles.commentLine}>
                            <div className = {styles.nameAndComment}>
                                <span>{em.comment_user}</span>
                                {em.comment}
                            </div> 
                            {em.comment_user === session.user_id ? 
                            <div className = {styles.buttonContainer}>
                            <button onClick={showAlert}>삭제</button>
                            </div>
                            :
                            null}
                        </div>
                        </>
            ))}
        </>
    )

}

export default FeedCommentShow;