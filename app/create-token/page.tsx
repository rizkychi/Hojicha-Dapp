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
import { TokenList } from "@/components/token/token-list"
import { BackButton } from "@/components/back-button"

export default function CreateTokenPage() {
  const { isConnected, createToken, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    symbol: "",
    initialSupply: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.symbol || !formData.initialSupply) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await createToken(formData.name, formData.symbol, formData.initialSupply)

      toast({
        title: "Success!",
        description: `Token ${formData.name} (${formData.symbol}) created successfully`,
      })

      setFormData({
        name: "",
        symbol: "",
        initialSupply: "",
      })

      // Reload user tokens
      await loadUserTokens()
    } catch (error: any) {
      toast({
        title: "Error creating token",
        description: error.message || "Something went wrong",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <BackButton />

        <h2 className="text-xl font-bold mb-4">Create Token</h2>

        <div className="space-y-6">
          <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Token Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symbol">Token Symbol</Label>
                  <Input
                    id="symbol"
                    name="symbol"
                    value={formData.symbol}
                    onChange={handleChange}
                    className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="initialSupply">Initial Supply</Label>
                  <Input
                    id="initialSupply"
                    name="initialSupply"
                    type="number"
                    value={formData.initialSupply}
                    onChange={handleChange}
                    className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full gradient-header border-0 hover:opacity-90 transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Token"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div>
            <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
            <TokenList tokens={userTokens} />
          </div>
        </div>
      </div>
    </Layout>
  )
}
