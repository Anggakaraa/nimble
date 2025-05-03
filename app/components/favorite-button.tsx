"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"

interface FavoriteButtonProps {
  exercise: any
  size?: "sm" | "md" | "lg"
}

export function FavoriteButton({ exercise, size = "md" }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    // Check if this exercise is already a favorite
    const checkFavorite = () => {
      try {
        const savedFavorites = localStorage.getItem("nimbleFavorites")
        if (!savedFavorites) return false

        const favorites = JSON.parse(savedFavorites)
        return favorites.some((fav: any) => fav.title === exercise.title)
      } catch (e) {
        console.error("Failed to check favorites:", e)
        return false
      }
    }

    setIsFavorite(checkFavorite())
  }, [exercise])

  const toggleFavorite = () => {
    try {
      // Get existing favorites
      const savedFavorites = localStorage.getItem("nimbleFavorites")
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : []

      if (isFavorite) {
        // Remove from favorites
        const updatedFavorites = favorites.filter((fav: any) => fav.title !== exercise.title)
        localStorage.setItem("nimbleFavorites", JSON.stringify(updatedFavorites))
        setIsFavorite(false)
      } else {
        // Add to favorites
        favorites.push({
          ...exercise,
          savedAt: new Date().toISOString(),
        })
        localStorage.setItem("nimbleFavorites", JSON.stringify(favorites))
        setIsFavorite(true)
      }
    } catch (e) {
      console.error("Failed to update favorites:", e)
    }
  }

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  }

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        toggleFavorite()
      }}
      className={`${sizeClasses[size]} flex items-center justify-center rounded-full transition-colors ${
        isFavorite ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
      }`}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart className={`${size === "sm" ? "w-4 h-4" : "w-5 h-5"} ${isFavorite ? "fill-current" : ""}`} />
    </button>
  )
}
