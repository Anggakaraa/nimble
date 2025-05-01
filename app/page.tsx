"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function Page() {
  const [effort, setEffort] = useState("")
  const [primaryFocus, setPrimaryFocus] = useState("")
  const [secondaryFocus, setSecondaryFocus] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const focusOptions = ["Hips", "Ankle & Knee", "Shoulder & Wrist", "Spine"]
  const timeOptions = ["<30 minutes", "30-45 minutes", ">45 minutes"]
  const effortOptions = ["Restore", "Build", "Push"]

  // Use environment variable for API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://your-default-api-url.vercel.app"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${apiUrl}/api/generate-routine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ effort, primaryFocus, secondaryFocus, time, notes }),
      })

      const data = await res.json()

      // Store the routine data in localStorage to access it on the routine page
      localStorage.setItem("routineData", JSON.stringify(data.result))

      // Redirect to the routine page
      window.location.href = "/routine"
    } catch (err) {
      console.error("Error generating routine:", err)
      setLoading(false)
      alert("An error occurred while generating your routine. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="px-6 py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-medium text-black">Nimble</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-4">
        <h2 className="text-3xl font-normal text-black mb-12">Let's get 1% more nimble everyday!</h2>

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
