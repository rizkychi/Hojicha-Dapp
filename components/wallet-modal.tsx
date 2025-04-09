"use client"

import { useWeb3 } from "@/components/providers/web3-provider"
import { Button } from "@/components/ui/button"
import { Copy, Check, ExternalLink, X } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { CupSodaIcon as Cup } from "lucide-react"

export function WalletModal() {
  const { account, disconnect, networkName, teaBalance, showWalletModal, setShowWalletModal } = useWeb3()
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  if (!showWalletModal) return null

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={() => setShowWalletModal(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-hojicha-peach flex items-center justify-center mb-4">
            <Cup className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-xl font-bold">{shortenAddress(account)}</h2>
          <p className="text-gray-500">{formattedTeaBalance} TEA</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" className="flex items-center justify-center gap-2 py-6" onClick={copyToClipboard}>
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            <span>Copy Address</span>
          </Button>

          <Button variant="outline" className="flex items-center justify-center gap-2 py-6" onClick={disconnect}>
            <span>Disconnect</span>
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Network:</span>
            <span className="text-sm font-medium">{networkName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">View on Explorer:</span>
            <button
              onClick={openExplorer}
              className="text-blue-500 hover:text-blue-700 transition-colors flex items-center gap-1"
            >
              <span className="text-sm">Explorer</span>
              <ExternalLink className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
