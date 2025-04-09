"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useWeb3 } from "@/components/providers/web3-provider"
import { Layout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Clipboard } from "lucide-react"
import { TokenSelect } from "@/components/token/token-select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BackButton } from "@/components/back-button"

export default function BatchTransferPage() {
  const { isConnected, batchTransferToken, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()
  const hiddenInputRef = useRef<HTMLInputElement>(null)

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

    // Prevent negative amounts
    if ((name === "fixedAmount" || name === "minAmount" || name === "maxAmount") && value.startsWith("-")) {
      return
    }

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

  const handlePasteAddresses = () => {
    // Create a temporary input element to handle the paste operation
    if (hiddenInputRef.current) {
      // Focus the hidden input and execute paste command
      hiddenInputRef.current.value = ""
      hiddenInputRef.current.focus()

      // Use setTimeout to ensure the focus is complete
      setTimeout(() => {
        document.execCommand("paste")

        // Get the pasted value and update the form
        const pastedValue = hiddenInputRef.current?.value || ""
        if (pastedValue) {
          setFormData((prev) => ({ ...prev, recipients: pastedValue }))

          // Update recipient count
          const count = pastedValue
            .split("\n")
            .map((address) => address.trim())
            .filter((address) => address.length > 0).length
          setRecipientCount(count)

          toast({
            title: "Addresses Pasted",
            description: `${count} recipient address${count !== 1 ? "es" : ""} pasted from clipboard`,
          })
        } else {
          toast({
            title: "Paste Failed",
            description: "No content in clipboard or paste operation failed",
            variant: "destructive",
          })
        }

        // Restore focus to the main form
        document.getElementById("recipients")?.focus()
      }, 100)
    }
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
    if (transferMode === "fixed") {
      if (!formData.fixedAmount) {
        toast({
          title: "Missing Amount",
          description: "Please enter an amount to transfer",
          variant: "destructive",
        })
        return
      }

      if (Number(formData.fixedAmount) <= 0) {
        toast({
          title: "Invalid Amount",
          description: "Amount must be greater than 0",
          variant: "destructive",
        })
        return
      }
    }

    if (transferMode === "random") {
      if (!formData.minAmount || !formData.maxAmount) {
        toast({
          title: "Missing Range",
          description: "Please enter both minimum and maximum amounts",
          variant: "destructive",
        })
        return
      }

      if (Number(formData.minAmount) <= 0 || Number(formData.maxAmount) <= 0) {
        toast({
          title: "Invalid Range",
          description: "Minimum and maximum amounts must be greater than 0",
          variant: "destructive",
        })
        return
      }

      if (Number(formData.minAmount) >= Number(formData.maxAmount)) {
        toast({
          title: "Invalid Range",
          description: "Maximum amount must be greater than minimum amount",
          variant: "destructive",
        })
        return
      }
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

      // Reload user tokens
      await loadUserTokens()
    } catch (error: any) {
      console.error("Batch transfer error:", error)
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
                <div className="flex justify-between items-center">
                  <Label htmlFor="recipients">Recipient Addresses (one per line)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePasteAddresses}
                    className="border-gray-200 hover:bg-hojicha-brown/10 hover:text-hojicha-brown cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="h-4 w-4 mr-1" />
                    Paste
                  </Button>

                  {/* Hidden input for paste operation */}
                  <input
                    ref={hiddenInputRef}
                    type="text"
                    className="opacity-0 h-0 w-0 absolute"
                    aria-hidden="true"
                    tabIndex={-1}
                  />
                </div>
                <Textarea
                  id="recipients"
                  name="recipients"
                  value={formData.recipients}
                  onChange={handleChange}
                  placeholder={"0x...\n0x...\n0x..."}
                  className="min-h-[120px] rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                />
                <div className="text-sm text-right">
                  <span className={`${recipientCount > 0 ? "text-hojicha-brown" : "text-muted-foreground"}`}>
                    {recipientCount} recipient{recipientCount !== 1 ? "s" : ""} added
                  </span>
                </div>
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
                      min="0"
                      step="any"
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
                        min="0"
                        step="any"
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
                        min="0"
                        step="any"
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
