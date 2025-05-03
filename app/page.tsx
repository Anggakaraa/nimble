"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { ProgressBar } from "./components/progress-bar"

export default function Page() {
  const [effort, setEffort] = useState("")
  const [primaryFocus, setPrimaryFocus] = useState("")
  const [secondaryFocus, setSecondaryFocus] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const focusOptions = ["Hips", "Ankle & Knee", "Shoulder & Wrist", "Spine"]
  const timeOptions = ["<30 minutes", "30-45 minutes", ">45 minutes"]
  const effortOptions = ["Restore", "Build", "Push"]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setDebugInfo(null)
    setGenerationProgress(10) // Start progress

    try {
      console.log("Submitting form with data:", { effort, primaryFocus, secondaryFocus, time, notes })

      // Store form data for progress tracking
      localStorage.setItem(
        "routineFormData",
        JSON.stringify({
          effort,
          primaryFocus,
          secondaryFocus,
          time,
          notes,
        }),
      )

      // Simulate progress steps
      setGenerationProgress(30)
      setTimeout(() => setGenerationProgress(50), 500)

      // Use relative URL since the API is in the same project
      const res = await fetch("/api/generate-routine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ effort, primaryFocus, secondaryFocus, time, notes }),
      })

      setGenerationProgress(70)

      console.log("API response status:", res.status)

      // Get the response text for debugging
      const responseText = await res.text()
      console.log("API response text:", responseText)

      // Try to parse the response as JSON
      let data
      try {
        data = JSON.parse(responseText)
        console.log("API response data:", data)
      } catch (parseError) {
        console.error("Failed to parse API response as JSON:", parseError)
        setError(`Failed to parse API response: ${responseText}`)
        setDebugInfo({ responseText, error: parseError })
        setLoading(false)
        return
      }

      if (!res.ok) {
        const errorMessage = data?.error || `API responded with status: ${res.status}`
        setError(errorMessage)
        setDebugInfo({ status: res.status, data })
        setLoading(false)
        return
      }

      setGenerationProgress(90)

      if (!data || (!data.routine && !data.result)) {
        setError("No routine was returned from the API.")
        setDebugInfo({ data })
        setLoading(false)
        return
      }

      // Store the raw response for debugging
      localStorage.setItem("routineRawResponse", JSON.stringify(data))

      // Store the routine data
      const routineData = data.routine || data.result
      console.log("Storing routine data:", routineData)
      localStorage.setItem("routineData", JSON.stringify(routineData))

      setGenerationProgress(100)

      // Redirect to the routine page
      setTimeout(() => {
        window.location.href = "/routine"
      }, 500) // Short delay to show 100% progress
    } catch (err) {
      console.error("Error:", err)
      setError(err instanceof Error ? err.message : "Something went wrong while generating your routine.")
      setDebugInfo({ error: err })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-medium text-black">Nimble</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-4">
        <h2 className="text-3xl font-normal text-black mb-12">Let's get 1% more nimble everyday!</h2>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>

            {debugInfo && (
              <details className="mt-2">
                <summary className="text-sm font-medium cursor-pointer">Debug Information</summary>
                <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-[200px]">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </div>
        )}

        {loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Generating your personalized routine...</p>
            <ProgressBar progress={generationProgress} />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="space-y-8">
            <p className="text-xl leading-relaxed text-black">
              I'm feeling like
              <span className="relative inline-block mx-2 min-w-[120px]">
                <select
                  className="appearance-none bg-transparent border-b border-gray-300 focus:border-black focus:outline-none px-1 py-0.5 pr-6 w-full"
                  value={effort}
                  onChange={(e) => setEffort(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    select
                  </option>
                  {effortOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.toLowerCase()}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              today. I want to focus on
              <span className="relative inline-block mx-2 min-w-[160px]">
                <select
                  className="appearance-none bg-transparent border-b border-gray-300 focus:border-black focus:outline-none px-1 py-0.5 pr-6 w-full"
                  value={primaryFocus}
                  onChange={(e) => setPrimaryFocus(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    select area
                  </option>
                  {focusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option.toLowerCase()}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {secondaryFocus ? (
                <>
                  with a little extra love for
                  <span className="relative inline-block mx-2 min-w-[160px]">
                    <select
                      className="appearance-none bg-transparent border-b border-gray-300 focus:border-black focus:outline-none px-1 py-0.5 pr-6 w-full"
                      value={secondaryFocus}
                      onChange={(e) => setSecondaryFocus(e.target.value)}
                    >
                      <option value="" disabled>
                        select area
                      </option>
                      {focusOptions.map((option) => (
                        <option key={option} value={option}>
                          {option.toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                      width="12"
                      height="6"
                      viewBox="0 0 12 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 1L6 5L11 1"
                        stroke="black"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </>
              ) : (
                <span
                  className="mx-2 text-gray-500 cursor-pointer hover:text-black transition-colors"
                  onClick={() => setSecondaryFocus(" ")}
                >
                  + add secondary focus
                </span>
              )}
              . I've got about
              <span className="relative inline-block mx-2 min-w-[140px]">
                <select
                  className="appearance-none bg-transparent border-b border-gray-300 focus:border-black focus:outline-none px-1 py-0.5 pr-6 w-full"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    select time
                  </option>
                  {timeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none"
                  width="12"
                  height="6"
                  viewBox="0 0 12 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 1L6 5L11 1"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              to train.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-normal text-black">Anything else you'd like to share?</label>
            <textarea
              className="w-full bg-gray-50 p-4 border-none focus:ring-0 focus:outline-none rounded-lg text-black resize-none"
              placeholder="e.g. I've been sitting all day, want to loosen the hips."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-8 py-3 rounded-full hover:bg-gray-800 transition-colors font-normal text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Generating...
              </span>
            ) : (
              "Generate Routine"
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
