import type React from "react"
import type { Metadata } from "next"
import { Nunito } from "next/font/google"
import "./globals.css"
import { Web3Provider } from "@/components/providers/web3-provider"
import { Toaster } from "@/components/ui/toaster"

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-nunito",
})

export const metadata: Metadata = {
  title: "Hojicha DApp",
  description: "Create and manage tokens on Tea Sepolia network",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/hojicha.svg" />
      </head>
      <body className={`${nunito.variable} font-sans bg-hojicha-beige min-h-screen`}>
        <Web3Provider>
          {children}
          <Toaster />
        </Web3Provider>
      </body>
    </html>
  )
}


import './globals.css'