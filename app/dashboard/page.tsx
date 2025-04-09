"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { DashboardCard } from "@/components/dashboard/dashboard-card"
import { PlusCircle, ArrowRightLeft, Users, History, Droplets, ImageIcon, UserCheck, HelpCircle } from "lucide-react"

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
      icon: <PlusCircle className="w-10 h-10 text-emerald-600" />,
      href: "/create-token",
      description: "Create your own ERC20 token with custom name and supply",
      isExternal: false,
      iconBgColor: "bg-emerald-100",
    },
    {
      title: "Transfer Token",
      icon: <ArrowRightLeft className="w-10 h-10 text-blue-600" />,
      href: "/transfer-token",
      description: "Send tokens to any address on the network",
      isExternal: false,
      iconBgColor: "bg-blue-100",
    },
    {
      title: "Batch Transfer",
      icon: <Users className="w-10 h-10 text-indigo-600" />,
      href: "/batch-transfer",
      description: "Send tokens to multiple recipients at once",
      isExternal: false,
      iconBgColor: "bg-indigo-100",
    },
    {
      title: "Transaction History",
      icon: <History className="w-10 h-10 text-purple-600" />,
      href: "/transaction-history",
      description: "View your token transaction history",
      isExternal: false,
      iconBgColor: "bg-purple-100",
    },
    {
      title: "TEA Faucet",
      icon: <Droplets className="w-10 h-10 text-cyan-600" />,
      href: "https://faucet-sepolia.tea.xyz/",
      description: "Get free TEA tokens for testing",
      isExternal: true,
      iconBgColor: "bg-cyan-100",
    },
    {
      title: "Create NFT",
      icon: <ImageIcon className="w-10 h-10 text-pink-600" />,
      href: "https://nftea-maker.vercel.app/",
      description: "Create and mint your own NFTs on Tea network",
      isExternal: true,
      iconBgColor: "bg-pink-100",
    },
    {
      title: "KYC Addresses",
      icon: <UserCheck className="w-10 h-10 text-amber-600" />,
      href: "https://tea.daov.xyz/kyc-address",
      description: "Verify your identity for compliant token transfers",
      isExternal: true,
      iconBgColor: "bg-amber-100",
    },
    {
      title: "About",
      icon: <HelpCircle className="w-10 h-10 text-gray-600" />,
      href: "/about",
      description: "Learn about this application and Tea network",
      isExternal: false,
      iconBgColor: "bg-gray-100",
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
                <div onClick={() => handleExternalLink(item.href)} className="cursor-pointer">
                  <DashboardCard
                    title={item.title}
                    icon={item.icon}
                    description={item.description}
                    iconBgColor={item.iconBgColor}
                  />
                </div>
              ) : (
                <DashboardCard
                  title={item.title}
                  icon={item.icon}
                  href={item.href}
                  description={item.description}
                  iconBgColor={item.iconBgColor}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
