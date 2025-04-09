# Hojicha DApp - Token Management on Tea Sepolia

Hojicha DApp is a decentralized application for creating and managing ERC20 tokens on the Tea Sepolia testnet. This application provides a user-friendly interface for token creation, transfers, and management.

## Features

- **Wallet Connection**: Connect your Ethereum wallet (MetaMask, etc.) to interact with the Tea Sepolia network
- **Token Creation**: Create your own ERC20 tokens with custom name, symbol, and initial supply
- **Token Transfer**: Send tokens to any address on the network
- **Batch Transfer**: Send tokens to multiple recipients at once with fixed or random amounts
- **Transaction History**: View your token transaction history with filtering options
- **TEA Faucet Integration**: Get free TEA tokens for testing from the Tea Sepolia faucet
- **KYC Address Integration**: Verify your identity for compliant token transfers

## Smart Contract

The application interacts with the Hojicha smart contract deployed on the Tea Sepolia network.

- **Contract Address**: `0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975`
- **Explorer**: [View on Tea Sepolia Explorer](https://sepolia.tea.xyz/address/0xBf27B69449cCc28C8DDb92CbAc3Ce4290C4C3975)

## Tea Sepolia Network

Tea is a new layer-1 blockchain designed for developers. It offers a familiar environment with EVM compatibility, while providing improved performance and developer experience.

### Network Configuration

- **Chain ID**: 0x27ea (10218)
- **Currency Symbol**: TEA
- **RPC URL**: https://tea-sepolia.g.alchemy.com/public
- **Block Explorer**: https://sepolia.tea.xyz

## Getting Started

1. Connect your wallet to the Tea Sepolia network
2. Get some TEA tokens from the [Tea Sepolia Faucet](https://faucet-sepolia.tea.xyz/)
3. Create your first token or interact with existing tokens

## Development

This application is built with:

- Next.js for the frontend framework
- ethers.js for blockchain interactions
- shadcn/ui for the component library
- Tailwind CSS for styling

## Troubleshooting

### Common Issues

- **Wrong Network**: Make sure your wallet is connected to the Tea Sepolia network
- **Insufficient TEA**: You need TEA tokens to pay for gas fees. Get some from the faucet
- **Transaction Errors**: Check the console for detailed error messages

## License

This project is licensed under the MIT License.
