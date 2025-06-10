<script setup>
import { ref, onMounted,computed } from 'vue'
import axios from 'axios'
import axiosInstance from '../../../utils/getContract'
import { useContractStore } from '../../../stores/contractStore'
const finalizeContractStore = useContractStore()
const contracts = ref([])
const selectedContract = ref(null)
const updatedContent = ref('')
const successMessage = ref('')
const userId = localStorage.getItem('userId')

const viewContract = (contract) => {
  selectedContract.value = contract
  updatedContent.value = contract.content
}
const handleUploadChange = (uploadFile) => {
  file.value = uploadFile.raw
}
const finalizeContract = async () => {
  if (!updatedContent.value) {
    alert('请填写修改后的合同内容')
    return
  }
  const formData = new FormData()
formData.append('code', selectedContract.value.code)
formData.append('content', updatedContent.value)

// 可选：添加时间、状态等字段
formData.append('finalizetime', getCurrentTime())
formData.append('status', '待签订')
 if (file.value) {
      formData.append('file', file.value)
    }
  try {
    
await axiosInstance.post('/contract/final', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
    
    successMessage.value = '合同定稿成功'
    
    setTimeout(() => {
      selectedContract.value = null
      updatedContent.value = ''
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    alert(error.response?.data || '定稿失败')
  }
}

onMounted(()=>{
  finalizeContractStore.fetchContracts('待定稿')
  finalizeContractStore.fetchContractsprocess('待定稿')
})
const mergedContracts = computed(() => {
  const processMap = new Map(
    finalizeContractStore.contractsprocess.map(item => [item.code, item])
  )

  return finalizeContractStore.contracts.map(contract => {
    const process = processMap.get(contract.code)
    return {
      ...contract,
      ...process  // 会合并 process 字段，如果有 code 和 status，则会覆盖 contract 中的值
    }
  })
})
const filteredContractsByFinalizer = computed(() => {
  return mergedContracts.value.filter(contract => contract.finalizer === currentUserId.value)
})
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">定稿合同</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div v-if="!selectedContract">
      <h3 class="text-xl font-bold mb-4">待定稿合同列表</h3>
      
      <div v-if="finalizeContractStore.contracts.length === 0" class="text-center p-4">
        <p>暂无待定稿合同</p>
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
          <tr v-for="contract in mergedContracts" :key="contract.id">
            <td>{{ contract.name }}</td>
            <td>{{ contract.customer }}</td>
            <td>{{ contract.drafttime}}</td>
            <td>{{ contract.drafter }}</td>
            <td>
              <button @click="viewContract(contract)" class="btn btn-secondary">定稿</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">合同定稿</h3>
      
      <div class="mb-4">
        <p><strong>合同名称：</strong>{{ selectedContract.name }}</p>
        <p><strong>客户名称：</strong>{{ selectedContract.customer }}</p>
        <p><strong>起草日期：</strong>{{ selectedContract.createdAt }}</p>
        <p><strong>起草人：</strong>{{ selectedContract.creatorName }}</p>
      </div>
      
      <div class="mb-4" v-if="selectedContract.countersignComments">
        <h4 class="font-bold mb-2">会签意见</h4>
        <div v-for="(comment, index) in selectedContract.countersignComments.split(';')" :key="index" class="p-3 bg-gray-100 rounded mb-2">
          <p v-if="comment">
            <strong>{{ comment.split('|')[0] }}</strong> ({{ comment.split('|')[1] }})
            <br>
            {{ comment.split('|')[2] }}
          </p>
        </div>
      </div>
      
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="updated-content">
          修改后的合同内容 <span class="text-red-500">*</span>
        </label>
        <textarea 
          id="updated-content"
          v-model="updatedContent"
          class="form-control"
          rows="10" 
          placeholder="请根据会签意见修改合同内容"
          required
        ></textarea>
      </div>
      <el-form-item label="附件上传">
        <el-upload
          accept=".doc,.docx,.jpg,.jpeg,.png,.bmp,.gif"
          :show-file-list="true"
          :limit="1"
          :auto-upload="false"
          :on-change="handleUploadChange"
        >
          <el-button type="primary">选择文件</el-button>
          <template #tip>
            <div class="el-upload__tip">支持格式：doc, jpg, jpeg, png, bmp, gif</div>
          </template>
        </el-upload>
      </el-form-item>
      <div class="flex justify-between">
        <button @click="selectedContract = null" class="btn btn-secondary">返回</button>
        <button @click="finalizeContract" class="btn btn-primary">提交定稿</button>
      </div>
    </div>
  </div>
</template>