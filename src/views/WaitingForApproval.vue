<script setup>
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

let router = null

onMounted(() => {
  router = useRouter()
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-96 text-center">
      <h1 class="text-2xl font-bold mb-6">等待授权</h1>
      
      <div class="mb-6">
        <p class="mb-4">您的账号已注册成功，但尚未获得系统使用权限。</p>
        <p class="mb-4">请等待管理员授权后再登录系统。</p>
      </div>
      
      <button @click="logout" class="btn btn-primary">
        返回登录页面
      </button>
    </div>
  </div>
</template>
