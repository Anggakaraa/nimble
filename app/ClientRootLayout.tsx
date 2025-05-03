"use client"
import type React from "react"
import { usePathname } from "next/navigation"
import { Navigation } from "./components/navigation"

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="font-sans pb-16">
        {children}
        <ClientNav />
      </div>
    </>
  )
}

// Client component for conditional navigation
function ClientNav() {
  const pathname = usePathname()

  // Don't show navigation on the routine page
  if (pathname === "/routine") {
    return null
  }

  return <Navigation />
}
