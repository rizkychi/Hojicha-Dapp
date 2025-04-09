"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Button } from "@/components/ui/button"
import { Cup } from "@/components/icons/cup"

export default function WelcomePage() {
  const { isConnected, connect } = useWeb3()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard")
    }
  }, [isConnected, router])

  const handleConnect = async () => {
    setIsLoading(true)
    try {
      await connect()
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
      <div className="w-full max-w-md mx-auto text-center space-y-8 fade-in">
        <div className="gradient-header rounded-2xl p-8 text-white">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cup className="w-10 h-10" />
            <h1 className="text-3xl font-bold">Hojicha</h1>
          </div>
          <p className="text-white/80">Create and manage tokens on Tea Sepolia</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold mb-6 text-hojicha-dark-brown">Manage Your Tokens</h2>
          <p className="text-muted-foreground mb-8">Create new tokens and perform transfers with ease.</p>

          <Button
            size="lg"
            className="w-full text-xl py-6 gradient-header border-0 hover:opacity-90 transition-all pulse"
            onClick={handleConnect}
            disabled={isLoading}
          >
            {isLoading ? "Connecting..." : "Connect Wallet"}
          </Button>
        </div>
      </div>
    </div>
  )
}
