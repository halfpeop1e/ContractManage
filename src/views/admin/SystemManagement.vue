<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">系统管理</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/system/assign')">
        <h3 class="text-xl font-bold mb-2">分配合同</h3>
        <p>为起草完成的合同指定会签、审批、签订人员</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/system/permissions')">
        <h3 class="text-xl font-bold mb-2">权限管理</h3>
        <p>管理用户角色和权限，授权新用户</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/system/logs')">
        <h3 class="text-xl font-bold mb-2">日志管理</h3>
        <p>查看系统操作日志，进行备份和导出</p>
      </div>
    </div>
  </div>
</template>
