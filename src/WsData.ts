import axios, { AxiosRequestConfig } from 'axios';
import {Promise} from 'es6-promise';

class DataService{
    
    getData<T>(url:string, config:AxiosRequestConfig):Promise<T>{
        
        const promise = new Promise<T>((resolve,reject)=>{

            axios.get<T>(url,config)
            .then((value) =>{
                value.data ? resolve(value.data) : reject("no data found");
            },
            (reason:any)=>{
                reject(reason);
            });

        });

        return promise;
    }
    

}

export default new DataService();