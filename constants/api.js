// constants/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://3.39.187.114:8080',   // 서버 IP
  timeout: 8000,
}); 

// const api = axios.create({
//   baseURL: 'http://localhost:8080',   // 서버 IP
//   timeout: 8000,
// }); 

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    // set 대신 bracket notation 으로 시도
     console.log('토큰 붙임!', token); 
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));


export default api;