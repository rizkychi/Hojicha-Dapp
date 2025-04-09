"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Token } from "@/types/token"

interface TokenSelectProps {
  tokens: Token[]
  value: string
  onValueChange: (value: string) => void
}

export function TokenSelect({ tokens, value, onValueChange }: TokenSelectProps) {
  if (tokens.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="rounded-lg border-gray-200 focus:ring-hojicha-brown">
          <SelectValue placeholder="No tokens available" />
        </SelectTrigger>
      </Select>
    )
  }

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="rounded-lg border-gray-200 focus:ring-hojicha-brown">
        <SelectValue placeholder="Select a token" />
      </SelectTrigger>
      <SelectContent>
        {tokens.map((token) => (
          <SelectItem key={token.address} value={token.address}>
            {token.name} ({token.symbol})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
