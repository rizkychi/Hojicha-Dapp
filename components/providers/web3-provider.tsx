"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { useToast } from "@/components/ui/use-toast"
import type { Token } from "@/types/token"
import type { Transaction } from "@/types/transaction"

// Hojicha Contract ABI
const HOJICHA_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "BatchTransfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    name: "TokenCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address[]",
        name: "recipients",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
    ],
    name: "batchTransferToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
    ],
    name: "createToken",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "getTokenBalance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTokenOwners",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct HojichaTea.TokenInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
    ],
    name: "getTokenTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "getTokensByOwner",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "tokenAddress",
            type: "address",
          },
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "symbol",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "totalSupply",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "creator",
            type: "address",
          },
        ],
        internalType: "struct HojichaTea.TokenInfo[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isTokenRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "ownerTokens",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "tokenList",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "tokens",
    outputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "totalSupply",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "creator",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "tokenAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
]

// Simple ERC20 ABI for token interactions
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
]

// Hojicha contract address
const HOJICHA_CONTRACT_ADDRESS = "0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975"

// Tea Sepolia network configuration
const TEA_SEPOLIA_CONFIG = {
  chainId: "0x27ea", // 10218 in decimal
  chainName: "Tea Sepolia",
  nativeCurrency: {
    name: "TEA",
    symbol: "TEA",
    decimals: 18,
  },
  rpcUrls: ["https://tea-sepolia.g.alchemy.com/public"],
  blockExplorerUrls: ["https://sepolia.tea.xyz"],
}

interface Web3ContextType {
  provider: ethers.BrowserProvider | null
  signer: ethers.Signer | null
  account: string
  networkName: string
  teaBalance: string
  isConnected: boolean
  isCorrectNetwork: boolean
  userTokens: Token[]
  transactions: Transaction[]
  connect: () => Promise<void>
  disconnect: () => void
  ensureCorrectNetwork: () => Promise<void>
  loadUserTokens: () => Promise<void>
  loadTransactions: () => Promise<void>
  createToken: (name: string, symbol: string, initialSupply: string) => Promise<void>
  transferToken: (tokenAddress: string, to: string, amount: string) => Promise<void>
  batchTransferToken: (
    tokenAddress: string,
    recipients: string[],
    amount: string,
    minAmount?: number,
    maxAmount?: number,
  ) => Promise<void>
  showWalletModal: boolean
  setShowWalletModal: (show: boolean) => void
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [signer, setSigner] = useState<ethers.Signer | null>(null)
  const [account, setAccount] = useState<string>("")
  const [networkName, setNetworkName] = useState<string>("")
  // Add teaBalance state
  const [teaBalance, setTeaBalance] = useState<string>("0")
  const [isConnected, setIsConnected] = useState(false)
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false)
  const [userTokens, setUserTokens] = useState<Token[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [hojichaContract, setHojichaContract] = useState<ethers.Contract | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)

  const { toast } = useToast()

  // Add function to get TEA balance
  const getTeaBalance = async () => {
    if (!provider || !account) return "0"

    try {
      const balance = await provider.getBalance(account)
      return ethers.formatEther(balance)
    } catch (error) {
      console.error("Error getting TEA balance:", error)
      return "0"
    }
  }

  // Connect wallet
  // Update the connect function to get TEA balance
  const connect = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask or compatible wallet not found")
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      setProvider(provider)

      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const signer = await provider.getSigner()
      setSigner(signer)

      const address = await signer.getAddress()
      setAccount(address)

      // Initialize Hojicha contract
      const contract = new ethers.Contract(HOJICHA_CONTRACT_ADDRESS, HOJICHA_ABI, signer)
      setHojichaContract(contract)

      setIsConnected(true)

      // Check if on correct network
      await checkNetwork(provider)

      // Get TEA balance
      const balance = await getTeaBalance()
      setTeaBalance(balance)

      return provider
    } catch (error) {
      console.error("Error connecting wallet:", error)
      throw error
    }
  }

  // Disconnect wallet
  const disconnect = () => {
    setProvider(null)
    setSigner(null)
    setAccount("")
    setNetworkName("")
    setTeaBalance("0")
    setIsConnected(false)
    setIsCorrectNetwork(false)
    setUserTokens([])
    setTransactions([])
    setHojichaContract(null)
    setShowWalletModal(false)
  }

  // Check if connected to Tea Sepolia network
  const checkNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork()
      const isTeaSepolia = network.chainId === BigInt(10218)
      setIsCorrectNetwork(isTeaSepolia)

      // Set network name
      if (isTeaSepolia) {
        setNetworkName("Tea Sepolia")
      } else {
        const networkName = network.name === "unknown" ? `Chain ID: ${network.chainId.toString()}` : network.name
        setNetworkName(networkName)
      }

      return isTeaSepolia
    } catch (error) {
      console.error("Error checking network:", error)
      setIsCorrectNetwork(false)
      return false
    }
  }

  // Switch to Tea Sepolia network
  const switchToTeaSepolia = async () => {
    if (!window.ethereum) return false

    try {
      // Try to switch to the network
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TEA_SEPOLIA_CONFIG.chainId }],
      })
      return true
    } catch (switchError: any) {
      // Network doesn't exist in wallet
      if (switchError.code === 4902) {
        try {
          // Add the network
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [TEA_SEPOLIA_CONFIG],
          })
          return true
        } catch (addError) {
          console.error("Error adding network:", addError)
          return false
        }
      }
      console.error("Error switching network:", switchError)
      return false
    }
  }

  // Ensure correct network
  const ensureCorrectNetwork = async () => {
    if (!provider) return

    const isCorrect = await checkNetwork(provider)
    if (!isCorrect) {
      const switched = await switchToTeaSepolia()
      if (!switched) {
        throw new Error("Please switch to Tea Sepolia network manually")
      }
      setIsCorrectNetwork(true)
      setNetworkName("Tea Sepolia")
    }
  }

  // Load user tokens
  const loadUserTokens = useCallback(async () => {
    if (!signer || !account || !hojichaContract) return

    try {
      // Get tokens by owner using the contract
      const tokenInfos = await hojichaContract.getTokensByOwner(account)

      const tokens: Token[] = await Promise.all(
        tokenInfos.map(async (info: any) => {
          const tokenAddress = info.tokenAddress
          const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)
          const balance = await tokenContract.balanceOf(account)

          return {
            name: info.name,
            symbol: info.symbol,
            address: tokenAddress,
            balance: ethers.formatUnits(balance, 18),
            totalSupply: ethers.formatUnits(info.totalSupply, 18),
          }
        }),
      )

      setUserTokens(tokens)
    } catch (error) {
      console.error("Error loading tokens:", error)

      // Fallback to mock data if contract call fails
      const mockTokens: Token[] = [
        {
          name: "Hojicha Token",
          symbol: "HJC",
          address: "0xabcdef1234567890abcdef1234567890abcdef12",
          balance: "1000.0",
          totalSupply: "10000.0",
        },
        {
          name: "Tea Token",
          symbol: "TEA",
          address: "0x1234567890abcdef1234567890abcdef12345678",
          balance: "500.0",
          totalSupply: "5000.0",
        },
      ]

      setUserTokens(mockTokens)
    }
  }, [signer, account, hojichaContract])

  // Load transactions
  const loadTransactions = useCallback(async () => {
    if (!signer || !account || !hojichaContract || !provider) return

    try {
      // Create an array to store all transactions
      const allTransactions: Transaction[] = []

      // Get TokenCreated events
      const tokenCreatedFilter = hojichaContract.filters.TokenCreated(null, null, null, null, account)
      const tokenCreatedEvents = await hojichaContract.queryFilter(tokenCreatedFilter)

      // Process TokenCreated events
      for (const event of tokenCreatedEvents) {
        const args = event.args
        if (args) {
          allTransactions.push({
            hash: event.transactionHash,
            tokenAddress: args.tokenAddress,
            tokenName: args.name,
            tokenSymbol: args.symbol,
            amount: ethers.formatUnits(args.initialSupply, 18),
            type: "received",
            counterparty: HOJICHA_CONTRACT_ADDRESS,
            timestamp: (await provider.getBlock(event.blockNumber))?.timestamp
              ? Number((await provider.getBlock(event.blockNumber))!.timestamp) * 1000
              : Date.now(),
          })
        }
      }

      // Get TokensTransferred events where user is sender
      const sentFilter = hojichaContract.filters.TokensTransferred(null, account)
      const sentEvents = await hojichaContract.queryFilter(sentFilter)

      // Process sent events
      for (const event of sentEvents) {
        const args = event.args
        if (args) {
          // Get token details
          const tokenContract = new ethers.Contract(args.tokenAddress, ERC20_ABI, signer)
          const tokenName = await tokenContract.name()
          const tokenSymbol = await tokenContract.symbol()

          allTransactions.push({
            hash: event.transactionHash,
            tokenAddress: args.tokenAddress,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            amount: ethers.formatUnits(args.amount, 18),
            type: "sent",
            counterparty: args.to,
            timestamp: (await provider.getBlock(event.blockNumber))?.timestamp
              ? Number((await provider.getBlock(event.blockNumber))!.timestamp) * 1000
              : Date.now(),
          })
        }
      }

      // Get TokensTransferred events where user is receiver
      const receivedFilter = hojichaContract.filters.TokensTransferred(null, null, account)
      const receivedEvents = await hojichaContract.queryFilter(receivedFilter)

      // Process received events
      for (const event of receivedEvents) {
        const args = event.args
        if (args) {
          // Get token details
          const tokenContract = new ethers.Contract(args.tokenAddress, ERC20_ABI, signer)
          const tokenName = await tokenContract.name()
          const tokenSymbol = await tokenContract.symbol()

          allTransactions.push({
            hash: event.transactionHash,
            tokenAddress: args.tokenAddress,
            tokenName: tokenName,
            tokenSymbol: tokenSymbol,
            amount: ethers.formatUnits(args.amount, 18),
            type: "received",
            counterparty: args.from,
            timestamp: (await provider.getBlock(event.blockNumber))?.timestamp
              ? Number((await provider.getBlock(event.blockNumber))!.timestamp) * 1000
              : Date.now(),
          })
        }
      }

      // Get BatchTransfer events
      const batchTransferFilter = hojichaContract.filters.BatchTransfer(null, account)
      const batchTransferEvents = await hojichaContract.queryFilter(batchTransferFilter)

      // Process batch transfer events
      for (const event of batchTransferEvents) {
        const args = event.args
        if (args) {
          // Get token details
          const tokenContract = new ethers.Contract(args.tokenAddress, ERC20_ABI, signer)
          const tokenName = await tokenContract.name()
          const tokenSymbol = await tokenContract.symbol()

          // Create a transaction for each recipient
          for (let i = 0; i < args.recipients.length; i++) {
            allTransactions.push({
              hash: event.transactionHash + "-" + i,
              tokenAddress: args.tokenAddress,
              tokenName: tokenName,
              tokenSymbol: tokenSymbol,
              amount: ethers.formatUnits(args.amounts[i], 18),
              type: "sent",
              counterparty: args.recipients[i],
              timestamp: (await provider.getBlock(event.blockNumber))?.timestamp
                ? Number((await provider.getBlock(event.blockNumber))!.timestamp) * 1000
                : Date.now(),
            })
          }
        }
      }

      // Sort transactions by timestamp (newest first)
      allTransactions.sort((a, b) => b.timestamp - a.timestamp)

      setTransactions(allTransactions)
    } catch (error) {
      console.error("Error loading transactions:", error)

      // Fallback to mock data if contract call fails
      const mockTransactions: Transaction[] = [
        {
          hash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
          tokenAddress: "0xabcdef1234567890abcdef1234567890abcdef12",
          tokenName: "Hojicha Token",
          tokenSymbol: "HJC",
          amount: "10.0",
          type: "sent",
          counterparty: "0x9876543210fedcba9876543210fedcba98765432",
          timestamp: Date.now() - 3600000, // 1 hour ago
        },
        {
          hash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
          tokenAddress: "0x1234567890abcdef1234567890abcdef12345678",
          tokenName: "Tea Token",
          tokenSymbol: "TEA",
          amount: "5.0",
          type: "received",
          counterparty: "0xfedcba9876543210fedcba9876543210fedcba98",
          timestamp: Date.now() - 86400000, // 1 day ago
        },
      ]

      setTransactions(mockTransactions)
    }
  }, [signer, account, hojichaContract, provider])

  // Create token
  const createToken = async (name: string, symbol: string, initialSupply: string) => {
    if (!signer || !hojichaContract) throw new Error("Wallet not connected")

    try {
      // Convert initialSupply to wei (assuming 18 decimals)
      const initialSupplyWei = ethers.parseUnits(initialSupply, 18)

      // Call the createToken function on the contract
      const tx = await hojichaContract.createToken(name, symbol, initialSupplyWei)

      // Show loading toast
      toast({
        title: "Creating Token",
        description: "Transaction submitted. Please wait for confirmation...",
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Find the TokenCreated event in the receipt
      const event = receipt.logs
        .filter((log: any) => log.fragment && log.fragment.name === "TokenCreated")
        .map((log: any) => {
          const parsedLog = hojichaContract.interface.parseLog(log)
          return {
            tokenAddress: parsedLog.args.tokenAddress,
            name: parsedLog.args.name,
            symbol: parsedLog.args.symbol,
            initialSupply: parsedLog.args.initialSupply,
            creator: parsedLog.args.creator,
          }
        })[0]

      if (!event) {
        throw new Error("Token creation event not found in transaction receipt")
      }

      // Add the new token to the list
      const newToken: Token = {
        name,
        symbol,
        address: event.tokenAddress,
        balance: initialSupply,
        totalSupply: initialSupply,
      }

      setUserTokens((prev) => [...prev, newToken])

      // Add a transaction record
      const newTransaction: Transaction = {
        hash: tx.hash,
        tokenAddress: newToken.address,
        tokenName: newToken.name,
        tokenSymbol: newToken.symbol,
        amount: initialSupply,
        type: "received",
        counterparty: HOJICHA_CONTRACT_ADDRESS,
        timestamp: Date.now(),
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Show success notification with TX hash
      toast({
        title: "Token Created Successfully",
        description: (
          <div className="flex flex-col space-y-1">
            <span>
              {name} ({symbol}) created successfully
            </span>
            <a
              href={`https://sepolia.tea.xyz/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-500 hover:underline truncate"
            >
              TX: {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
            </a>
          </div>
        ),
        variant: "default",
      })

      return newToken
    } catch (error) {
      console.error("Error creating token:", error)

      // Show error notification
      toast({
        title: "Token Creation Failed",
        description: error.message || "Something went wrong during token creation",
        variant: "destructive",
      })

      throw error
    }
  }

  // Transfer token
  const transferToken = async (tokenAddress: string, to: string, amount: string) => {
    if (!signer || !hojichaContract) throw new Error("Wallet not connected")

    try {
      // Get token contract
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)

      // Convert amount to wei (assuming 18 decimals)
      const amountWei = ethers.parseUnits(amount, 18)

      // First approve the Hojicha contract to spend tokens
      const approveTx = await tokenContract.approve(HOJICHA_CONTRACT_ADDRESS, amountWei)
      await approveTx.wait()

      // Now call the transferToken function on the contract
      const tx = await hojichaContract.transferToken(tokenAddress, to, amountWei)

      // Show loading toast
      toast({
        title: "Transferring Token",
        description: "Transaction submitted. Please wait for confirmation...",
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Update token balance
      setUserTokens((prev) =>
        prev.map((token) =>
          token.address === tokenAddress
            ? { ...token, balance: (Number.parseFloat(token.balance) - Number.parseFloat(amount)).toString() }
            : token,
        ),
      )

      // Find token details
      const token = userTokens.find((t) => t.address === tokenAddress)
      if (!token) throw new Error("Token not found")

      // Add a transaction record
      const newTransaction: Transaction = {
        hash: tx.hash,
        tokenAddress,
        tokenName: token.name,
        tokenSymbol: token.symbol,
        amount,
        type: "sent",
        counterparty: to,
        timestamp: Date.now(),
      }

      setTransactions((prev) => [newTransaction, ...prev])

      // Show success notification with TX hash
      toast({
        title: "Transfer Successful",
        description: (
          <div className="flex flex-col space-y-1">
            <span>Tokens transferred successfully</span>
            <a
              href={`https://sepolia.tea.xyz/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-500 hover:underline truncate"
            >
              TX: {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
            </a>
          </div>
        ),
        variant: "default",
      })

      return newTransaction
    } catch (error: any) {
      console.error("Error transferring token:", error)

      // Show error notification
      toast({
        title: "Transfer Failed",
        description: error.message || "Something went wrong during the transfer",
        variant: "destructive",
      })

      throw error
    }
  }

  // Batch transfer token
  const batchTransferToken = async (
    tokenAddress: string,
    recipients: string[],
    amount: string,
    minAmount?: number,
    maxAmount?: number,
  ) => {
    if (!signer || !hojichaContract) throw new Error("Wallet not connected")

    try {
      // Get token contract
      const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer)

      let amounts: ethers.BigNumberish[] = []
      let totalAmount = 0

      if (minAmount !== undefined && maxAmount !== undefined) {
        // Random amounts within range
        amounts = recipients.map(() => {
          const randomAmount = minAmount + Math.random() * (maxAmount - minAmount)
          totalAmount += randomAmount
          return ethers.parseUnits(randomAmount.toFixed(2), 18)
        })
      } else {
        // Fixed amount
        const amountWei = ethers.parseUnits(amount, 18)
        amounts = recipients.map(() => amountWei)
        totalAmount = Number.parseFloat(amount) * recipients.length
      }

      // Calculate total amount to approve
      const totalAmountWei = amounts.reduce((a, b) => a + BigInt(b.toString()), BigInt(0))

      // First approve the Hojicha contract to spend tokens
      const approveTx = await tokenContract.approve(HOJICHA_CONTRACT_ADDRESS, totalAmountWei)
      await approveTx.wait()

      // Call the batchTransferToken function on the contract
      const tx = await hojichaContract.batchTransferToken(tokenAddress, recipients, amounts)

      // Show loading toast
      toast({
        title: "Batch Transferring Tokens",
        description: "Transaction submitted. Please wait for confirmation...",
      })

      // Wait for transaction to be mined
      const receipt = await tx.wait()

      // Find token details
      const token = userTokens.find((t) => t.address === tokenAddress)
      if (!token) throw new Error("Token not found")

      // Create transaction records for each recipient
      const newTransactions: Transaction[] = recipients.map((recipient, index) => {
        // Calculate amount for this recipient
        const recipientAmount =
          minAmount !== undefined && maxAmount !== undefined ? ethers.formatUnits(amounts[index], 18) : amount

        return {
          hash: tx.hash + "-" + index, // Add index to make hash unique
          tokenAddress,
          tokenName: token.name,
          tokenSymbol: token.symbol,
          amount: recipientAmount,
          type: "sent",
          counterparty: recipient,
          timestamp: Date.now() - Math.floor(Math.random() * 60000), // Slight time variation
        }
      })

      // Update token balance
      setUserTokens((prev) =>
        prev.map((t) =>
          t.address === tokenAddress ? { ...t, balance: (Number.parseFloat(t.balance) - totalAmount).toString() } : t,
        ),
      )

      // Add transaction records
      setTransactions((prev) => [...newTransactions, ...prev])

      // Show success notification with TX hash
      toast({
        title: "Batch Transfer Successful",
        description: (
          <div className="flex flex-col space-y-1">
            <span>Tokens transferred to {recipients.length} recipients</span>
            <a
              href={`https://sepolia.tea.xyz/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-blue-500 hover:underline truncate"
            >
              TX: {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
            </a>
          </div>
        ),
        variant: "default",
      })

      return newTransactions
    } catch (error: any) {
      console.error("Error batch transferring tokens:", error)

      // Show error notification
      toast({
        title: "Batch Transfer Failed",
        description: error.message || "Something went wrong during the batch transfer",
        variant: "destructive",
      })

      throw error
    }
  }

  // Update TEA balance periodically
  useEffect(() => {
    if (!isConnected || !provider || !account) return

    const updateBalance = async () => {
      try {
        const balance = await provider.getBalance(account)
        setTeaBalance(ethers.formatEther(balance))
      } catch (error) {
        console.error("Error updating TEA balance:", error)
      }
    }

    // Update balance immediately
    updateBalance()

    // Then update every 15 seconds
    const interval = setInterval(updateBalance, 15000)

    return () => clearInterval(interval)
  }, [isConnected, provider, account])

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          disconnect()
        } else if (accounts[0] !== account) {
          // Account changed
          setAccount(accounts[0])
        }
      }

      const handleChainChanged = () => {
        // Chain changed, refresh
        window.location.reload()
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [account])

  // Auto-connect if previously connected
  useEffect(() => {
    const autoConnect = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts.length > 0) {
            await connect()
          }
        } catch (error) {
          console.error("Error auto-connecting:", error)
        }
      }
    }

    autoConnect()
  }, [])

  return (
    <Web3Context.Provider
      value={{
        provider,
        signer,
        account,
        networkName,
        teaBalance,
        isConnected,
        isCorrectNetwork,
        userTokens,
        transactions,
        connect,
        disconnect,
        ensureCorrectNetwork,
        loadUserTokens,
        loadTransactions,
        createToken,
        transferToken,
        batchTransferToken,
        showWalletModal,
        setShowWalletModal,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}
