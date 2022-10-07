import Urls from "./Url";

let intervalId: any;

const extendSession = async() =>{
    try {
        await fetch(Urls.sessionExtend, {
            method: "GET"
        }).then((value)=>{
          console.log(value);  
        })
    } catch(e) {console.log(e)}
}

export const setSessionInterval = (t:number) => {
    if(!intervalId) {
        intervalId = setInterval(extendSession, t);
        window.addEventListener("unload",()=>{
            clearSessionInterval();
        })   
    }
}

export const clearSessionInterval = () => {
    if(intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}
