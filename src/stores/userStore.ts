import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../types/user'
export const useUserStore = defineStore('user', () => {
  const users = ref<User[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  return {
    users,
    loading,
    error,
  }
})