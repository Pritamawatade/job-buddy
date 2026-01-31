import axios from "axios";
import { env } from "../config/env";

export const http = axios.create({
    baseURL: env.API_BASE_URL,
    withCredentials: true,
    timeout: 10000,
});

http.interceptors.response.use((res)=>res, (err)=>{
    console.log("API error : ", err.response.data || err.message);
    return Promise.reject(err);
})
