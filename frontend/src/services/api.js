import axios from 'axios';

// ده عنوان الـ Backend اللي إنت لسه مشغله وبتقول فيه Connected
const API = axios.create({
    baseURL: 'http://localhost:5000/api' 
});

export const signUp = (userDataSignUp) => API.post('/users/signup', userDataSignUp);
export const login = (userDataLogin) => API.post('/users/login', userDataLogin);