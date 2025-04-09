"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useWeb3 } from "@/components/providers/web3-provider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Cup } from "@/components/icons/cup"
import { Button } from "@/components/ui/button"
import { ChevronDown, Copy, Check, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Footer } from "@/components/footer"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isConnected, ensureCorrectNetwork, isCorrectNetwork, account, disconnect, networkName, teaBalance } =
    useWeb3()
  const router = useRouter()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
      return
    }

    const checkNetwork = async () => {
      try {
        await ensureCorrectNetwork()
      } catch (error: any) {
        toast({
          title: "Network Error",
          description: error.message || "Please switch to Tea Sepolia network",
          variant: "destructive",
        })
      }
    }

    checkNetwork()
  }, [isConnected, router, ensureCorrectNetwork, toast])

  if (!isConnected) {
    return null
  }

  if (!isCorrectNetwork) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-hojicha-beige p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-8 text-center">
          <div className="mb-6">
            <Cup className="w-16 h-16 text-hojicha-brown mx-auto" />
            <h1 className="text-2xl font-bold mt-4 text-hojicha-dark-brown">Wrong Network</h1>
            <p className="mt-2 text-muted-foreground">
              Please connect to the Tea Sepolia network to use this application.
            </p>
          </div>
          <Button
            onClick={ensureCorrectNetwork}
            className="w-full gradient-header border-0 hover:opacity-90 transition-all"
          >
            Switch to Tea Sepolia
          </Button>
        </div>
      </div>
    )
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)

      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const openExplorer = () => {
    if (account) {
      window.open(`https://sepolia.tea.xyz/address/${account}`, "_blank")
    }
  }

  // Format TEA balance to 4 decimal places
  const formattedTeaBalance = teaBalance ? Number.parseFloat(teaBalance).toFixed(4) : "0"

  return (
    <div className="min-h-screen flex flex-col bg-hojicha-beige">
      <header className="gradient-header text-white p-4 rounded-b-2xl">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
              <Cup className="w-6 h-6" />
              <h1 className="text-2xl font-bold">Hojicha</h1>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    className="bg-white text-hojicha-dark-brown hover:bg-white/90 rounded-full"
                  >
                    <span className="mr-2">{formattedTeaBalance} TEA</span>
                    <Cup className="w-4 h-4 text-hojicha-brown" />
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72">
                  <DropdownMenuLabel>Wallet Info</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Address:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-mono">{shortenAddress(account)}</span>
                        <button
                          onClick={copyToClipboard}
                          className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                          title="Copy address"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={openExplorer}
                          className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                          title="View on Explorer"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">Network:</span>
                      <span className="text-sm">{networkName || "Tea Sepolia"}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm text-muted-foreground">Native Balance:</span>
                      <span className="text-sm font-medium">{formattedTeaBalance} TEA</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={disconnect}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6 fade-in">{children}</main>
      <Footer />
    </div>
  )
}
