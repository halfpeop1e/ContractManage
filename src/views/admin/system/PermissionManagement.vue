<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Permission } from '../../../types/permission'
import axios from 'axios'
import { useUserStore } from '../../../stores/userStore'
import axiosInstance from '../../../utils/getUser'
import permissionaxiosInstance from '../../../utils/editpermission'
const userStore = useUserStore()
const newPermissions = ref<Permission>({
  draft: false,
  countersign: false,
  finalize: false,
  sign: false,
  query: false,
  approve: false
})
const newRole = ref('')
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '操作员', value: 'operator' },
  { label: '新用户', value: 'newuser' }
]
// 权限列表（用于渲染 UI）
const permissionOptions = [
  { key: 'draft', label: '起草合同' },
  { key: 'countersign', label: '会签合同' },
  { key: 'finalize', label: '定稿合同' },
  { key: 'approve', label: '审批合同' },
  { key: 'sign', label: '签订合同' },
  { key: 'query', label: '查询合同' }
]

const selectedUser = ref<{ name: string; email: string; role: string; permission: Permission } | null>(null)
const successMessage = ref('')

// 获取用户列表
const fetchUsers = async () => {
  try {
     await axiosInstance.get('/user').then((response)=> {
      if (Array.isArray(response.data)) {
        console.log(response)
        userStore.users = response.data
        console.log(userStore.users)
      } else {
        console.error('接口返回的不是数组:', response.data)
        return { data: [] }
      }
    })
  } catch (err) {
    console.error('获取用户失败:', err)
  }
}

onMounted(fetchUsers)

const editUser = (user) => {
  selectedUser.value = { ...user }
  console.log('selectedUser:', JSON.stringify(selectedUser.value))
  newPermissions.value =  { ...user.permission }
  newRole.value =user.role
  console.log('newPermissions:', JSON.stringify(newPermissions.value))
  console.log('permissionOptions:', permissionOptions)
  console.log('newRole:', newRole.value)
}

const updateUserRole = async () => {
  try {
    const username = selectedUser.value?.name || ''
    if (!username) {
      console.error('用户名不存在或无效')
      return
    }
    const response= await permissionaxiosInstance.put(`/role/${username}`, {
      role: newRole.value,
      permission: newPermissions.value
    })
    console.log('权限更新响应:', response.data)
    // 更新本地数据
       const index = userStore.users.findIndex(u => u.name === username)
    if (index !== -1) {
      userStore.users[index].role = newRole.value
      userStore.users[index].permission = { ...newPermissions.value }
    }

    successMessage.value = '用户权限更新成功'
    setTimeout(() => {
      selectedUser.value = null
      newRole.value = ''
      successMessage.value = ''
      // 刷新用户列表
    }, 2000)
    await fetchUsers() 
  } catch (err) {
    console.error('权限更新失败:', err)
  }
}
</script>


<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">权限管理</h2>

    <div v-if="successMessage" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
      {{ successMessage }}
    </div>

    <div v-if="!selectedUser">
      <div class="card">
        <h3 class="text-xl font-bold mb-4">用户列表</h3>

        <table class="table">
          <thead>
            <tr>
              <th>用户名</th>
              <th>邮箱</th>
              <th>角色</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in userStore.users" :key="user.name">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td>
                <button @click="editUser(user)" class="btn btn-secondary">编辑权限</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else class="card">
      <h3 class="text-xl font-bold mb-4">编辑用户权限</h3>

      <div class="mb-4">
        <p><strong>用户名：</strong>{{ selectedUser.name }}</p>
        <p><strong>邮箱：</strong>{{ selectedUser.email }}</p>
        <p><strong>当前角色：</strong>{{ selectedUser.role }}</p>
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2">分配角色 <span class="text-red-500">*</span></label>
        <el-select v-model="newRole" placeholder="请选择角色" class="w-64">
          <el-option
            v-for="item in roleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="mb-6">
  <label class="block text-gray-700 text-sm font-bold mb-2">分配权限 <span class="text-red-500">*</span></label>
  <el-form-item label="分配权限">
    <div class="grid grid-cols-2 gap-4">
      <el-checkbox
        v-for="item in permissionOptions"
        :key="item.key"
        v-model="newPermissions[item.key]"
      >
        {{ item.label }}
      </el-checkbox>
    </div>
  </el-form-item>
</div>

    <div class="mt-6">
  <h4 class="font-bold mb-2">已勾选权限：</h4>
  <ul class="list-disc pl-5">
<li
  v-for="item in permissionOptions"
  :key="item.key"
>
  <span v-if="newPermissions[item.key]">
    {{ item.label }}
  </span>
</li>
  </ul>
</div>

      <div class="flex justify-between">
        <button @click="selectedUser = null" class="btn btn-secondary">返回</button>
        <button @click="updateUserRole" class="btn btn-primary">保存</button>
      </div>
    </div>
  </div>
</template>
