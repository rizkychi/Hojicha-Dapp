"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Button } from "@/components/ui/button"
import { Cup } from "@/components/icons/cup"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { account, disconnect } = useWeb3()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Create Token", path: "/create-token" },
    { name: "Transfer Token", path: "/transfer-token" },
    { name: "Batch Transfer", path: "/batch-transfer" },
    { name: "Transaction History", path: "/transaction-history" },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <nav className="bg-hojicha-brown text-hojicha-beige py-4 px-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Cup className="w-6 h-6" />
          <Link href="/dashboard" className="text-xl font-bold">
            Hojicha
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`transition-colors hover:text-white ${pathname === item.path ? "font-bold" : ""}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="text-sm bg-hojicha-beige/20 px-3 py-1 rounded-full">
            {account ? shortenAddress(account) : "Not connected"}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnect}
            className="border-hojicha-beige text-hojicha-beige hover:bg-hojicha-beige hover:text-hojicha-brown"
          >
            Disconnect
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden container mx-auto mt-4 pb-4">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`transition-colors hover:text-white ${pathname === item.path ? "font-bold" : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-hojicha-beige/20 mt-2 flex justify-between items-center">
              <div className="text-sm bg-hojicha-beige/20 px-3 py-1 rounded-full">
                {account ? shortenAddress(account) : "Not connected"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={disconnect}
                className="border-hojicha-beige text-hojicha-beige hover:bg-hojicha-beige hover:text-hojicha-brown"
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
