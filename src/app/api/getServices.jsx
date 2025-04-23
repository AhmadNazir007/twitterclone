import axios from 'axios'

export const api = axios.create({
    baseURL:'http://localhost.com:4000',
    headers:{
        'Content-Type': '/application/json',
    }
})