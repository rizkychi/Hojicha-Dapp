export interface Transaction {
  hash: string
  tokenAddress: string
  tokenName: string
  tokenSymbol: string
  amount: string
  type: "sent" | "received"
  counterparty: string
  timestamp: number
}
