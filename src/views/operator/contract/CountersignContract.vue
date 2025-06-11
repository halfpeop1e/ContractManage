<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import axiosInstance from '../../../utils/addDraft'
import { useContractStore } from '../../../stores/contractStore'
const contersignContractStore = useContractStore()
const selectedContract = ref(null)
const opinion = ref('')
const successMessage = ref('')
const userId = localStorage.getItem('userId')
const contracts = ref([])

// 检查用户是否已会签该合同
const hasCountersigned = (contract) => {
  if (!contract.countersignComments) return false
  return contract.countersignComments.split(';')
    .some(comment => {
      const parts = comment.split('|')
      return parts.length > 0 && parts[0] === contract.creatorName
    })
}

//const fetchContracts = async () => {
  //const response = await axios.get('/api/contracts/countersign', {
   // params: { userId }
 // })
 // contracts.value = response.data.map(contract => ({
 //   ...contract,
 //   hasSigned: hasCountersigned(contract)
 // }))
//}

const viewContract = (contract) => {
  selectedContract.value = {
    ...contract,
    hasSigned: hasCountersigned(contract)
  }
  opinion.value = ''
}

const submitOpinion = async () => {
  if (!opinion.value) {
    alert('请填写会签意见')
    return
  }
  if (selectedContract.value.hasSigned) {
    alert('您已会签此合同，无法再次提交意见')
    return
  }
  try {
    await axiosInstance.post('/contract/countersign', {
      code: selectedContract.value.code,
      cosigntime:getCurrentTime(),
      cosigncontent: opinion.value,
      status: '待定稿'
    })
    
    successMessage.value = '会签意见提交成功'
    selectedContract.value.hasSigned = true
    await fetchContracts()
    
    setTimeout(() => {
      selectedContract.value = null
      opinion.value = ''
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    alert(error.response?.data.message || '提交失败')
  }
}

// 过滤掉已会签的合同
const filteredContracts = computed(() => 
  contracts.value.filter(c => !c.hasSigned)
)

onMounted(()=>{
  contersignContractStore.fetchContracts('待会签')
 contersignContractStore.fetchContractsprocess('待会签')
})
const mergedContracts = computed(() => {
  const processMap = new Map(
    contersignContractStore.contractsprocess.map(item => [item.code, item])
  )

  return contersignContractStore.contracts.map(contract => {
    const process = processMap.get(contract.code)
    return {
      ...contract,
      ...process  // 会合并 process 字段，如果有 code 和 status，则会覆盖 contract 中的值
    }
  })
})
const filteredContractsByCofigner = computed(() => {
  return mergedContracts.value.filter(contract => contract.cosigner === userId)
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">会签合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待会签合同列表</h3>
      
      <div v-if="contersignContractStore.length === 0" class="text-center p-4">
        <p>暂无待会签合同</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>合同名称</th>
            <th>客户名称</th>
            <th>起草日期</th>
            <th>起草人</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="contract in filteredContractsByCofigner" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.createdAt }}</td>
            <td>{{ contract.creatorName }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">会签</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同详情</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>起草日期：</strong>{{ selectedContract.createdAt }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.creatorName }}</p>
      </div>
      
      <div class="mb-4">
        <h4 class="font-bold mb-2">合同内容：</h4>
        <div class="p-4 bg-gray-100 rounded">
          <p>{{ selectedContract.content }}</p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="opinion">
          会签意见 <span class="text-red-500">*</span>
        </label>
        <textarea 
          id="opinion"
          v-model="opinion"
          :disabled="selectedContract.hasSigned"
          class="form-control"
          :class="{ 'bg-gray-100': selectedContract.hasSigned }"
          rows="4" 
          placeholder="请输入您的会签意见"
          required
        ></textarea>
      </div>
      
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button 
          @click="submitOpinion" 
          :disabled="selectedContract.hasSigned"
          class="btn"
          :class="{
            'btn-primary': !selectedContract.hasSigned,
            'btn-disabled': selectedContract.hasSigned
          }"
        >
          {{ selectedContract.hasSigned ? '已会签' : '提交会签意见' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style>
.btn-disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
  color: #9ca3af;
}
</style>