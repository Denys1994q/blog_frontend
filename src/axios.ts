import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_URL
    // baseURL: 'https://blog-backend1994.onrender.com'
})

// функція яка перевіряє при кожному запиті не важливо якому чи ми авторизовані (чи є токен в локалстореджі)
instance.interceptors.request.use((config: any): any => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance