<script setup>
import { ref,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import axiosInstance from '../../../utils/addDraft'
import {useCustomerStore} from '../../../stores/customerStore'
const customerStore = useCustomerStore()

const contractName = ref('')
const customerName = ref('')
const startDate = ref('')
const endDate = ref('')
const content = ref('')
const file = ref(null)
const isLoading = ref(false)
const formRef = ref(null)

const formRules = {
  contractName: [{ required: true, message: '请输入合同名称', trigger: 'blur' }],
  customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
  startDate: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endDate: [
    { required: true, message: '请选择结束时间', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (value && startDate.value && new Date(value) < new Date(startDate.value)) {
          callback(new Error('结束日期不能早于开始日期'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  content: [{ required: true, message: '请输入合同内容', trigger: 'blur' }]
}

const handleUploadChange = (uploadFile) => {
  file.value = uploadFile.raw
}

const submitForm = async () => {
  await formRef.value.validate(async (valid) => {
    if (!valid) return

    const creatorId = localStorage.getItem('userId')
    const formData = new FormData()
    //合同的code由后端生成
    formData.append('contractname', contractName.value)
    formData.append('customername', customerName.value)
    formData.append('starttime', startDate.value)
    formData.append('endtime', endDate.value)
    formData.append('content', content.value)
    // formData.append('drafter', creatorId)
    // formData.append('drafttime', getCurrentTime())
    // formData.append('status', '待会签') 
    if (file.value) {
      formData.append('file', file.value)
    }

    try {
      isLoading.value = true
      const response = await axiosInstance.post('/contract/draft', formData, {
        headers: { 'Content-Type': 'multipart/form-data',
          'Authorization': localStorage.getItem('token') || ''
         }
      })

      if (response.status !== 200) {
        throw new Error('提交失败')
      }

      ElMessage.success('合同起草成功，等待管理员分配')

      // 重置表单
      contractName.value = ''
      customerName.value = ''
      startDate.value = ''
      endDate.value = ''
      content.value = ''
      file.value = null
      formRef.value.resetFields()
    } catch (error) {
      console.error(error)
      ElMessage.error('提交失败，请稍后重试')
    } finally {
      isLoading.value = false
    }
  })
}
onMounted(() => {
  customerStore.fetchCustomers()
  console.log('客户数据:', customerStore.customers)
})
</script>

<template>
  <div class="max-w-3xl mx-auto">
    <h2 class="text-2xl font-bold mb-6">起草合同</h2>

    <el-form
      ref="formRef"
      :model="{ contractName, customerName, startDate, endDate, content }"
      :rules="formRules"
      label-width="100px"
      label-position="left"
    >
      <el-form-item label="合同名称" prop="contractName">
        <el-input v-model="contractName" placeholder="请输入合同名称" />
      </el-form-item>

      <el-form-item label="客户名称" prop="customerName">
         <el-select
      v-model="customerName"
      placeholder="Select"
      style="width: 240px"
    >
      <el-option
        v-for="item in customerStore.customers"
        :key="item.name"
        :value="item.name"
      />
    </el-select>
      </el-form-item>

      <el-form-item label="开始时间" prop="startDate">
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="选择开始日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="结束时间" prop="endDate">
        <el-date-picker
          v-model="endDate"
          type="date"
          placeholder="选择结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="合同内容" prop="content">
        <el-input
          type="textarea"
          v-model="content"
          :rows="6"
          placeholder="请输入合同内容"
        />
      </el-form-item>

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

      <el-form-item>
        <el-button
          type="primary"
          :loading="isLoading"
          @click="submitForm"
        >
          {{ isLoading ? '提交中...' : '提交' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.max-w-3xl {
  max-width: 768px;
}
</style>
