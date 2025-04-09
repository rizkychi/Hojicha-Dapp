"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction/transaction-list"
import { TransactionFilter } from "@/components/transaction/transaction-filter"
import type { Transaction } from "@/types/transaction"
import { BackButton } from "@/components/back-button"

export default function TransactionHistoryPage() {
  const { isConnected, transactions, loadTransactions, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState({
    tokenAddress: "",
    type: "all",
  })

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    } else {
      loadUserTokens()
      loadTransactions()
    }
  }, [isConnected, router, loadUserTokens, loadTransactions])

  useEffect(() => {
    let filtered = [...transactions]

    if (filters.tokenAddress) {
      filtered = filtered.filter((tx) => tx.tokenAddress === filters.tokenAddress)
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((tx) => tx.type === filters.type)
    }

    setFilteredTransactions(filtered)
  }, [transactions, filters])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <BackButton />

        <h2 className="text-xl font-bold mb-4">Transaction History</h2>

        <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
          <CardContent className="p-6">
            <TransactionFilter
              tokens={userTokens}
              selectedToken={filters.tokenAddress}
              selectedType={filters.type}
              onTokenChange={(value) => handleFilterChange("tokenAddress", value)}
              onTypeChange={(value) => handleFilterChange("type", value)}
            />

            <div className="mt-6">
              <TransactionList transactions={filteredTransactions} />
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-muted-foreground">Track all your token transactions in one place</p>
      </div>
    </Layout>
  )
}
