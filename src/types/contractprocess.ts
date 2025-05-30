export interface ContractProcess {
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
    signlocation?: string
    ourrepresentative?: string
    customerrepresentative?: string
    signremark?: string
}