// stores/contractStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Contract } from '../types/contract'
import type { ContractProcess } from '../types/contractprocess'
import axiosInstance from '../utils/getContract'
export const useContractStore = defineStore('contract', () => {
  const contracts = ref<Contract[]>([])
  const contractsprocess = ref<ContractProcess[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fetchContracts = async (status?: string) => {
    loading.value = true
    error.value = null
    try {
      const response = await axiosInstance.post('/contract/detail', {
       status: status || 'all'
      })
      contracts.value = response.data.data
    } catch (err: any) {
      error.value = err.message || '获取合同失败'
    } finally {
      loading.value = false
    }
  }
  const fetchContractsprocess = async (
    status?: string) => {
    loading.value = true
    error.value = null
  
    try {
      const response = await axiosInstance.post('/contract/process', {
        status: status || 'all'
      })
      contractsprocess.value = response.data.data
    } catch (err: any) {
      error.value = err.message || '获取合同流程失败'
    } finally {
      loading.value = false
    }
  }
  return {
    contracts,
    contractsprocess,
    loading,
    error,
    fetchContracts,
    fetchContractsprocess
  }
})
