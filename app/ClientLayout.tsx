"use client"

import type React from "react"
import { Navigation } from "./components/navigation"
import { usePathname } from "next/navigation"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show navigation on the routine page
  if (pathname === "/routine") {
    return null
  }

  return <Navigation />
}
