<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')
const errorMessage = ref('')

import axios from 'axios'
const login = async () => {
  try {
    const response = await axios.post('http://localhost:4545/user/login', {
      username: username.value,
      password: password.value
    })
    console.log('后端响应数据:', response)

    if (response.status === 200 ) {
      // 将用户ID存入localStorage
      localStorage.setItem('userId', response.data.data.name);
      localStorage.setItem('token',response.data.data.authorized);
      const role = response.data.data.role
      const permission = response.data.data.permission
      const authorized =response.data.data.authorized
      const user = { username: response.data.data.name, role, permission }
      localStorage.setItem('user', JSON.stringify(user))
      console.log(authorized)
      if (role === 'newuser') {
        router.push('/waiting-approval')
      } else {
        router.push(role === 'admin' ? '/admin/contract' : '/operator/contract')
      }
    } else {
      errorMessage.value = response.data.message || '登录失败'
    }
  } catch (error) {
    errorMessage.value = error.response?.data?.message || '服务器连接失败'
  }
}
const goToadmin = () => {
  router.push('/admin')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
    <div class="backdrop-blur-xl bg-white/30 border border-white/50 rounded-xl shadow-lg p-10 w-full max-w-md animate-fade-in">
      <h1 class="text-3xl font-bold text-white text-center mb-6 drop-shadow">合同管理系统</h1>

      <div v-if="errorMessage" class="bg-red-200 text-red-800 px-4 py-2 rounded mb-4">
        {{ errorMessage }}
      </div>

      <div class="mb-4">
        <label for="username" class="block text-white text-sm mb-1">用户名</label>
        <input
          id="username"
          v-model="username"
          class="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="请输入用户名"
        />
      </div>

      <div class="mb-6">
        <label for="password" class="block text-white text-sm mb-1">密码</label>
        <input
          id="password"
          v-model="password"
          class="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="password"
          placeholder="请输入密码"
        />
      </div>

      <button
        class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
        @click="login()"
      >
        登录
      </button>

      <div class="text-center text-white mt-4">
        没有账号？
        <span class="underline cursor-pointer text-blue-200 hover:text-white" @click="goToRegister">立即注册</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>