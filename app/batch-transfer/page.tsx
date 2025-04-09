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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { TokenSelect } from "@/components/token/token-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/back-button"

export default function BatchTransferPage() {
  const { isConnected, batchTransferToken, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    tokenAddress: "",
    recipients: "",
    fixedAmount: "",
    minAmount: "",
    maxAmount: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [transferMode, setTransferMode] = useState<"fixed" | "random">("fixed")
  // Add recipient count display
  const [recipientCount, setRecipientCount] = useState(0)

  useEffect(() => {
    if (!isConnected) {
      router.push("/")
    } else {
      loadUserTokens()
    }
  }, [isConnected, router, loadUserTokens])

  // Update the handleChange function to count recipients
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Count recipients when the recipients field changes
    if (name === "recipients") {
      const count = value
        .split("\n")
        .map((address) => address.trim())
        .filter((address) => address.length > 0).length
      setRecipientCount(count)
    }
  }

  const handleTokenSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, tokenAddress: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tokenAddress || !formData.recipients) {
      toast({
        title: "Validation Error",
        description: "Please select a token and enter recipient addresses",
        variant: "destructive",
      })
      return
    }

    // Parse recipients
    const recipients = formData.recipients
      .split("\n")
      .map((address) => address.trim())
      .filter((address) => address.length > 0)

    if (recipients.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please enter at least one recipient address",
        variant: "destructive",
      })
      return
    }

    // Validate addresses
    const invalidAddresses = recipients.filter((address) => !address.startsWith("0x") || address.length !== 42)
    if (invalidAddresses.length > 0) {
      toast({
        title: "Invalid Addresses",
        description: `Found ${invalidAddresses.length} invalid Ethereum addresses`,
        variant: "destructive",
      })
      return
    }

    // Validate amounts
    if (transferMode === "fixed" && !formData.fixedAmount) {
      toast({
        title: "Missing Amount",
        description: "Please enter an amount to transfer",
        variant: "destructive",
      })
      return
    }

    if (transferMode === "random" && (!formData.minAmount || !formData.maxAmount)) {
      toast({
        title: "Missing Range",
        description: "Please enter both minimum and maximum amounts",
        variant: "destructive",
      })
      return
    }

    if (transferMode === "random" && Number(formData.minAmount) >= Number(formData.maxAmount)) {
      toast({
        title: "Invalid Range",
        description: "Maximum amount must be greater than minimum amount",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      if (transferMode === "fixed") {
        await batchTransferToken(formData.tokenAddress, recipients, formData.fixedAmount)
      } else {
        await batchTransferToken(
          formData.tokenAddress,
          recipients,
          "0", // Will be ignored
          Number(formData.minAmount),
          Number(formData.maxAmount),
        )
      }

      toast({
        title: "Success!",
        description: `Batch transfer to ${recipients.length} recipients completed`,
      })

      // Reload user tokens
      await loadUserTokens()
    } catch (error: any) {
      toast({
        title: "Error in batch transfer",
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

        <h2 className="text-xl font-bold mb-4">Batch Transfer</h2>

        <Card className="rounded-xl shadow-sm border-gray-100 bg-white">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tokenAddress">Select Token</Label>
                <TokenSelect tokens={userTokens} value={formData.tokenAddress} onValueChange={handleTokenSelect} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipients">Recipient Addresses (one per line)</Label>
                <Textarea
                  id="recipients"
                  name="recipients"
                  value={formData.recipients}
                  onChange={handleChange}
                  placeholder="0x...\n0x...\n0x..."
                  className="min-h-[120px] rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                />
                <p className="text-sm text-muted-foreground">{recipientCount} recipients</p>
              </div>

              <div className="text-sm text-right mt-1">
                <span className={`${recipientCount > 0 ? "text-hojicha-brown" : "text-muted-foreground"}`}>
                  {recipientCount} recipient{recipientCount !== 1 ? "s" : ""} added
                </span>
              </div>

              <Tabs value={transferMode} onValueChange={(value) => setTransferMode(value as "fixed" | "random")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="fixed">Fixed Amount</TabsTrigger>
                  <TabsTrigger value="random">Random Range</TabsTrigger>
                </TabsList>

                <TabsContent value="fixed" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label htmlFor="fixedAmount">Amount Per Recipient</Label>
                      {selectedToken && (
                        <span className="text-sm text-muted-foreground">
                          Balance: {selectedToken.balance} {selectedToken.symbol}
                        </span>
                      )}
                    </div>
                    <Input
                      id="fixedAmount"
                      name="fixedAmount"
                      type="number"
                      value={formData.fixedAmount}
                      onChange={handleChange}
                      className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="random" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minAmount">Minimum Amount</Label>
                      <Input
                        id="minAmount"
                        name="minAmount"
                        type="number"
                        value={formData.minAmount}
                        onChange={handleChange}
                        className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxAmount">Maximum Amount</Label>
                      <Input
                        id="maxAmount"
                        name="maxAmount"
                        type="number"
                        value={formData.maxAmount}
                        onChange={handleChange}
                        className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                type="submit"
                className="w-full gradient-header border-0 hover:opacity-90 transition-all"
                disabled={isLoading || !formData.tokenAddress}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Transfer"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-muted-foreground">
          Perfect way to distribute tokens to multiple recipients
        </p>
      </div>
    </Layout>
  )
}
