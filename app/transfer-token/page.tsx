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
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Clipboard } from "lucide-react"
import { TokenSelect } from "@/components/token/token-select"
import { BackButton } from "@/components/back-button"

export default function TransferTokenPage() {
  const { isConnected, transferToken, userTokens, loadUserTokens } = useWeb3()
  const router = useRouter()
  const { toast } = useToast()
  const hiddenInputRef = useRef<HTMLInputElement>(null)

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

    // Prevent negative amounts
    if (name === "amount" && value.startsWith("-")) {
      return
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleTokenSelect = (value: string) => {
    setFormData((prev) => ({ ...prev, tokenAddress: value }))
  }

  const handlePasteAddress = () => {
    // Create a temporary input element to handle the paste operation
    if (hiddenInputRef.current) {
      // Focus the hidden input and execute paste command
      hiddenInputRef.current.value = ""
      hiddenInputRef.current.focus()

      // Use setTimeout to ensure the focus is complete
      setTimeout(() => {
        navigator.clipboard
          .readText()
          .then((pastedValue) => {
            // Get the pasted value and update the form
            if (pastedValue) {
              setFormData((prev) => ({ ...prev, recipient: pastedValue }))
              toast({
                title: "Address Pasted",
                description: "Recipient address pasted from clipboard",
              })
            } else {
              toast({
                title: "Paste Failed",
                description: "No content in clipboard or paste operation failed",
                variant: "destructive",
              })
            }

            // Restore focus to the main form
            document.getElementById("amount")?.focus()
          })
          .catch(() => {
            toast({
              title: "Paste Failed",
              description: "Unable to access clipboard",
              variant: "destructive",
            })
          })

        // Restore focus to the main form
        document.getElementById("amount")?.focus()
      }, 100)
    }
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

    // Validate amount is greater than 0
    if (Number(formData.amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Amount must be greater than 0",
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

      setFormData((prev) => ({
        ...prev,
        recipient: "",
        amount: "",
      }))

      // Reload user tokens
      await loadUserTokens()
    } catch (error: any) {
      console.error("Transfer error:", error)
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
                <div className="flex gap-2">
                  <Input
                    id="recipient"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    placeholder="0x..."
                    className="rounded-lg border-gray-200 focus-visible:ring-hojicha-brown"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handlePasteAddress}
                    className="border-gray-200 hover:bg-hojicha-brown/10 hover:text-hojicha-brown cursor-pointer"
                    title="Paste from clipboard"
                  >
                    <Clipboard className="h-4 w-4" />
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
                  min="0"
                  step="any"
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

        <p className="mt-4 text-center text-muted-foreground">Easily transfer your tokens to any Ethereum address</p>
      </div>
    </Layout>
  )
}
