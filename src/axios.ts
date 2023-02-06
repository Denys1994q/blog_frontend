import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4444'
})

// функція яка перевіряє при кожному запиті не важливо якому чи ми авторизовані (чи є токен в локалстореджі)
instance.interceptors.request.use((config: any): any => {
    config.headers.Authorization = window.localStorage.getItem('token')
    return config
})

export default instance