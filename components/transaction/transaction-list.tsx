"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { Transaction } from "@/types/transaction"
import { formatDistanceToNow } from "date-fns"
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react"

interface TransactionListProps {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No transactions found.</div>
  }

  const openExplorer = (hash: string) => {
    window.open(`https://sepolia.tea.xyz/tx/${hash}`, "_blank")
  }

  return (
    <div className="space-y-4">
      {transactions.map((tx, index) => (
        <Card
          key={tx.hash}
          className="rounded-xl shadow-sm border-gray-100 bg-white slide-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {tx.type === "sent" ? (
                  <ArrowUpRight className="text-red-500" size={20} />
                ) : (
                  <ArrowDownRight className="text-green-500" size={20} />
                )}
                <div>
                  <h3 className="font-medium">
                    {tx.type === "sent" ? "Sent" : "Received"} {tx.tokenSymbol}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {tx.type === "sent" ? "-" : "+"}
                  {tx.amount} {tx.tokenSymbol}
                </span>
                <button
                  onClick={() => openExplorer(tx.hash)}
                  className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                  title="View on Explorer"
                >
                  <ExternalLink size={16} />
                </button>
              </div>
            </div>
            <div className="mt-2 pt-2 border-t border-gray-100">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Tx Hash:</span>
                <span className="font-mono">
                  {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                </span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">{tx.type === "sent" ? "To:" : "From:"}</span>
                <span className="font-mono">
                  {tx.counterparty.slice(0, 8)}...{tx.counterparty.slice(-6)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
