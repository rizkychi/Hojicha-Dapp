"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
}

export function BackButton({ href = "/dashboard" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="mb-4 text-white bg-hojicha-brown/80 hover:bg-hojicha-brown hover:text-white transition-colors slide-in"
      onClick={handleClick}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Dashboard
    </Button>
  )
}
