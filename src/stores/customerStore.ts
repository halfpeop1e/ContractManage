import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { customers } from '../types/customer' 
import axiosInstance from '../utils/getCustomers'
export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<customers[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fetchCustomers = async () => {
    try {
      const response = await axiosInstance.get('/customer/detail')
      customers.value = response.data.data
    } catch (err: any) {
      error.value = err.message || '获取合同失败'
    } finally {
      loading.value = false
    }
}
  return {
    customers,
    loading,
    error,
    fetchCustomers
  }
})