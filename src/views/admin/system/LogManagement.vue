<script setup lang="ts">
import { ref } from 'vue'

// 模拟日志数据
const logs = ref([
  { 
    id: 1, 
    username: '111', 
    action: '起草合同', 
    details: '起草了合同：软件开发合同A', 
    timestamp: '2025-06-10 10:15:30',
  },
  { 
    id: 2, 
    username: 'halfpeople', 
    action: '会签合同', 
    details: '对合同：软件开发合同A 进行了会签', 
    timestamp: '2025-06-11 14:22:45',
  },
  { 
    id: 3, 
    username: 'halfpeople', 
    action: '会签合同', 
    details: '对合同：软件开发合同A 进行了会签', 
    timestamp: '2025-06-12 09:35:12',
  },
  { 
    id: 4, 
    username: 'Klukai', 
    action: '定稿合同', 
    details: '对合同：软件开发合同A 进行了定稿', 
    timestamp: '2025-06-12 16:40:22',
  },
  { 
    id: 5, 
    username: 'Klukai', 
    action: '审批合同', 
    details: '审批通过了合同：软件开发合同A', 
    timestamp: '2025-06-12 17:05:38',
  },
  { 
    id: 6, 
    username: 'Klukai', 
    action: '签订合同', 
    details: '记录了合同：软件开发合同A 的签订信息', 
    timestamp: '2025-06-13 00:03:10',
  },
  { 
    id: 7, 
    username: 'Klukai', 
    action: '权限管理', 
    details: '将用户：halfpeople 的角色修改为：合同操作员', 
    timestamp: '2025-06-13 00:12:55',
  
  }
])

const searchUsername = ref('')
const searchAction = ref('')
const searchStartDate = ref('')
const searchEndDate = ref('')

const filteredLogs = computed(() => {
  return logs.value.filter(log => {
    const matchUsername = searchUsername.value === '' || log.username.includes(searchUsername.value)
    const matchAction = searchAction.value === '' || log.action === searchAction.value
    
    let matchDate = true
    if (searchStartDate.value && searchEndDate.value) {
      const logDate = new Date(log.timestamp.split(' ')[0])
      const startDate = new Date(searchStartDate.value)
      const endDate = new Date(searchEndDate.value)
      matchDate = logDate >= startDate && logDate <= endDate
    } else if (searchStartDate.value) {
      const logDate = new Date(log.timestamp.split(' ')[0])
      const startDate = new Date(searchStartDate.value)
      matchDate = logDate >= startDate
    } else if (searchEndDate.value) {
      const logDate = new Date(log.timestamp.split(' ')[0])
      const endDate = new Date(searchEndDate.value)
      matchDate = logDate <= endDate
    }
    
    return matchUsername && matchAction && matchDate
  })
})

const resetSearch = () => {
  searchUsername.value = ''
  searchAction.value = ''
  searchStartDate.value = ''
  searchEndDate.value = ''
}

const exportLogs = (logs) => {
  alert('日志导出功能已触发')
  const dataStr = JSON.stringify(logs.value, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'logs.json';
  link.click();

  URL.revokeObjectURL(url);
}

const backupLogs = () => {
  alert('日志备份功能已触发')
}

import { computed } from 'vue'
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold mb-6">日志管理</h2>
    
    <div class="card mb-6">
      <h3 class="text-xl font-bold mb-4">日志查询</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-username">
            用户名
          </label>
          <input 
            id="search-username"
            v-model="searchUsername"
            class="form-control"
            type="text" 
            placeholder="请输入用户名"
          >
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-action">
            操作类型
          </label>
          <select 
            id="search-action"
            v-model="searchAction"
            class="form-control"
          >
            <option value="">全部</option>
            <option value="起草合同">起草合同</option>
            <option value="会签合同">会签合同</option>
            <option value="定稿合同">定稿合同</option>
            <option value="审批合同">审批合同</option>
            <option value="签订合同">签订合同</option>
            <option value="权限管理">权限管理</option>
          </select>
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-start-date">
            开始日期
          </label>
          <input 
            id="search-start-date"
            v-model="searchStartDate"
            class="form-control"
            type="date"
          >
        </div>
        
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="search-end-date">
            结束日期
          </label>
          <input 
            id="search-end-date"
            v-model="searchEndDate"
            class="form-control"
            type="date"
          >
        </div>
      </div>
      
      <div class="flex justify-end">
        <button @click="resetSearch" class="btn btn-secondary mr-2">重置</button>
        <button class="btn btn-primary">查询</button>
      </div>
    </div>
    
    <div class="card">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold">日志列表</h3>
        <div>
          <button @click="exportLogs(logs)" class="btn btn-secondary mr-2">导出日志</button>
          <button @click="backupLogs" class="btn btn-primary">备份日志</button>
        </div>
      </div>
      
      <div v-if="filteredLogs.length === 0" class="text-center p-4">
        <p>暂无符合条件的日志</p>
      </div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>用户名</th>
            <th>操作类型</th>
            <th>操作详情</th>
            <th>操作时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="log in filteredLogs" :key="log.id">
            <td>{{ log.id }}</td>
            <td>{{ log.username }}</td>
            <td>{{ log.action }}</td>
            <td>{{ log.details }}</td>
            <td>{{ log.timestamp }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
