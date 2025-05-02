"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

export default function RoutinePage() {
  const [current, setCurrent] = useState(0)
  const [routineData, setRoutineData] = useState<any[] | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("routineData")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)

        // Handle both structured array or string-based formats
        if (typeof parsed === "string") {
          // If OpenAI returned raw string instead of JSON
          // You could split it or render in raw format
          console.warn("Routine is a raw string:", parsed)
        } else if (Array.isArray(parsed)) {
          setRoutineData(parsed)
        } else {
          console.warn("Unexpected format:", parsed)
        }
      } catch (e) {
        console.error("Failed to parse routineData:", e)
      }
    }
  }, [])

  if (!routineData) {
    return <p className="text-center text-gray-500 mt-20">Loading your routine...</p>
  }

  const next = () => setCurrent((prev) => (prev + 1) % routineData.length)
  const prev = () => setCurrent((prev) => (prev - 1 + routineData.length) % routineData.length)
  const exercise = routineData[current]

  const handleDragEnd = (_: any, { offset }: { offset: { x: number } }) => {
    if (offset.x < -50) next()
    else if (offset.x > 50) prev()
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 max-w-3xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-medium text-black">Nimble</h1>
        <Link href="/" className="text-sm text-gray-500 hover:text-black transition-colors">
          New Routine
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-4">
        <div className="mb-12">
          <h2 className="text-3xl font-normal text-black mb-1">Your Routine</h2>
          <p className="text-gray-500">Swipe through the flow</p>
        </div>

        <div className="relative h-[400px] mb-8">
          <div className="absolute top-0 left-0 w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={exercise.title}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={handleDragEnd}
                className="h-full w-full"
              >
                <div className="bg-gray-50 p-8 rounded-lg h-full">
                  <div className="flex justify-between items-start mb-6">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{exercise.stage}</p>
                    <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                      {current + 1}/{routineData.length}
                    </span>
                  </div>

                  <h3 className="text-3xl font-normal text-black mb-2">{exercise.title}</h3>
                  <p className="text-gray-500 mb-8">{exercise.duration}</p>

                  <div className="space-y-4">
                    {exercise.instructions?.map((step: string, i: number) => (
                      <div key={i} className="flex items-start">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-black text-white text-xs mr-3 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-black">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={prev} className="text-black px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">
            ← Previous
          </button>

          <div className="flex space-x-1">
            {routineData.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full ${i === current ? "bg-black" : "bg-gray-300"}`}
                aria-label={`Go to exercise ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={next} className="text-black px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">
            Next →
          </button>
        </div>
      </main>
    </div>
  )
}
