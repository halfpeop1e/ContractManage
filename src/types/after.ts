export interface afterContract {
  // 基本信息
  name: string
  code: string
  customer: string
  beginDate: string
  endDate: string
  status: string
  content?: string
  fileUrl?: string
  amount: number

  // 流程信息
  drafter?: string
  drafttime?: string
  cosigner?: string
  cosigntime?: string
  cosigncontent?: string
  approver?: string
  approvetime?: string
  approvalResult?: string
  approvalComment?: string
  finalizer?: string
  finalizetime?: string
  signer?: string
  signtime?: string
  signlocation?: string
  ourrepresentative?: string
  customerrepresentative?: string
  signremark?: string
}
