import axios from 'axios';
import type { Contract } from '../types/contract';
const axiosInstance = axios.create({
    baseURL:"http://localhost:4545",
    timeout: 5000, // 请求超时时间（毫秒）
    headers: {
      'Content-Type': 'application/json', // 默认请求头
      'Authorization': localStorage.getItem('token') || ''
    },
})
export default axiosInstance;
