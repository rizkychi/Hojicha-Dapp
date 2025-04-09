"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/back-button"
import { ExternalLink } from "lucide-react"

export default function AboutPage() {
  const { isConnected } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const openLink = (url: string) => {
    window.open(url, "_blank")
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto fade-in">
        <BackButton />

        <h2 className="text-xl font-bold mb-4">About Hojicha DApp</h2>

        <div className="space-y-6">
          <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Smart Contract Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Contract Address</h3>
                  <div className="flex items-center justify-between bg-hojicha-beige p-3 rounded-lg">
                    <code className="text-xs sm:text-sm font-mono">0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975</code>
                    <button
                      onClick={() =>
                        openLink("https://sepolia.tea.xyz/address/0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975")
                      }
                      className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                      title="View on Explorer"
                    >
                      <ExternalLink size={16} />
                    </button>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Contract Features</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Create custom ERC20 tokens</li>
                    <li>Transfer tokens to other addresses</li>
                    <li>Batch transfer tokens to multiple recipients</li>
                    <li>View token balances and transaction history</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Tea Network Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm">
                  Tea is a new layer-1 blockchain designed for developers. It offers a familiar environment with EVM
                  compatibility, while providing improved performance and developer experience.
                </p>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tea Sepolia Testnet</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Chain ID: 0x27ea (10218)</li>
                    <li>Currency Symbol: TEA</li>
                    <li>RPC URL: https://tea-sepolia.g.alchemy.com/public</li>
                    <li>Block Explorer: https://sepolia.tea.xyz</li>
                  </ul>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => openLink("https://tea.xyz")}
                    className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors text-sm flex items-center gap-1"
                  >
                    <span>Learn more about Tea</span>
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">Developer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Rizky Chi</h3>
                    <p className="text-sm text-muted-foreground">Blockchain Developer</p>
                  </div>
                  <button
                    onClick={() => openLink("https://github.com/rizkychi")}
                    className="text-hojicha-brown hover:text-hojicha-brown/80 transition-colors"
                    title="GitHub Profile"
                  >
                    <ExternalLink size={16} />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
            <CardHeader>
              <CardTitle className="text-lg">License Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm">This application is licensed under the MIT License.</p>
                <p className="text-sm text-muted-foreground">
                  Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
                  associated documentation files, to deal in the Software without restriction, including without
                  limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
                  of the Software.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}
