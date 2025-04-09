"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { CreateTokenIcon } from "@/components/icons/create-token-icon"
import { TransferIcon } from "@/components/icons/transfer-icon"
import { BatchTransferIcon } from "@/components/icons/batch-transfer-icon"
import { HistoryIcon } from "@/components/icons/history-icon"
import { FaucetIcon } from "@/components/icons/faucet-icon"
import { NftIcon } from "@/components/icons/nft-icon"
import { AboutIcon } from "@/components/icons/about-icon"

export default function DashboardPage() {
  const { isConnected } = useWeb3()
  const router = useRouter()

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    }
  }, [isConnected, router])

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank")
  }

  const dashboardItems = [
    {
      title: "Create Token",
      icon: <CreateTokenIcon className="w-12 h-12" />,
      href: "/create-token",
      description: "Create your own ERC20 token with custom name and supply",
      isExternal: false,
    },
    {
      title: "Transfer Token",
      icon: <TransferIcon className="w-12 h-12" />,
      href: "/transfer-token",
      description: "Send tokens to any address on the network",
      isExternal: false,
    },
    {
      title: "Batch Transfer",
      icon: <BatchTransferIcon className="w-12 h-12" />,
      href: "/batch-transfer",
      description: "Send tokens to multiple recipients at once",
      isExternal: false,
    },
    {
      title: "Transaction History",
      icon: <HistoryIcon className="w-12 h-12" />,
      href: "/transaction-history",
      description: "View your token transaction history",
      isExternal: false,
    },
    {
      title: "TEA Faucet",
      icon: <FaucetIcon className="w-12 h-12" />,
      href: "https://faucet-sepolia.tea.xyz/",
      description: "Get free TEA tokens for testing",
      isExternal: true,
    },
    {
      title: "Create NFT",
      icon: <NftIcon className="w-12 h-12" />,
      href: "https://nftea-maker.vercel.app/",
      description: "Create and mint your own NFTs on Tea network",
      isExternal: true,
    },
    {
      title: "About",
      icon: <AboutIcon className="w-12 h-12" />,
      href: "/about",
      description: "Learn about this application and Tea network",
      isExternal: false,
    },
  ]

  return (
    <Layout>
      <div className="max-w-3xl mx-auto fade-in">
        <h2 className="text-xl font-bold mb-4">Select Feature</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {dashboardItems.map((item, index) => (
            <div key={item.title} className="fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              {item.isExternal ? (
                <div onClick={() => handleExternalLink(item.href)}>
                  <DashboardCard title={item.title} icon={item.icon} description={item.description} />
                </div>
              ) : (
                <DashboardCard title={item.title} icon={item.icon} href={item.href} description={item.description} />
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
