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
      const response = await axiosInstance.get('/contract/detail', {
        params: status ? { status } : {}
      })
      contracts.value = response.data.data
    } catch (err: any) {
      error.value = err.message || '获取合同失败'
    } finally {
      loading.value = false
    }
  }
  const fetchContractsprocess = async (
    status?: string,drafter?: string,cosigner?: string, approver?: string,finalizer?: string,signer?: string) => {
    loading.value = true
    error.value = null
    const params: Record<string, string> = {}
    if (status) params.status = status
    if (drafter) params.drafter = drafter
    if (cosigner) params.cosigner = cosigner
    if (approver) params.approver = approver
    if (finalizer) params.finalizer = finalizer
    if (signer) params.signer = signer
  
    try {
      const response = await axiosInstance.get('/contract/process', { params })
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
