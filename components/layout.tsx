"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useWeb3 } from "@/components/providers/web3-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { ChevronDown } from "lucide-react"
import { Footer } from "@/components/footer"
import { WalletModal } from "@/components/wallet-modal"
import { CupSoda } from "lucide-react"
import { Cup } from "@/components/icons/cup"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const {
    isConnected,
    ensureCorrectNetwork,
    isCorrectNetwork,
    account,
    teaBalance,
    showWalletModal,
    setShowWalletModal,
  } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()
  const [showNetworkWarning, setShowNetworkWarning] = useState(false)
  const networkCheckAttempted = useRef(false)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
      return
    }

    // Only check network once to prevent reload loops
    if (!networkCheckAttempted.current) {
      networkCheckAttempted.current = true

      const checkNetwork = async () => {
        try {
          await ensureCorrectNetwork()
        } catch (error: any) {
          setShowNetworkWarning(true)
          toast({
            title: "Network Error",
            description: error.message || "Please switch to Tea Sepolia network",
            variant: "destructive",
          })
        }
      }

      checkNetwork()
    }
  }, [isConnected, router, ensureCorrectNetwork, toast])

  if (!isConnected) {
    return null
  }

  if (!isCorrectNetwork && showNetworkWarning) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-hojicha-beige p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="mb-6">
            <CupSoda className="w-16 h-16 text-hojicha-brown mx-auto" />
            <h1 className="text-2xl font-bold mt-4 text-hojicha-dark-brown">Wrong Network</h1>
            <p className="mt-2 text-muted-foreground">
              Please connect to the Tea Sepolia network to use this application.
            </p>
          </div>
          <Button
            onClick={async () => {
              try {
                await ensureCorrectNetwork()
                setShowNetworkWarning(false)
              } catch (error) {
                console.error("Failed to switch network:", error)
              }
            }}
            className="w-full gradient-header border-0 hover:opacity-90 transition-all"
          >
            Switch to Tea Sepolia
          </Button>
        </div>
      </div>
    )
  }

  // Format TEA balance to 4 decimal places
  const formattedTeaBalance = teaBalance ? Number.parseFloat(teaBalance).toFixed(4) : "0"

  return (
    <div className="min-h-screen flex flex-col bg-hojicha-beige">
      <header className="gradient-header text-white p-4 rounded-b-2xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
              <Cup className="w-10 h-10" />
              <h1 className="text-2xl font-bold">Hojicha</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                className="bg-white text-hojicha-dark-brown hover:bg-white/90 rounded-full"
                onClick={() => setShowWalletModal(true)}
              >
                <span className="mr-2">{formattedTeaBalance} TEA</span>
                <CupSoda className="w-4 h-4 text-hojicha-brown" />
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 fade-in">{children}</main>
      <Footer />

      {/* Wallet Modal */}
      <WalletModal />
    </div>
  )
}
