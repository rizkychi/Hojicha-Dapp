"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { TokenSelect } from "@/components/token/token-select"
import { BackButton } from "@/components/back-button"

export default function TransferTokenPage() {
  const { isConnected, transferToken, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tokenAddress: "",
    recipient: "",
    amount: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    } else {
      loadUserTokens()
    }
  }, [isConnected, router, loadUserTokens])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTokenSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, tokenAddress: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tokenAddress || !formData.recipient || !formData.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    // Basic address validation
    if (!formData.recipient.startsWith("0x") || formData.recipient.length !== 42) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await transferToken(formData.tokenAddress, formData.recipient, formData.amount)

      toast({
        title: "Success!",
        description: `${formData.amount} tokens transferred successfully`,
      })

      setFormData((prev) => ({
        ...prev,
        recipient: "",
        amount: "",
      }))

      // Reload user tokens
      await loadUserTokens()
    } catch (error: any) {
      toast({
        title: "Error transferring tokens",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const selectedToken = userTokens.find((token) => token.address === formData.tokenAddress)

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <BackButton />

        <h2 className="text-xl font-bold mb-4">Transfer Token</h2>

        <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenAddress">Select Token</Label>
                <TokenSelect tokens={userTokens} value={formData.tokenAddress} onValueChange={handleTokenSelect} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient Address</Label>
                <Input
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleChange}
                  placeholder="0x..."
                  className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="amount">Amount</Label>
                  {selectedToken && (
                    <span className="text-sm text-muted-foreground">
                      Balance: {selectedToken.balance} {selectedToken.symbol}
                    </span>
                  )}
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                />
              </div>

              <Button
                type="submit"
                className="w-full gradient-header border-0 hover:opacity-90 transition-all"
                disabled={isLoading || !formData.tokenAddress}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Transferring...
                  </>
                ) : (
                  "Transfer"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}
