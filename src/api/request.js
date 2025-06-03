// src/api/request.js
import axios from 'axios';

// 创建 axios 实例，配置后端 API 基础地址
const api = axios.create({
  baseURL: 'http://localhost:4545', // 替换为你的 Java 后端地址
  timeout: 5000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json', // 默认请求头
  },
});