export interface Contract {
    name: string
    code: string
    customer: string
    beginDate: string
    endDate: string
    status: string
    content?: string
    fileUrl?: string //储存的是连接
    amount: number
  }
  