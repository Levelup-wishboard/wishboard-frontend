// constants/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://3.39.187.114:8080',   // 서버 IP
  timeout: 8000,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('accessToken');
  if (token) {
    // set 대신 bracket notation 으로 시도
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('🚀 요청 헤더 전체:', JSON.stringify(config.headers, null, 2));

  return config;
}, error => Promise.reject(error));


export default api;