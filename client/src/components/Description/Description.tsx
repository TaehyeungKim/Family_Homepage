import React,{useEffect} from 'react';
import styles from './Description.module.scss'

interface SubmitDescProps {
    setDescription: (desc: string) => void;
    desc: string;
}

function SubmitDesc({setDescription, desc}:SubmitDescProps) {
    useEffect(() => {
        setDescription(desc);
    })
    return(
        <></>
    )
}

interface DescriptionProps {
    status: string;
    setDescription: (desc: string) => void;
    fetchData: boolean;
}

function Description({status, setDescription, fetchData}:DescriptionProps) {
    const session = sessionStorage;
    return(
        <>
        <div className = {styles.frame} id = {status === 'write' ? styles.frameWidthAtDescription : styles.frameWidthBeforeDescription}>
            <div className = {styles.profile}>
                <div className = {styles.imageContainer}>
                    <img src = {`http://localhost:8080/family-homepage/server/readProfileImg.php?user_id=${session.user_id}`} alt = 'profile'/>
                </div>
                <div className = {styles.name}>
                    <input name = 'user_id' defaultValue={session.user_id} disabled/>
                </div>
            </div>
            <div className = {styles.descContainer} id = {status === 'write' ? styles.descWidthAtDescription: styles.descWidthBeforeDescription}>
                <textarea placeholder='문구 입력...' name = 'desc' onChange={(event) => {
                    session.desc = event.target.value;
                }
                }/>
            </div>
        </div>
        {fetchData === true ? <SubmitDesc setDescription={setDescription} desc={session.desc}/> : null}
        </>
    )
}

export default Description;