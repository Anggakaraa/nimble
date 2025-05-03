"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface ProgressEntry {
  date: string
  effort: string
  primaryFocus: string
  secondaryFocus?: string
  time: string
  completed: boolean
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load progress data from localStorage
    const loadProgress = () => {
      setIsLoading(true)
      try {
        const savedProgress = localStorage.getItem("nimbleProgress")
        if (savedProgress) {
          setProgressData(JSON.parse(savedProgress))
        }
      } catch (e) {
        console.error("Failed to load progress data:", e)
      } finally {
        setIsLoading(false)
      }
    }

    loadProgress()
  }, [])

  // Group entries by month
  const groupedByMonth: Record<string, ProgressEntry[]> = {}
  progressData.forEach((entry) => {
    const date = new Date(entry.date)
    const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`

    if (!groupedByMonth[monthYear]) {
      groupedByMonth[monthYear] = []
    }

    groupedByMonth[monthYear].push(entry)
  })

  // Get focus area distribution
  const focusDistribution: Record<string, number> = {}
  progressData.forEach((entry) => {
    if (!focusDistribution[entry.primaryFocus]) {
      focusDistribution[entry.primaryFocus] = 0
    }
    focusDistribution[entry.primaryFocus]++

    if (entry.secondaryFocus) {
      if (!focusDistribution[entry.secondaryFocus]) {
        focusDistribution[entry.secondaryFocus] = 0
      }
      focusDistribution[entry.secondaryFocus] += 0.5 // Count secondary focus as half
    }
  })

  // Get effort type distribution
  const effortDistribution: Record<string, number> = {}
  progressData.forEach((entry) => {
    if (!effortDistribution[entry.effort]) {
      effortDistribution[entry.effort] = 0
    }
    effortDistribution[entry.effort]++
  })

  // Function to get color for focus area
  const getFocusColor = (focus: string) => {
    const focusLower = focus?.toLowerCase() || ""

    if (focusLower.includes("hip")) return "bg-amber-100 text-amber-800"
    if (focusLower.includes("ankle") || focusLower.includes("knee")) return "bg-emerald-100 text-emerald-800"
    if (focusLower.includes("shoulder") || focusLower.includes("wrist")) return "bg-sky-100 text-sky-800"
    if (focusLower.includes("spine")) return "bg-violet-100 text-violet-800"

    return "bg-gray-100 text-gray-800"
  }

  // Function to get color for effort level
  const getEffortColor = (effort: string) => {
    const effortLower = effort?.toLowerCase() || ""

    if (effortLower === "restore") return "bg-blue-100 text-blue-800"
    if (effortLower === "build") return "bg-purple-100 text-purple-800"
    if (effortLower === "push") return "bg-rose-100 text-rose-800"

    return "bg-gray-100 text-gray-800"
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your progress...</p>
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
        <h2 className="text-3xl font-normal text-black mb-6">Your Progress</h2>

        {progressData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">You haven't completed any routines yet.</p>
            <Link
              href="/"
              className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              Create your first routine
            </Link>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Total Sessions</h3>
                <p className="text-3xl font-normal">{progressData.length}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-2">This Month</h3>
                <p className="text-3xl font-normal">
                  {
                    progressData.filter((entry) => {
                      const entryDate = new Date(entry.date)
                      const now = new Date()
                      return entryDate.getMonth() === now.getMonth() && entryDate.getFullYear() === now.getFullYear()
                    }).length
                  }
                </p>
              </div>
            </div>

            {/* Focus Area Distribution */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Focus Areas</h3>
              <div className="space-y-2">
                {Object.entries(focusDistribution).map(([focus, count]) => (
                  <div key={focus} className="flex items-center">
                    <span className={`text-xs px-3 py-1 rounded-full ${getFocusColor(focus)} mr-2`}>{focus}</span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-black h-full rounded-full"
                        style={{ width: `${(count / progressData.length) * 100}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-500">{Math.round(count)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Effort Type Distribution */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Effort Types</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(effortDistribution).map(([effort, count]) => (
                  <div key={effort} className={`px-3 py-1 rounded-full ${getEffortColor(effort)}`}>
                    {effort}: {count}
                  </div>
                ))}
              </div>
            </div>

            {/* History by Month */}
            <div>
              <h3 className="text-lg font-medium mb-4">History</h3>
              {Object.entries(groupedByMonth).map(([month, entries]) => (
                <div key={month} className="mb-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">{month}</h4>
                  <div className="space-y-3">
                    {entries.map((entry, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">{new Date(entry.date).toLocaleDateString()}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getEffortColor(entry.effort)}`}>
                            {entry.effort}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getFocusColor(entry.primaryFocus)}`}>
                            {entry.primaryFocus}
                          </span>
                          {entry.secondaryFocus && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getFocusColor(entry.secondaryFocus)}`}>
                              {entry.secondaryFocus}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{entry.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}
