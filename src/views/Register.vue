<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
const router = useRouter()
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const email = ref('')
const role = ref('')
const errorMessage = ref('')


const register = async () => {
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致'
    return
  }
   setTimeout(() => {}, 100) // 模拟延时
    const response = await axios.post('http://120.46.66.184:4540/user/register', {
      username: username.value,
      email: email.value,
      password: password.value,
    })

    if (response.status === 200) {
      router.push('/waiting-approval')  // 注册成功跳转等待
    } else {
      errorMessage.value = response.data // 例如：用户名已存在
    }
  
}
const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600">
    <div class="backdrop-blur-xl bg-white/30 border border-white/50 rounded-xl shadow-lg p-10 w-full max-w-md animate-fade-in">
      <h1 class="text-3xl font-bold text-white text-center mb-6 drop-shadow">注册账号</h1>

      <div v-if="errorMessage" class="bg-red-200 text-red-800 px-4 py-2 rounded mb-4">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="register">
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

        <div class="mb-4">
          <label for="email" class="block text-white text-sm mb-1">电子邮箱</label>
          <input
            id="email"
            v-model="email"
            class="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="email"
            placeholder="请输入电子邮箱"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-white text-sm mb-1">密码</label>
          <input
            id="password"
            v-model="password"
            class="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="请输入密码"
          />
        </div>

        <div class="mb-6">
          <label for="confirm-password" class="block text-white text-sm mb-1">确认密码</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            class="w-full px-4 py-2 rounded bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="password"
            placeholder="请再次输入密码"
          />
        </div>

        <button
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          type="submit"
        >
          注册
        </button>
      </form>

      <div class="mt-4 text-center text-white text-sm">
        已有账号？
        <span class="underline cursor-pointer text-blue-200 hover:text-white" @click="goToLogin">立即登录</span>
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