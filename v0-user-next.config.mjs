/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/faucet',
        destination: 'https://faucet-sepolia.tea.xyz/',
        permanent: false,
      },
      {
        source: '/nft',
        destination: 'https://nftea-maker.vercel.app/',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
