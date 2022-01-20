import React from 'react';
import styles from './FeedCommentShow.module.scss'

interface FeedCommentShowProps {
    feedData: any,
    commentShown: boolean,
    commentData: any,
    showComment: (feed_id: number, feed_user: string) => void;
    commentIsUpdated: () => void
}

function FeedCommentShow({feedData, commentShown, commentData, showComment, commentIsUpdated}: FeedCommentShowProps) {

    const deleteComment = async (created_at: string, comment_user: string, feed_user: string, feed_id: number) => {
        const data = new FormData();
        const url = "http://localhost:8080/family-homepage/server/deleteComment.php";
        data.append('created_at', created_at);
        data.append('comment_user', comment_user);
        data.append('feed_user', feed_user);
        data.append('feed_id', feed_id.toString());
        const response = await fetch(url, {
            method: "POST",
            body: data
        })
        const text= await response.text()
        .then((value)=>{
            showComment(feed_id, feed_user)
            commentIsUpdated()});
    }

    const session = sessionStorage;
    return(
        <>
            {commentShown === false ? null 
                    : 
                    commentData.data.map((em: any) =>(
                        <div className = {styles.commentLine}>
                            <div className = {styles.nameAndComment}>
                                <span>{em.comment_user}</span>
                                {em.comment}
                            </div> 
                            {em.comment_user === session.user_id ? 
                            <div className = {styles.buttonContainer}>
                            <button onClick={()=> {
                                deleteComment(em.created_at, em.comment_user, feedData.user_id, em.feed_id);
                            }}>삭제
                            </button>
                            </div>
                            :
                            null}
                        </div>
            ))}
        </>
    )

}

export default FeedCommentShow;