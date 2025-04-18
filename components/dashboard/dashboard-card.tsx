import type React from "react"
import Link from "next/link"

interface DashboardCardProps {
  title: string
  icon: React.ReactNode
  href?: string
  description: string
  iconBgColor?: string
}

export function DashboardCard({
  title,
  icon,
  href,
  description,
  iconBgColor = "bg-hojicha-brown/10",
}: DashboardCardProps) {
  const CardContent = () => (
    <div className="food-card h-full bg-white hover:bg-hojicha-brown/5 transition-all duration-300 flex flex-col items-center justify-center aspect-square">
      <div className={`mb-3 p-3 rounded-xl ${iconBgColor}`}>{icon}</div>
      <h3 className="text-base font-medium text-hojicha-dark-brown">{title}</h3>
      {description && <p className="text-sm text-muted-foreground mt-1 text-center px-2">{description}</p>}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="cursor-pointer">
        <CardContent />
      </Link>
    )
  }

  return <CardContent />
}
