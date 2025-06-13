<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()
const user = ref(null)

onMounted(() => {
  
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

const logout = () => {
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<template>
  <div class="flex h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900 overflow-hidden">
    <!-- 侧边栏 -->
    <aside class="w-64 backdrop-blur-md bg-white/30 border-r border-white/50 shadow-md flex flex-col">
      <div class="p-6 border-b border-white/40 text-center">
        <h2 class="text-2xl font-bold text-blue-700 tracking-wide select-none">合同管理系统</h2>
        <p class="text-sm text-blue-600 mt-1">操作员面板</p>
      </div>

      <ul class="flex-1 mt-6 space-y-4 px-4 animate-fade-in">
        <li>
          <router-link
            to="/operator/contract"
            class="nav-link"
            active-class="nav-link-active"
            exact
          >
            合同管理
          </router-link>
        </li>
        <li>
          <router-link
            to="/operator/query"
            class="nav-link"
            active-class="nav-link-active"
            exact
          >
            查询统计
          </router-link>
        </li>
        <li>
          <router-link
            to="/operator/basic-data"
            class="nav-link"
            active-class="nav-link-active"
            exact
          >
            基础客户管理
          </router-link>
        </li>
      </ul>
    </aside>

    <!-- 主内容 -->
    <main class="flex-1 flex flex-col relative overflow-auto p-6 animate-fade-in">
      <header class="flex justify-between items-center mb-6 backdrop-blur-md bg-white/40 rounded-xl px-6 py-4 shadow border border-white/30">
        <h1 class="text-2xl font-semibold text-gray-800">操作员控制面板</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-700">
            欢迎，<span class="capitalize">{{ user?.username || "操作员" }}</span>
          </span>
          <button
            @click="logout"
            class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition"
          >
            注销登录
          </button>
        </div>
      </header>

      <section class="flex-1 overflow-auto bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md border border-white/30">
        <router-view />
      </section>
    </main>
  </div>
</template>

<style scoped>
.nav-link {
  @apply block px-4 py-3 rounded-lg text-blue-800 font-medium text-center 
    bg-gradient-to-r from-blue-100 via-white/30 to-blue-100
    hover:brightness-105 hover:scale-105
    transition transform duration-300 ease-in-out
    backdrop-blur-sm
    shadow-md
    border border-white/40
    hover:border-blue-300;
}

.nav-link-active {
  @apply bg-blue-200 border-blue-400 shadow-lg;
}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}
</style>