"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Token } from "@/types/token"
import { ExternalLink } from "lucide-react"

interface TokenListProps {
  tokens: Token[]
}

export function TokenList({ tokens }: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tokens found. Create your first token to get started.
      </div>
    )
  }

  const openExplorer = (address: string) => {
    window.open(`https://sepolia.tea.xyz/address/${address}`, "_blank")
  }

  return (
    <div className="space-y-4">
      {tokens.map((token, index) => (
        <Card
          key={token.address}
          className="rounded-xl shadow-sm border-gray-100 bg-white slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{token.name}</h3>
                <p className="text-sm text-muted-foreground">{token.symbol}</p>
              </div>
              <button
                onClick={() => openExplorer(token.address)}
                className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                title="View on Explorer"
              >
                <ExternalLink size={16} />
              </button>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-sm">
                <span>Balance:</span>
                <span className="font-medium">
                  {token.balance} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span>Total Supply:</span>
                <span className="font-medium">
                  {token.totalSupply || token.balance} {token.symbol}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                <span>Address:</span>
                <span className="font-mono">
                  {token.address.slice(0, 8)}...{token.address.slice(-6)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
