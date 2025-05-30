<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">合同管理</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/contract/draft')">
        <h3 class="text-xl font-bold mb-2">起草合同</h3>
        <p>创建新的合同，填写合同基本信息和内容</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/contract/countersign')">
        <h3 class="text-xl font-bold mb-2">会签合同</h3>
        <p>对分配给您的合同进行会签，提供意见</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/contract/finalize')">
        <h3 class="text-xl font-bold mb-2">定稿合同</h3>
        <p>根据会签意见修改合同并定稿</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/contract/approve')">
        <h3 class="text-xl font-bold mb-2">审批合同</h3>
        <p>对定稿后的合同进行审批</p>
      </div>
      
      <div class="card cursor-pointer hover:shadow-lg" @click="navigateTo('/admin/contract/sign')">
        <h3 class="text-xl font-bold mb-2">签订合同</h3>
        <p>记录合同签订情况</p>
      </div>
    </div>
  </div>
</template>
