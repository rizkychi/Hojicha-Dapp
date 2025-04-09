"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { TransactionList } from "@/components/transaction/transaction-list"
import { TransactionFilter } from "@/components/transaction/transaction-filter"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import type { Transaction } from "@/types/transaction"
import { BackButton } from "@/components/back-button"
import { Skeleton } from "@/components/ui/skeleton"

export default function TransactionHistoryPage() {
  const { isConnected, transactions, loadTransactions, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()

  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])
  const [filters, setFilters] = useState({
    tokenAddress: "",
    type: "all",
  })
  const [isLoading, setIsLoading] = useState(true)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const transactionsPerPage = 5
  const [paginatedTransactions, setPaginatedTransactions] = useState<Transaction[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    } else {
      fetchData()
    }
  }, [isConnected, router])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      await Promise.all([loadUserTokens(), loadTransactions()])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    await fetchData()
  }

  useEffect(() => {
    let filtered = [...transactions]

    if (filters.tokenAddress) {
      filtered = filtered.filter((tx) => tx.tokenAddress === filters.tokenAddress)
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((tx) => tx.type === filters.type)
    }

    setFilteredTransactions(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [transactions, filters])

  // Handle pagination
  useEffect(() => {
    const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
    setTotalPages(totalPages || 1) // Ensure at least 1 page even if no transactions

    const startIndex = (currentPage - 1) * transactionsPerPage
    const endIndex = startIndex + transactionsPerPage
    setPaginatedTransactions(filteredTransactions.slice(startIndex, endIndex))
  }, [filteredTransactions, currentPage])

  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }))
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <BackButton />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transaction History</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>

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
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-5 w-5 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16 mt-1" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <div className="flex justify-between text-xs">
                          <Skeleton className="h-3 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <TransactionList transactions={paginatedTransactions} />
              )}

              {/* Pagination controls */}
              {filteredTransactions.length > 0 && !isLoading && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {paginatedTransactions.length} of {filteredTransactions.length} transactions
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-muted-foreground">Track all your token transactions in one place</p>
      </div>
    </Layout>
  )
}
