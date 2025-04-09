"use client"

import { Cup } from "@/components/icons/cup"
import { ExternalLink } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto py-6 border-t border-hojicha-brown/10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Cup className="w-4 h-4 text-hojicha-brown" />
            <span className="text-sm text-muted-foreground">© {currentYear} Hojicha DApp. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rizkychi"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-hojicha-brown transition-colors flex items-center gap-1"
            >
              <span>Developer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://sepolia.tea.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-hojicha-brown transition-colors flex items-center gap-1"
            >
              <span>Tea Sepolia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
