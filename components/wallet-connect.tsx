"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut, ExternalLink } from "lucide-react"

interface WalletConnectProps {
  isConnected: boolean
  account: string
  network: string
  onConnect: () => Promise<void>
  onDisconnect: () => void
}

export default function WalletConnect({ isConnected, account, network, onConnect, onDisconnect }: WalletConnectProps) {
  // Fungsi untuk mempersingkat alamat wallet
  const shortenAddress = (address: string) => {
    return address.slice(0, 6) + "..." + address.slice(-4)
  }

  // Fungsi untuk membuka explorer blockchain
  const openExplorer = () => {
    let explorerUrl = ""

    // Tentukan URL explorer berdasarkan jaringan
    if (network === "homestead") {
      explorerUrl = `https://etherscan.io/address/${account}`
    } else if (network === "matic") {
      explorerUrl = `https://polygonscan.com/address/${account}`
    } else if (network === "arbitrum") {
      explorerUrl = `https://arbiscan.io/address/${account}`
    } else {
      explorerUrl = `https://etherscan.io/address/${account}`
    }

    window.open(explorerUrl, "_blank")
  }

  return (
    <div className="space-y-4">
      {isConnected ? (
        <>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Terhubung
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Jaringan:</span>
            <span className="text-sm">{network || "Unknown"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Alamat:</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono">{shortenAddress(account)}</span>
              <button onClick={openExplorer} className="text-blue-500 hover:text-blue-700" title="Lihat di Explorer">
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={onDisconnect}>
            <LogOut className="mr-2 h-4 w-4" />
            Putuskan Koneksi
          </Button>
        </>
      ) : (
        <Button className="w-full" onClick={onConnect}>
          <Wallet className="mr-2 h-4 w-4" />
          Hubungkan Wallet
        </Button>
      )}
    </div>
  )
}
