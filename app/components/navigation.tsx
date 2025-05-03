"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart2, Heart } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 bottom-nav">
      <div className="max-w-3xl mx-auto flex items-center justify-around">
        <Link
          href="/"
          className={`flex flex-col items-center p-2 ${pathname === "/" ? "text-black" : "text-gray-500"}`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/progress"
          className={`flex flex-col items-center p-2 ${pathname === "/progress" ? "text-black" : "text-gray-500"}`}
        >
          <BarChart2 className="w-6 h-6" />
          <span className="text-xs mt-1">Progress</span>
        </Link>

        <Link
          href="/favorites"
          className={`flex flex-col items-center p-2 ${pathname === "/favorites" ? "text-black" : "text-gray-500"}`}
        >
          <Heart className="w-6 h-6" />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
      </div>
    </nav>
  )
}
