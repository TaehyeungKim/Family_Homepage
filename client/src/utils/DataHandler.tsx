export class DataHandler {

    private loginUser: any;
    private feedData: any;
    private feedProfileImageData: any;

    constructor() {
        this.loginUser = {}
        this.feedData = {}
        this.feedProfileImageData = {}
        console.log('handler created');
    }

    getter(target:any, key?:string) {
        if (key) {
            return target[key]
        }
        return target
    }

    setter(target: any, data: any, key?:string) {
        if (key) {
            Object.defineProperty(target, key, {
                value:data,
                configurable:true,
                enumerable: true})
        } else {
            Object.keys(data).forEach((key)=>{
                Object.defineProperty(target, key, {
                    value:data[key],
                    configurable: true,
                    enumerable: true})
            })
        }
    }

    getLoginUser(key?:string) {
        return this.getter(this.loginUser, key);
    }

    setLoginUser(data:any, key?:string) {
        this.setter(this.loginUser, data, key);
    }

    getFeedData(key?:string) {
        return this.getter(this.feedData, key)
    }

    setFeedData(data:any, key?:string) {
        this.setter(this.feedData, data, key);
    }

    getFeedProfileImageData(key?:string) {
        return this.getter(this.feedProfileImageData, key)
    }

    setFeedProfileImageData(data:any, key?:string) {
        this.setter(this.feedProfileImageData,data,key);
    }
}