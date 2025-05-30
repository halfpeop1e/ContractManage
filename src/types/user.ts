import type { Permission } from './permission'
export interface User {
    name: string
    password: string
    email: string
    role: string
    permission: Permission
  }
  