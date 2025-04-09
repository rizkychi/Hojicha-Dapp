"use client"

import { useState } from "react"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

interface ContractInteractionProps {
  signer: ethers.Signer | null
}

export default function ContractInteraction({ signer }: ContractInteractionProps) {
  const [contractAddress, setContractAddress] = useState("")
  const [contractAbi, setContractAbi] = useState("")
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [functions, setFunctions] = useState<any[]>([])
  const [selectedFunction, setSelectedFunction] = useState<any>(null)
  const [functionInputs, setFunctionInputs] = useState<{ [key: string]: string }>({})
  const [result, setResult] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState("")

  // Fungsi untuk memuat kontrak
  const loadContract = () => {
    try {
      if (!signer || !contractAddress || !contractAbi) return

      // Parse ABI
      const parsedAbi = JSON.parse(contractAbi)

      // Buat instance kontrak
      const contractInstance = new ethers.Contract(contractAddress, parsedAbi, signer)
      setContract(contractInstance)

      // Ekstrak fungsi-fungsi dari ABI
      const abiFunctions = parsedAbi.filter((item: any) => item.type === "function")

      setFunctions(abiFunctions)
      setSelectedFunction(null)
      setFunctionInputs({})
      setResult("")
      setStatus("idle")
    } catch (error) {
      console.error("Error loading contract:", error)
      setResult("Error: Gagal memuat kontrak. Periksa alamat dan ABI.")
      setStatus("error")
    }
  }

  // Fungsi untuk memilih fungsi kontrak
  const selectFunction = (func: any) => {
    setSelectedFunction(func)

    // Reset input values
    const initialInputs: { [key: string]: string } = {}
    if (func.inputs) {
      func.inputs.forEach((input: any) => {
        initialInputs[input.name] = ""
      })
    }

    setFunctionInputs(initialInputs)
    setResult("")
    setStatus("idle")
  }

  // Fungsi untuk mengupdate nilai input
  const handleInputChange = (name: string, value: string) => {
    setFunctionInputs((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Fungsi untuk mengeksekusi fungsi kontrak
  const executeFunction = async () => {
    if (!contract || !selectedFunction) return

    setLoading(true)
    setResult("")
    setStatus("idle")
    setTxHash("")

    try {
      // Siapkan parameter
      const params = selectedFunction.inputs.map((input: any) => functionInputs[input.name])

      // Eksekusi fungsi
      const functionName = selectedFunction.name
      const contractFunction = contract[functionName]

      let response

      // Cek apakah fungsi ini adalah view/pure atau fungsi yang mengubah state
      if (selectedFunction.stateMutability === "view" || selectedFunction.stateMutability === "pure") {
        // Fungsi read-only
        response = await contractFunction(...params)
      } else {
        // Fungsi yang mengubah state (memerlukan transaksi)
        const tx = await contractFunction(...params)
        setTxHash(tx.hash)

        // Tunggu transaksi dikonfirmasi
        await tx.wait()
        response = "Transaksi berhasil dieksekusi"
      }

      // Format hasil
      let formattedResult
      if (ethers.BigNumber.isBigNumber?.(response)) {
        formattedResult = response.toString()
      } else if (Array.isArray(response)) {
        formattedResult = JSON.stringify(response, null, 2)
      } else if (typeof response === "object") {
        formattedResult = JSON.stringify(response, null, 2)
      } else {
        formattedResult = String(response)
      }

      setResult(formattedResult)
      setStatus("success")
    } catch (error: any) {
      console.error("Error executing function:", error)
      setResult(`Error: ${error.message || "Terjadi kesalahan saat mengeksekusi fungsi"}`)
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contract-address">Alamat Kontrak</Label>
          <Input
            id="contract-address"
            placeholder="0x..."
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contract-abi">ABI Kontrak</Label>
          <Textarea
            id="contract-abi"
            placeholder="[{...}]"
            className="min-h-[100px]"
            value={contractAbi}
            onChange={(e) => setContractAbi(e.target.value)}
          />
        </div>

        <Button onClick={loadContract}>Muat Kontrak</Button>
      </div>

      {contract && (
        <div className="border rounded-lg p-4 space-y-4">
          <h3 className="font-medium">Fungsi Kontrak</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {functions.map((func, index) => (
              <Button
                key={index}
                variant={selectedFunction === func ? "default" : "outline"}
                onClick={() => selectFunction(func)}
                className="justify-start overflow-hidden text-ellipsis"
              >
                {func.name}
              </Button>
            ))}
          </div>

          {selectedFunction && (
            <div className="space-y-4 border-t pt-4">
              <h4 className="font-medium">{selectedFunction.name}</h4>

              {selectedFunction.inputs.length > 0 ? (
                <div className="space-y-3">
                  {selectedFunction.inputs.map((input: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <Label htmlFor={`input-${input.name}`}>
                        {input.name} ({input.type})
                      </Label>
                      <Input
                        id={`input-${input.name}`}
                        placeholder={input.type}
                        value={functionInputs[input.name] || ""}
                        onChange={(e) => handleInputChange(input.name, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Fungsi ini tidak memerlukan parameter</p>
              )}

              <Button onClick={executeFunction} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Mengeksekusi..." : "Eksekusi Fungsi"}
              </Button>

              {result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Hasil:</h4>
                    {status === "success" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
                  </div>

                  <Alert variant={status === "error" ? "destructive" : "default"}>
                    <AlertDescription>
                      <pre className="whitespace-pre-wrap font-mono text-sm">{result}</pre>
                    </AlertDescription>
                  </Alert>

                  {txHash && (
                    <div className="text-sm">
                      <span className="font-medium">Hash Transaksi: </span>
                      <span className="font-mono">{txHash}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
