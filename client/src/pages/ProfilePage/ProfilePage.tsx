import {useState, useRef, useEffect, useContext} from 'react'
import { useLocation } from 'react-router-dom';
import styles from './ProfilePage.module.scss'
import Nav from '../../components/Nav/Nav'
import Sidebar from '../../components/Sidebar/Sidebar';
import defaultImg from '../../images/default.jpg';
import Urls from '../../utils/Url';

import {HandlerContext} from '../../App'

import LoadUser from '../../components/LoadUser/LoadUser'
import {LoadProfileImg} from '../../components/LoadProfileImg/LoadProfileImg'

interface ProfilePageDescAreaProps {
    jsonData: any;
}


function ProfilePageDescArea({jsonData}:ProfilePageDescAreaProps) {
    const [lineNumber, setLineNumber] = useState<number>(jsonData.desc.length);
    const [changedOccured, setChangeOccured] = useState<boolean>(false);

    useEffect(()=>{
        setChangeOccured(true);
    },[])

    return(
        <section>
            <ul>
                {(()=>{
                    let lines = []
                    switch (lineNumber) {
                        case 0:
                            lines.push(
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label id = {styles.descLabel} htmlFor = {`desc${1}`}>한 줄 소개1</label>
                                    <input name = {`desc${1}`} id={`desc${1}`} placeholder = '소개를 입력하세요'></input>
                                    </div>
                                    <div className = {styles.descAddDelete}>
                                    <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber+2);
                                    }}>줄 추가</button></div>   
                                </li>)
                            break;
                        default:
                            for (let i = 0; i <= lineNumber-1; i++) {
                                lines.push(
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label id = {styles.descLabel} htmlFor={`desc${i+1}`}>{`한 줄 소개${i+1}`}</label>
                                    <input name = {`desc${i+1}`} id={`desc${i+1}`} defaultValue = { jsonData.desc.length === 0 || changedOccured === true ? null : 
                                        i+1 <= jsonData.desc.length ? jsonData.desc[i] : null} placeholder = '소개를 입력하세요'></input>
                                    </div>
                                    <div className = {styles.descAddDelete}>
                                    {i === lineNumber -1 && i !== 4 ? <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber+1);
                                    }}>줄 추가</button> : null}
                                    {i === lineNumber - 1 && i !==0 ? <button className = {styles.descButton} onClick = {(event)=>{
                                        event.preventDefault();
                                        setLineNumber(lineNumber-1);
                                    }}>줄 삭제</button> : null}
                                    </div>    
                                </li>)
                            }
                            break;
                    }
                    return lines
                })()}
            </ul>
        </section>
    )
}

function ProfilePage() {
    const session = sessionStorage;
    const location = useLocation();
    const [changedProfileImgPreview, setChangedProfileImgPreview] = useState<any>(null);
    const [profilePageLoadingStatus, setProfilePageLoadingStatus] = useState<string>("toLoadUser");
    const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
    
    const changeProfile = useRef<HTMLInputElement>(null);
    const context = useContext(HandlerContext)


    const sidebarMove = () => {
        setVisibleSidebar(!visibleSidebar)
    }


    useEffect(()=>{
        session.page = location.pathname;
    })


    return(
        <>
        {context.getLoginUser('user_id') === undefined || context.getLoginUser('image') === undefined? 
        (()=>{
            switch(profilePageLoadingStatus) {
                case "toLoadUser":
                    console.log('load user');
                    return <LoadUser setLoadStatus={setProfilePageLoadingStatus}/>
                case "toLoadUserFeed":
                    console.log('load user feed');
                    setProfilePageLoadingStatus("toLoadProfileImage");
                    break;
                case "toLoadProfileImage":
                    console.log('load profile image');
                    return <LoadProfileImg url={Urls.readProfileImg} user_id={context.getLoginUser('user_id')} target={"profileImageData"} setLoadStatus={setProfilePageLoadingStatus}/>
            }
        })()
        :
        <>
        <div className = {styles.frame}>
            <Sidebar onClick = {sidebarMove} visible={visibleSidebar}/>
            <div id={styles.deactivate} style = {visibleSidebar === true ? {display: 'block'}:{display: 'none'}}></div>
            <Nav onClick={sidebarMove}/>
            <form method='post' action = {Urls.profileChange} encType='multipart/form-data'>
            <div className = {styles.profileCard}>
                <div className = {styles.header}>
                    내 프로필
                </div>
                <div className = {styles.body}>
                    <div className = {styles.profileImageAndId}>
                        <div className = {styles.imageContainer}>
                            {!changedProfileImgPreview ? 
                                context.getLoginUser('image') === undefined ? null : <img src = {context.getLoginUser('image').src} id = {context.getLoginUser('image').height > context.getLoginUser('image').width ? styles.toWidth : styles.toHeight} alt = 'profile'/>
                            :
                            
                            !changedProfileImgPreview.default ?
                            <img src = {changedProfileImgPreview.src} id = {changedProfileImgPreview.height > changedProfileImgPreview.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>
                            :
                            <img src = {changedProfileImgPreview.src} id = {changedProfileImgPreview.src.height > changedProfileImgPreview.src.width ? styles.toWidth : styles.toHeight} alt = 'profile'/>}
                        </div>
                        <div className = {styles.profileChange}>
                            <button onClick = {(event) => {
                                event.preventDefault();
                                changeProfile.current?.click();
                            }}>프로필 사진 바꾸기</button>

                            <input type = 'file' hidden ref = {changeProfile} accept = 'image/*' name="profile_image" onChange = {(event) => {
                                const file = event.target.files?.item(0);
                                if (file) {
                                    const reader = new FileReader();
                                    reader.readAsDataURL(file);
                                    reader.onloadend = () => {
                                        const prevImage = new Image();
                                        prevImage.src = reader.result as string
                                        prevImage.onload = () => {
                                            setChangedProfileImgPreview({src: prevImage.src, height: prevImage.height, width: prevImage.width, default:false})
                                        }
                                    }
                                }
                            }}/>
                            <button onClick = {(e)=>{
                                e.preventDefault();
                                setChangedProfileImgPreview({src: defaultImg, default: true});
                            }}>기본 이미지로 바꾸기</button>
                        </div>
                        
                        <div className = {styles.idContainer}>
                            <input name = 'user_id' value = {context.getLoginUser('user_id')} readOnly/>
                        </div>
                    </div>
                    <div className = {styles.userInfo}>
                        <section>
                            <ul>
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label htmlFor='user_name'>이름</label>
                                    <input type='text' name = 'user_name' id='user_name' defaultValue = {context.getLoginUser('user_name')} placeholder = '이름을 입력하세요'></input>
                                    </div>
                                </li>
                                <li>
                                    <div className = {styles.labelAndInput}>
                                    <label htmlFor='user_status'>지위</label>
                                    <input type='text' name = 'user_status' id='user_status' defaultValue = {context.getLoginUser('user_status')} placeholder = '가족 내 지위를 입력하세요'></input>
                                    </div>
                                </li>
                            </ul>
                        </section>
                        <ProfilePageDescArea jsonData={context.getLoginUser()}/>
                    </div>
                </div>
                <div className = {styles.footer}>
                    <div className = {styles.submitButtonContainer}>
                        <button type = 'submit' name = {changedProfileImgPreview?.default ? 'default' : 'NotDefault'} id = {styles.submitButton} onClick = {
                            ()=>{session.user_id = context.getLoginUser('user_id')}
                        }>저장하기</button>
                    </div>
                </div>
            </div>
            </form>
        </div>
        </>
        }
        </>
    )
}

export default ProfilePage;