"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react"
import { FavoriteButton } from "@/app/components/favorite-button"
import { SwipeIndicator } from "@/app/components/swipe-indicator"
import { ExerciseVideo } from "@/app/components/exercise-video"

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

export default function RoutinePage() {
  const [current, setCurrent] = useState(0)
  const [routineData, setRoutineData] = useState<any[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [showSwipeHelp, setShowSwipeHelp] = useState(true)
  const [showDebug, setShowDebug] = useState(false)

  // Add this function inside the component
  const markAsCompleted = () => {
    try {
      // Get existing progress data
      const savedProgress = localStorage.getItem("nimbleProgress")
      const progressData = savedProgress ? JSON.parse(savedProgress) : []

      // Add current routine to progress
      const routineInfo = JSON.parse(localStorage.getItem("routineFormData") || "{}")

      progressData.push({
        date: new Date().toISOString(),
        effort: routineInfo.effort || "Unknown",
        primaryFocus: routineInfo.primaryFocus || "Unknown",
        secondaryFocus: routineInfo.secondaryFocus,
        time: routineInfo.time || "Unknown",
        completed: true,
      })

      // Save updated progress
      localStorage.setItem("nimbleProgress", JSON.stringify(progressData))

      // Show confirmation
      alert("Great job! This routine has been added to your progress.")
    } catch (e) {
      console.error("Failed to save progress:", e)
    }
  }

  useEffect(() => {
    const fetchRoutine = async () => {
      setIsLoading(true)
      try {
        // Get both the raw response and the processed routine data
        const rawResponse = localStorage.getItem("routineRawResponse")
        const saved = localStorage.getItem("routineData")

        console.log("Raw response from localStorage:", rawResponse)
        console.log("Routine data from localStorage:", saved)

        if (!saved) {
          setError("No routine data found. Please generate a routine first.")
          setIsLoading(false)
          return
        }

        // Store debug info
        setDebugInfo({
          rawResponse: rawResponse ? JSON.parse(rawResponse) : null,
          routineData: saved ? JSON.parse(saved) : null,
        })

        // Try to parse the saved data
        try {
          const parsed = JSON.parse(saved)
          console.log("Parsed routine data:", parsed)

          // Handle different response formats
          if (typeof parsed === "string") {
            // If it's a string, we'll display it as a single card
            console.log("Routine data is a string, creating a single card")
            setRoutineData([
              {
                section: "Routine",
                title: "Your Mobility Routine",
                duration: "",
                instructions: [parsed],
                tools: ["None"],
                focus: "",
              },
            ])
          } else if (Array.isArray(parsed)) {
            // If it's already an array, use it directly
            console.log("Routine data is an array with", parsed.length, "items")
            setRoutineData(parsed)
          } else if (parsed.exercises && Array.isArray(parsed.exercises)) {
            // If it has an exercises property that's an array, use that
            console.log("Routine data has exercises array with", parsed.exercises.length, "items")
            setRoutineData(parsed.exercises)
          } else {
            // Otherwise, wrap it in an array
            console.log("Routine data is an object, wrapping in array")
            setRoutineData([parsed])
          }
        } catch (e) {
          console.error("Failed to parse routine data:", e)
          setError("Failed to parse routine data. Please try again.")
        }
      } catch (e) {
        console.error("Error loading routine:", e)
        setError("Error loading routine. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchRoutine()

    // Check if user has seen swipe help before
    const hasSeenSwipeHelp = localStorage.getItem("hasSeenSwipeHelp")
    if (hasSeenSwipeHelp) {
      setShowSwipeHelp(false)
    } else {
      // Set flag after showing help
      setTimeout(() => {
        localStorage.setItem("hasSeenSwipeHelp", "true")
      }, 5000)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your routine...</p>
        </div>
      </div>
    )
  }

  if (error || !routineData) {
    return (
      <div className="min-h-screen bg-white p-6">
        <header className="max-w-3xl mx-auto mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to form
          </Link>
        </header>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">{error || "Failed to load routine data"}</p>

          {/* Debug information */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Debug Information</h3>
            <div className="text-xs overflow-auto max-h-[300px]">
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Create a new routine
          </Link>
        </div>
      </div>
    )
  }

  const total = routineData.length
  const exercise = routineData[current]

  // If the exercise doesn't have the expected structure, show debug info
  if (!exercise || !exercise.title) {
    return (
      <div className="min-h-screen bg-white p-6">
        <header className="max-w-3xl mx-auto mb-8">
          <Link href="/" className="inline-flex items-center text-gray-500 hover:text-black">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to form
          </Link>
        </header>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-medium text-amber-600 mb-4">Unexpected Data Format</h2>
          <p className="text-gray-700 mb-6">The routine data doesn't have the expected structure.</p>

          {/* Debug information */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">Current Exercise Data</h3>
            <div className="text-xs overflow-auto max-h-[300px]">
              <pre>{JSON.stringify(exercise, null, 2)}</pre>
            </div>
          </div>

          <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">All Routine Data</h3>
            <div className="text-xs overflow-auto max-h-[300px]">
              <pre>{JSON.stringify(routineData, null, 2)}</pre>
            </div>
          </div>

          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Create a new routine
          </Link>
        </div>
      </div>
    )
  }

  const next = () => setCurrent((prev) => (prev + 1) % total)
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total)

  const handleDragEnd = (event: any, info: { offset: { x: number } }) => {
    console.log("Drag ended with offset:", info.offset.x)
    if (info.offset.x < -50) {
      console.log("Swiping to next exercise")
      next()
    } else if (info.offset.x > 50) {
      console.log("Swiping to previous exercise")
      prev()
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {showSwipeHelp && (
        <>
          <SwipeIndicator direction="left" />
          <SwipeIndicator direction="right" />
        </>
      )}

      <header className="px-6 py-8 max-w-3xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-4">
            <ArrowLeft className="w-5 h-5 text-gray-500 hover:text-black transition-colors" />
          </Link>
          <h1 className="text-2xl font-medium text-black">Nimble</h1>
        </div>
        <div className="flex items-center">
          <button onClick={() => setShowDebug(!showDebug)} className="text-xs text-gray-400 mr-3 hover:text-gray-600">
            {showDebug ? "Hide Debug" : "Debug"}
          </button>
          <span className="text-sm text-gray-500">
            {current + 1} / {total}
          </span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-20">
        <div className="mb-8">
          <h2 className="text-3xl font-normal text-black mb-1">Your Routine</h2>
          <p className="text-gray-500">Swipe left or right to navigate exercises</p>
        </div>

        <div className="relative min-h-[450px] mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${exercise.title}-${current}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="h-full w-full swipe-card touch-pan-y"
            >
              <div className={`p-8 rounded-xl border ${getFocusColor(exercise.focus || exercise.section)}`}>
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${getSectionColor(exercise.section)}`}>
                    {exercise.section}
                  </span>

                  <div className="flex items-center gap-2">
                    {exercise.focus && (
                      <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-700">{exercise.focus}</span>
                    )}
                    <FavoriteButton exercise={exercise} />
                  </div>
                </div>

                <h3 className="text-3xl font-normal text-black mb-2">{exercise.title}</h3>
                {exercise.duration && <p className="text-gray-500 mb-6">{exercise.duration}</p>}

                {/* Add the improved video component here with debug mode */}
                <ExerciseVideo
                  exerciseName={exercise.title}
                  focus={exercise.focus}
                  section={exercise.section}
                  debug={showDebug}
                />

                <div className="space-y-4 mb-8">
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
                  <div className="mt-6 pt-6 border-t border-gray-200">
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
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={markAsCompleted}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            Mark as Completed
          </button>
        </div>

        {/* Navigation buttons - ensure these are visible and working */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 bottom-nav z-10">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <button
              onClick={prev}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              aria-label="Previous exercise"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex space-x-1">
              {routineData.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-black" : "bg-gray-300"}`}
                  aria-label={`Go to exercise ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 text-black hover:bg-gray-200 transition-colors"
              aria-label="Next exercise"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
