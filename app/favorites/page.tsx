"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Heart, Trash2 } from "lucide-react"

// Color mapping for different focus areas
const getFocusColor = (focus: string) => {
  const focusLower = focus?.toLowerCase() || ""

  if (focusLower.includes("hip")) return "bg-amber-50 border-amber-200"
  if (focusLower.includes("ankle") || focusLower.includes("knee")) return "bg-emerald-50 border-emerald-200"
  if (focusLower.includes("shoulder") || focusLower.includes("wrist")) return "bg-sky-50 border-sky-200"
  if (focusLower.includes("spine") || focusLower.includes("back")) return "bg-violet-50 border-violet-200"
  if (focusLower.includes("neck")) return "bg-rose-50 border-rose-200"
  if (focusLower.includes("warm")) return "bg-orange-50 border-orange-200"
  if (focusLower.includes("cool")) return "bg-blue-50 border-blue-200"

  // Default color
  return "bg-gray-50 border-gray-200"
}

// Get section badge color
const getSectionColor = (section: string) => {
  const sectionLower = section?.toLowerCase() || ""

  if (sectionLower.includes("warm")) return "bg-orange-100 text-orange-800"
  if (sectionLower.includes("main")) return "bg-violet-100 text-violet-800"
  if (sectionLower.includes("cool")) return "bg-blue-100 text-blue-800"

  return "bg-gray-100 text-gray-800"
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load favorites from localStorage
    const loadFavorites = () => {
      setIsLoading(true)
      try {
        const savedFavorites = localStorage.getItem("nimbleFavorites")
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites))
        }
      } catch (e) {
        console.error("Failed to load favorites:", e)
      } finally {
        setIsLoading(false)
      }
    }

    loadFavorites()
  }, [])

  const removeFavorite = (exercise: any) => {
    try {
      const updatedFavorites = favorites.filter((fav) => fav.title !== exercise.title)
      localStorage.setItem("nimbleFavorites", JSON.stringify(updatedFavorites))
      setFavorites(updatedFavorites)
    } catch (e) {
      console.error("Failed to remove favorite:", e)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your favorites...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 max-w-3xl mx-auto">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />
          </Link>
          <h1 className="text-2xl font-medium text-black">Nimble</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-normal text-black">Favorite Exercises</h2>
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">You haven't saved any favorite exercises yet.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Generate a routine
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((exercise, index) => (
              <div key={index} className={`p-6 rounded-xl border ${getFocusColor(exercise.focus || exercise.section)}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getSectionColor(exercise.section)}`}>
                    {exercise.section}
                  </span>

                  <button
                    onClick={() => removeFavorite(exercise)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="text-2xl font-normal text-black mb-2">{exercise.title}</h3>
                {exercise.duration && <p className="text-gray-500 mb-4">{exercise.duration}</p>}

                <div className="space-y-3 mb-6">
                  {exercise.instructions?.map((step: string, i: number) => (
                    <div key={i} className="flex items-start">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs mr-3 mt-0.5 flex-shrink-0">
                        {i + 1}
                      </span>
                      <p className="text-black">{step}</p>
                    </div>
                  ))}
                </div>

                {exercise.tools && exercise.tools.length > 0 && exercise.tools[0] !== "None" && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Tools needed:</h4>
                    <div className="flex flex-wrap gap-2">
                      {exercise.tools.map((tool: string, i: number) => (
                        <span key={i} className="text-xs bg-white px-3 py-1 rounded-full border border-gray-200">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
