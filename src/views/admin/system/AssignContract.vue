<script setup lang="ts">
import { ref, computed, onMounted ,watch} from 'vue';
import { useContractStore } from '../../../stores/contractStore';
import { useUserStore } from '../../../stores/userStore';
import axiosInstance from '../../../utils/getUser';
import type { User } from '../../../types/user';

const contractStore = useContractStore();
const userStore = useUserStore();

const currentUserId = ref('真实用户ID');
const selectedStage = ref('countersign');
const allUsers = ref<User[]>([]);

interface contrctall {
  code: string
  status: string
  drafter?: string
  drafttime?: string
  cosigner?: string
  cosigntime?: string
  cosigncontent?: string
  approver?: string
  approvetime?: string
  finalizer?: string
  finalizetime?: string
  signer?: string
  signtime?: string
  id: number
  name: string
  customer: string
  beginDate: string
  endDate: string
  content?: string
  amount: number
}

function setStage(stage: string) {
  selectedStage.value = stage;
}

const fetchAllUsers = async () => {
  try {
    const response = await axiosInstance.get('/user/alldetail');
    if (Array.isArray(response.data.data)) {
      userStore.users = response.data.data;
      allUsers.value = response.data.data;
    } else {
      console.error('接口返回的不是数组:', response.data.data);
    }
  } catch (err) {
    console.error('获取用户失败:', err);
  }
};




const permissionMap = {
  countersign: 'countersign',
  finalize: 'finalize',
  approve: 'approve',
  sign: 'sign'
};

const hasPermission = (user: User, permission: string) => {
  return user.permission && user.permission[permission] === true;
};


const assignmentDialogVisible = ref(false);
const selectedContract = ref<contrctall | null>(null);

const assignableUsers = ref<User[]>([]);
const targetUser = ref<string[]>([]);
watch(targetUser, (newVal) => {
  if (newVal.length > 1) {
    targetUser.value = [newVal[0]];
  }
});
const openAssignmentDialog = (contract: contrctall) => {
  selectedContract.value = Array.isArray(contract) ? contract[0] : contract;
  const perm = permissionMap[selectedStage.value];
  assignableUsers.value = allUsers.value.filter(user => hasPermission(user, perm));
  targetUser.value = [];
  assignmentDialogVisible.value = true;
};

const submitAssignment = async () => {
   if (!targetUser.value.length) return;
  const selectedUser = allUsers.value.find(user => user.name === targetUser.value[0]);
  if (!selectedUser) return;
  const fieldMap = {
    countersign: 'cosigner',
    finalize: 'finalizer',
    approve: 'approver',
    sign: 'signer'
  };
  const field = fieldMap[selectedStage.value];
console.log('分配成功:', selectedContract.value!.code, '给用户:', selectedUser.name,'阶段:', selectedStage.value);
  await axiosInstance.post('/contract/assign', {
    code: selectedContract.value!.code,
    [field]: selectedUser.name
  });
 
  assignmentDialogVisible.value = false;
  await contractStore.fetchContracts();
  await contractStore.fetchContractsprocess();
};
onMounted(() => {
  contractStore.fetchContracts();
  contractStore.fetchContractsprocess();
  console.log('当前用户ID:', currentUserId.value);
  console.log('合同数据:', contractStore.contracts);
  console.log('合同流程数据:', contractStore.contractsprocess);
  fetchAllUsers();
});
const mergedContracts = computed(() => {
  if (!contractStore.contracts || !contractStore.contractsprocess) {
    console.warn('合同或流程数据为空');
    return [];
  }
  const processMap = new Map(contractStore.contractsprocess.map(item => [item.code, item]));
  return contractStore.contracts.map(contract => ({
    ...contract,
    ...(processMap.get(contract.code) || {})
  }));
});
console.log('合并后的合同数据:', mergedContracts.value);

const filteredContracts = computed(() => {
  return mergedContracts.value.filter(contract => {
    switch (selectedStage.value) {
      case 'countersign':
        return contract.status === '待会签' && contract.drafter && contract.drafttime && !contract.cosigner;
      case 'finalize':
        return contract.status === '待定稿' && contract.cosigner && contract.cosigntime && !contract.finalizer;
      case 'approve':
        return contract.status === '待审核' && contract.finalizer && contract.finalizetime && !contract.approver;
      case 'sign':
        return contract.status === '待签订' && contract.approver && contract.approvetime && !contract.signer;
      default:
        return false;
    }
  });
});
console.log('筛选后的合同数据:', filteredContracts.value); 
</script>

<template>
  <div class="p-6 bg-white rounded-2xl shadow-lg">
    <!-- 顶部阶段选择按钮 -->
    <div class="mb-6 flex flex-wrap gap-3 justify-center">
      <el-button
        type="primary"
        size="large"
        plain
        :class="{ 'is-active': selectedStage === 'countersign' }"
        @click="setStage('countersign')"
      >
        分配待会签
      </el-button>
      <el-button
        type="success"
        size="large"
        plain
        :class="{ 'is-active': selectedStage === 'finalize' }"
        @click="setStage('finalize')"
      >
        分配待定稿
      </el-button>
      <el-button
        type="warning"
        size="large"
        plain
        :class="{ 'is-active': selectedStage === 'approve' }"
        @click="setStage('approve')"
      >
        分配待审核
      </el-button>
      <el-button
        type="danger"
        size="large"
        plain
        :class="{ 'is-active': selectedStage === 'sign' }"
        @click="setStage('sign')"
      >
        分配待签订
      </el-button>
    </div>

    <!-- 合同表格 -->
    <el-table
      :data="filteredContracts"
      stripe
      border
      highlight-current-row
      class="w-full"
    >
      <el-table-column prop="code" label="合同编号" width="180" />
      <el-table-column prop="name" label="合同名称" />
      <el-table-column prop="customer" label="客户名称" />
      <el-table-column label="操作" width="120">
        <template #default="scope">
          <el-button
            type="primary"
            size="medium"
            @click="openAssignmentDialog(scope.row)"
          >
            分配
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配弹窗 -->
    <el-dialog v-model="assignmentDialogVisible" title="选择用户分配" width="80%" class="justify-center">
      <div class="p-4">
        <el-transfer class="justify-center"
          v-model="targetUser"
          filterable
          filter-placeholder="请输入用户名"
          :data="assignableUsers"
          :props="{ key: 'name', label: 'name' }"
          :titles="['可选用户', '已选用户']"
        />
      </div>

      <template #footer>
        <div class="text-right justify-center">
          <el-button @click="assignmentDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAssignment">确认分配</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.p-button {
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.p-button:hover {
  background-color: #2563eb;
}

</style>
