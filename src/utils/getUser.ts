import axios from 'axios';
const axiosInstance = axios.create({
    baseURL:"https://m1.apifoxmock.com/m1/6167810-5859931-default",
    timeout: 5000, // 请求超时时间（毫秒）
    headers: {
      'Content-Type': 'application/json', // 默认请求头
    },
})
export default axiosInstance;