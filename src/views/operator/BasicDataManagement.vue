<script setup lang="ts">
import { ref,onMounted } from 'vue'
import {useCustomerStore} from '../../stores/customerStore'
import axiosInstance from '../../utils/getCustomers'
const CustomerStore = useCustomerStore()
// 模拟客户数据
const customers = computed(() => CustomerStore.customers || [])
const dialogVisible = ref(false)
const searchCustomerCode = ref('')
const searchCustomerName = ref('')
const showEditDialog = ref(false)
const editCustomer = ref({
  code: '',
  name: '',
  contact: '',
  phone: '',
  address: ''
})
const filteredCustomers = computed(() => {
  return customers.value.filter(customer => {
    return (
      (searchCustomerCode.value === '' || customer.code.toLowerCase().includes(searchCustomerCode.value.toLowerCase())) &&
      (searchCustomerName.value === '' || customer.name.toLowerCase().includes(searchCustomerName.value.toLowerCase()))
    )
  })
})
const openEditDialog = (customer) => {
  editCustomer.value = { ...customer }  // 创建副本避免直接绑定原数据
  showEditDialog.value = true
}
const resetCustomerSearch = () => {
  searchCustomerCode.value = ''
  searchCustomerName.value = ''
}

// 新增客户
const showAddCustomerForm = ref(false)
const errorMessage = ref('')
const newCustomer = ref({
  code: '',
  name: '',
  contact: '',
  phone: '',
  address: ''
})
const successMessage = ref('')

const addCustomer =  async ()  => {
  // 模拟添加客户
   try {
    // 发送 POST 请求到后端
    const response = await axiosInstance.post('/customer/add', newCustomer.value)

    if (response.data && response.data.success) {
      successMessage.value = '客户信息添加成功'
      dialogVisible.value = true
      console.log(dialogVisible.value)
      // 可选：更新本地客户列表
      // customers.value.push(response.data.customer)

      // 重置表单
      setTimeout(() => {
        newCustomer.value = {
          code: '',
          name: '',
          contact: '',
          phone: '',
          address: ''
        }
        showAddCustomerForm.value = false
        successMessage.value = ''
      }, 2000)
    } else {
      errorMessage.value = '添加失败，请稍后再试'
    }
  } catch (error) {
    console.error(error)
    errorMessage.value = '请求失败，请检查网络或联系管理员'
  }
}
const deleteCustomer = async () => {
  if (!confirm('确定要删除该客户吗？')) return
  const code = editCustomer.value.code
  try {
    const response = await axiosInstance.delete(`/customer/${code}`)
    if (response.status === 200) {
      alert('客户删除成功')
      await CustomerStore.fetchCustomers() // 重新拉取客户列表
    } else {
      alert('删除失败，请重试')
    }
  } catch (error) {
    console.error('删除失败:', error)
    alert('删除失败，请检查网络或稍后重试')
  }
}
const saveEdit = async () => {
  try {
    const code = editCustomer.value.code
    const response = await axiosInstance.put(`/customer/${code}`, editCustomer.value)

    if (response.status === 200) {
      // 更新本地数据
      const index = customers.value.findIndex(c => c.code === code)
      if (index !== -1) {
        customers.value[index] = { ...editCustomer.value }
      }

      showEditDialog.value = false
      alert('客户信息更新成功')
      await CustomerStore.fetchCustomers()
    } else {
      alert('更新失败，请重试')
    }
  } catch (error) {
    console.error('更新失败', error)
    alert('更新失败，请检查网络或稍后重试')
  }
}
onMounted(async() => {
  try{
    await CustomerStore.fetchCustomers()
  }catch (error) {
    console.error('获取客户数据失败:', error)
  }
})
import { computed } from 'vue'
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="提示"
    width="500"
  >
    <span>添加成功</span>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <div>
    <h2 class="text-2xl font-bold mb-6">基础数据管理</h2>
    
    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>
    
    <div class="card mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">客户信息管理</h3>
        <button @click="showAddCustomerForm = !showAddCustomerForm" class="btn btn-primary">
          {{ showAddCustomerForm ? '取消' : '新增客户' }}
        </button>
      </div>
      
      <div v-if="showAddCustomerForm" class="mb-6 p-4 border rounded">
        <h4 class="font-bold mb-4">新增客户信息</h4>
        
        <div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-code">
                客户编号 <span class="text-red-500">*</span>
              </label>
              <input 
                id="customer-code"
                v-model="newCustomer.code"
                class="form-control"
                type="text" 
                placeholder="请输入客户编号"
                required
              >
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-name">
                客户名称 <span class="text-red-500">*</span>
              </label>
              <input 
                id="customer-name"
                v-model="newCustomer.name"
                class="form-control"
                type="text" 
                placeholder="请输入客户名称"
                required
              >
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-contact">
                联系人
              </label>
              <input 
                id="customer-contact"
                v-model="newCustomer.contact"
                class="form-control"
                type="text" 
                placeholder="请输入联系人"
              >
            </div>
            
            <div>
              <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-phone">
                联系电话
              </label>
              <input 
                id="customer-phone"
                v-model="newCustomer.phone"
                class="form-control"
                type="text" 
                placeholder="请输入联系电话"
              >
            </div>
            
            <div class="md:col-span-2">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="customer-address">
                地址
              </label>
              <input 
                id="customer-address"
                v-model="newCustomer.address"
                class="form-control"
                type="text" 
                placeholder="请输入地址"
              >
            </div>
          </div>
          
          <div class="flex justify-end mt-4">
            <el-button @click="addCustomer()" type="submit" class="btn btn-primary">保存</el-button>
          </div>
            
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-customer-code">
            客户编号
          </label>
          <input 
            id="search-customer-code"
            v-model="searchCustomerCode"
            class="form-control"
            type="text" 
            placeholder="请输入客户编号"
          >
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-customer-name">
            客户名称
          </label>
          <input 
            id="search-customer-name"
            v-model="searchCustomerName"
            class="form-control"
            type="text" 
            placeholder="请输入客户名称"
          >
        </div>
      </div>
      
      <div class="flex justify-end mb-4">
        <button @click="resetCustomerSearch" class="btn btn-secondary mr-2">重置</button>
        <button class="btn btn-primary">查询</button>
      </div>
      
      <div v-if="filteredCustomers.length === 0" class="text-center p-4">
        <p>暂无符合条件的客户</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>客户编号</th>
            <th>客户名称</th>
            <th>联系人</th>
            <th>联系电话</th>
            <th>地址</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in filteredCustomers" :key="customer.code">
            <td>{{ customer.code }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.contact }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td>
              <button class="btn btn-secondary mr-2" @click="openEditDialog(customer)">编辑</button>
               <button class="btn btn-danger" @click="deleteCustomer()">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div v-if="showEditDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
      <h3 class="text-lg font-bold mb-4">编辑客户信息</h3>

      <form @submit.prevent="saveEdit">
        <div class="mb-4">
          <label class="block text-sm font-medium">客户名称</label>
          <input v-model="editCustomer.name" type="text" class="form-control" required>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">联系人</label>
          <input v-model="editCustomer.contact" type="text" class="form-control">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">联系电话</label>
          <input v-model="editCustomer.phone" type="text" class="form-control">
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium">地址</label>
          <input v-model="editCustomer.address" type="text" class="form-control">
        </div>

        <div class="flex justify-end gap-2">
          <button type="button" class="btn btn-secondary" @click="showEditDialog = false">取消</button>
          <button type="submit" class="btn btn-primary">保存</button>
        </div>
      </form>
    </div>
  </div>
</template>
