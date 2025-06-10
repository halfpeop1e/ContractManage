import axios from 'axios';
const axiosInstance = axios.create({
    baseURL:"http://120.46.66.184:4540",
    timeout: 5000, // 请求超时时间（毫秒）
    headers: {
      'Content-Type': 'application/json', // 默认请求头
       'Authorization': localStorage.getItem('token') || ''
    },
})

// 添加请求拦截器
axiosInstance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;