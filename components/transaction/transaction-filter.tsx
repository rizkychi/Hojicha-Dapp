"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Token } from "@/types/token"

interface TransactionFilterProps {
  tokens: Token[]
  selectedToken: string
  selectedType: string
  onTokenChange: (value: string) => void
  onTypeChange: (value: string) => void
}

export function TransactionFilter({
  tokens,
  selectedToken,
  selectedType,
  onTokenChange,
  onTypeChange,
}: TransactionFilterProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <Select value={selectedToken} onValueChange={onTokenChange}>
          <SelectTrigger className="rounded-lg border-hojicha-light-brown/50 focus:ring-hojicha-brown">
            <SelectValue placeholder="All Tokens" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tokens</SelectItem>
            {tokens.map((token) => (
              <SelectItem key={token.address} value={token.address}>
                {token.name} ({token.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-48">
        <Select value={selectedType} onValueChange={onTypeChange}>
          <SelectTrigger className="rounded-lg border-hojicha-light-brown/50 focus:ring-hojicha-brown">
            <SelectValue placeholder="All Transactions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="sent">Sent</SelectItem>
            <SelectItem value="received">Received</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
