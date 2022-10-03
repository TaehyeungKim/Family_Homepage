import {useState, useEffect, useRef, useContext} from 'react';
import { LoadProfileImg } from '../LoadProfileImg/LoadProfileImg';
import styles from './Description.module.scss'
import Urls from '../../utils/Url';
import {HandlerContext} from '../../App'

interface SubmitDescProps {
    setDescription: (desc: string) => void;
    description: string;
}

function SubmitDesc({setDescription, description}:SubmitDescProps) {
    useEffect(() => {
        setDescription(description);
    })
    return(
        <></>
    )
}

interface DescriptionProps {
    status: string;
    setDescription: (description: string) => void;
    fetchData: boolean;
}

function Description({status, setDescription, fetchData}:DescriptionProps) {
    
    const session = sessionStorage;
    const descArea = useRef<HTMLTextAreaElement>(null);
    const context = useContext(HandlerContext)

    useEffect(()=>{
        if(status === 'beforeUploadImage') {
            session.desc = '';
        }
        if(status === 'beforeUploadImage' || status === 'imagePreview') {
            if(descArea.current !== null) {
                descArea.current.value = ''
            }  
        }
    },[status])
    return(
        <>
        <div className = {styles.frame} id = {status === 'write' ? styles.frameAtDescription : styles.frameBeforeDescription}>
            <div className = {styles.profile}>
                <div className = {styles.imageContainer}>
                    {context.getLoginUser('image') === undefined ? null : <img src = {context.getLoginUser('image').src} id = {context.getLoginUser('image').height > context.getLoginUser('image').width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                </div>
                <div className = {styles.name}>
                    <input name = 'user_id' defaultValue={context.getLoginUser('user_id')} disabled/>
                </div>
            </div>
            <div className = {styles.descContainer} id = {status === 'write' ? styles.descWidthAtDescription: styles.descWidthBeforeDescription}>
                <textarea placeholder='문구 입력...' name = 'desc' onChange={(event) => {
                    session.desc = event.target.value;
                }
                } ref={descArea}/>
            </div>
        </div>
        {fetchData === true ? <SubmitDesc setDescription={setDescription} description={session.desc}/> : null}
        </>
    )
}

export default Description;