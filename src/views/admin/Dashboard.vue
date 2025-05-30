<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import  PanelMenu  from 'primevue/panelmenu'

const router = useRouter()
const user = ref(null)
const userId = localStorage.getItem('userId')

// 获取用户信息
onMounted(() => {
  const storedUser = localStorage.getItem('user')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }
})

// 注销登录
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('userId')
  router.push('/login')
}

// PrimeVue PanelMenu 数据
const items = ref([
  {
    label: '合同管理',
    icon: 'pi pi-folder',
    items: [
      { label: '起草合同', icon: 'pi pi-pencil', command: () => router.push('/admin/contract/draft') },
      { label: '会签合同', icon: 'pi pi-users', command: () => router.push('/admin/contract/countersign') },
      { label: '定稿合同', icon: 'pi pi-file-edit', command: () => router.push('/admin/contract/finalize') },
      { label: '审批合同', icon: 'pi pi-check-square', command: () => router.push('/admin/contract/approve') },
      { label: '签订合同', icon: 'pi pi-file', command: () => router.push('/admin/contract/sign') }
    ]
  },
  {
    label: '数据管理',
    icon: 'pi pi-database',
    items: [
      { label: '合同数据管理', icon: 'pi pi-chart-bar', command: () => router.push('/admin/query') },
      { label: '客户数据管理', icon: 'pi pi-users', command: () => router.push('/admin/basic-data') }
    ]
  },
  {
    label: '系统管理',
    icon: 'pi pi-cog',
    items: [
      { label: '分配合同', icon: 'pi pi-share-alt', command: () => router.push('/admin/system/assign') },
      { label: '权限管理', icon: 'pi pi-lock', command: () => router.push('/admin/system/permissions') },
      { label: '日志管理', icon: 'pi pi-history', command: () => router.push('/admin/system/logs') }
    ]
  }
])
</script>

<template>
  <div class="flex h-screen bg-gradient-to-br from-blue-100 to-blue-200 text-gray-900 overflow-hidden">
    <!-- PanelMenu 侧边栏 -->
    <aside class="w-64 bg-white/70 backdrop-blur-md border-r border-white/50 shadow-md p-4">
      <div class="mb-6 border-b border-white/30 pb-4">
        <h2 class="text-2xl font-bold text-gray-800">合同管理系统</h2>
        <p class="text-sm text-gray-700">管理员面板</p>
      </div>

      <PanelMenu :model="items" class="w-full" />
    </aside>

    <!-- 主内容 -->
    <main class="flex-1 flex flex-col relative overflow-auto p-6 animate-fade-in">
      <header class="flex justify-between items-center mb-6 backdrop-blur-md bg-white/40 rounded-xl px-6 py-4 shadow border border-white/30">
        <h1 class="text-2xl font-semibold text-gray-800">管理员控制面板</h1>
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-700">欢迎，{{ '管理员' + userId }}</span>
          <button @click="logout" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow transition">注销登录</button>
        </div>
      </header>

      <div class="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-md overflow-auto h-full border border-white/30 animate-fade-in">
        <router-view />
      </div>
    </main>
  </div>
</template>

<style scoped>
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
