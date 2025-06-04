<script setup>
import { ref, onMounted,computed } from 'vue'
import axios from 'axios'
import { useContractStore } from '../../../stores/contractStore'
const approveContractStore = useContractStore()
const contracts = ref([])
const selectedContract = ref(null)
const approvalResult = ref('approve')
const approvalComment = ref('')
const successMessage = ref('')

// 获取当前用户ID（根据你的实际实现调整）
const currentUserId = ref(localStorage.getItem('userId') || 1)
console.log('当前用户ID:', currentUserId.value)
// 获取待审批合同


const viewContract = (contract) => {
  selectedContract.value = contract
  approvalResult.value = 'approve'
  approvalComment.value = ''
}

const submitApproval = async () => {
  // 添加空值验证
  if (!approvalComment.value.trim()) {
    successMessage.value = '审批意见不能为空'
    return
  }
  try {
    await axios.post(`http://localhost:4545/contract/approve`, {
      // approvetime:getCurrentTime(),
      code: selectedContract.value.code,
      approvalResult: approvalResult.value,
      approvalComment: approvalComment.value
    },{
      headers: {
      'Content-Type': 'application/json', // 默认请求头
       'Authorization': localStorage.getItem('token') || ''
    },
    })
    
    successMessage.value = approvalResult.value === 'approve' 
      ? '合同审批通过，可以进行签订' 
      : '合同审批未通过，已退回修改'
    
    // 刷新列表
    await approveContractStore.fetchContracts('待审核')
    
    // 重置
    setTimeout(() => {
      selectedContract.value = null
      approvalComment.value = ''
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    console.error('提交审批失败:', error)
    successMessage.value = '提交审批失败，请重试'
  }
}

// 初始化时获取合同
onMounted(()=>{
  approveContractStore.fetchContracts('待审核')
  approveContractStore.fetchContractsprocess('待审核')
})
const mergedContracts = computed(() => {
  const processMap = new Map(
    approveContractStore.contractsprocess.map(item => [item.code, item])
  )

  return approveContractStore.contracts.map(contract => {
    const process = processMap.get(contract.code)
    return {
      ...contract,
      ...process  // 会合并 process 字段，如果有 code 和 status，则会覆盖 contract 中的值
    }
  })
})
const filteredContractsByApprover = computed(() => {
  return mergedContracts.value.filter(contract => contract.approver === currentUserId.value)
})
</script>
<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">审批合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待审批合同列表</h3>
      
      <div v-if="approveContractStore.length === 0" class="text-center p-4">
        <p>暂无待审批合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>定稿日期</th>
            <th>定稿人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in mergedContracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>           
            <td>{{ contract.finalizetime}}</td>
            <td>{{ contract.finalizer }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">审批</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同审批</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>定稿日期：</strong>{{ selectedContract.finalizetime }}</p>
        <p><strong>定稿人：</strong>{{ selectedContract.finalizer }}</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-bold mb-2">合同内容</h4>
        <div class="p-4 bg-gray-100 rounded">
          <p>{{ selectedContract.content}}</p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          审批结果 <span class="text-red-500">*</span>
        </label>
        <div class="flex items-center">
          <input 
            id="approve"
            v-model="approvalResult"
            type="radio" 
            value="approve"
            class="mr-2"
          >
          <label for="approve" class="mr-4">通过</label>
          
          <input 
            id="reject"
            v-model="approvalResult"
            type="radio" 
            value="reject"
            class="mr-2"
          >
          <label for="reject">不通过</label>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="approval-comment">
          审批意见
        </label>
        <textarea 
          id="approval-comment"
          v-model="approvalComment"
          class="form-control"
          rows="4" 
          placeholder="请输入审批意见（可选）"
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="submitApproval" class="btn btn-primary">提交审批</button>
      </div>
    </div>
  </div>
</template>
