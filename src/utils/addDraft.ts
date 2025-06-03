import axios from 'axios';
const axiosInstance = axios.create({
    baseURL:"http://localhost:4545/contract",
    timeout: 5000, // 请求超时时间（毫秒）
    headers: {
      'Content-Type': 'application/json', // 默认请求头
    },
})
export default axiosInstance;