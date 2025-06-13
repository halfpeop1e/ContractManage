<script setup>
import { ref, onMounted,computed } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '../../utils/getUser'
import { useContractStore } from '../../stores/contractStore'
const router = useRouter()
const userStr = localStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : null
const Permission = user?.permission || {}
console.log('用户权限:', Permission)
const contract= useContractStore()
const userId = localStorage.getItem('userId')
// 模拟用户权限
// 检查是否有权限
const hasPermission = (permission) => {
  return Permission[permission] === true
}
const one = computed(() => {
  return contract.contractsprocess.filter(contract => contract.cosigner === userId)
})
const two = computed(() => {
  return contract.contractsprocess.filter(contract => contract.finalizer === userId)
})
const three = computed(() => {
  return contract.contractsprocess.filter(contract => contract.approver === userId)
})
const four = computed(() => {
  return contract.contractsprocess.filter(contract => contract.signer === userId)
})
// 模拟待处理任务数量
const taskCounts = ref({
  countersign: one.value.length,
  finalize: two.value.length,
  sign: three.value.length,
  approve: four.value.length
})
onMounted(() => {
contract.fetchContractsprocess()
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">合同管理</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-if="hasPermission('draft')" 
        class="card cursor-pointer hover:shadow-lg"
        @click="router.push('/operator/contract/draft')"
      >
        <h3 class="text-xl font-bold mb-2">起草合同</h3>
        <p>创建新的合同，填写合同基本信息和内容</p>
      </div>
      
      <div 
        v-if="hasPermission('countersign')" 
        class="card cursor-pointer hover:shadow-lg"
        @click="router.push('/operator/contract/countersign')"
      >
        <h3 class="text-xl font-bold mb-2">会签合同</h3>
        <p>对分配给您的合同进行会签，提供意见</p>
        <div v-if="taskCounts.countersign > 0" class="mt-2 inline-block px-2 py-1 bg-red-100 text-red-800 rounded">
          {{ taskCounts.countersign }} 个待处理
        </div>
      </div>
      
      <div 
        v-if="hasPermission('finalize')" 
        class="card cursor-pointer hover:shadow-lg"
        @click="router.push('/operator/contract/finalize')"
      >
        <h3 class="text-xl font-bold mb-2">定稿合同</h3>
        <p>根据会签意见修改合同并定稿</p>
        <div v-if="taskCounts.finalize > 0" class="mt-2 inline-block px-2 py-1 bg-red-100 text-red-800 rounded">
          {{ taskCounts.finalize }} 个待处理
        </div>
      </div>
      
      <div 
        v-if="hasPermission('sign')" 
        class="card cursor-pointer hover:shadow-lg"
        @click="router.push('/operator/contract/sign')"
      >
        <h3 class="text-xl font-bold mb-2">签订合同</h3>
        <p>记录合同签订情况</p>
        <div v-if="taskCounts.sign > 0" class="mt-2 inline-block px-2 py-1 bg-red-100 text-red-800 rounded">
          {{ taskCounts.sign }} 个待处理
        </div>
      </div>

      <div 
        v-if="hasPermission('approve')" 
        class="card cursor-pointer hover:shadow-lg"
        @click="router.push('/operator/contract/approve')"
      >
        <h3 class="text-xl font-bold mb-2">审批合同</h3>
        <p>对定稿后的合同进行审批</p>
        <div v-if="taskCounts.approve > 0" class="mt-2 inline-block px-2 py-1 bg-red-100 text-red-800 rounded">
          {{ taskCounts.approve }} 个待处理
        </div>
      </div>
    </div>
  </div>
</template>
