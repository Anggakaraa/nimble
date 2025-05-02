"use client"

import { useState } from "react"

export default function Page() {
  const [effort, setEffort] = useState("")
  const [primaryFocus, setPrimaryFocus] = useState("")
  const [secondaryFocus, setSecondaryFocus] = useState("")
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://v0-nimble-app.vercel.app"

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

      if (data.routine) {
        localStorage.setItem("routineData", JSON.stringify(data.routine))
        window.location.href = "/routine"
      } else {
        alert("No routine was returned. Try again.")
      }
    } catch (err) {
      console.error("Error:", err)
      alert("Something went wrong while generating your routine.")
    } finally {
      setLoading(false)
    }
  }

  const focusOptions = ["hips", "knee & ankle", "shoulder & wrist", "spine"]
  const timeOptions = ["<30 minutes", "30-45 minutes", ">45 minutes"]
  const effortOptions = ["Restore", "Build", "Push"]

  return (
    <main className="min-h-screen bg-white px-6 py-16 flex flex-col justify-center items-center text-black">
      <form onSubmit={handleSubmit} className="max-w-2xl w-full space-y-10 text-lg leading-relaxed">
        <h1 className="text-4xl font-bold text-center">Let’s get 1% more nimble today</h1>

        <p className="text-center text-gray-600">Let's get 1% more nimble everyday!</p>

        <p className="text-black">
          I'm feeling like{" "}
          <select
            value={effort}
            onChange={(e) => setEffort(e.target.value)}
            required
            className="underline bg-white border-b border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="" disabled>select effort</option>
            {effortOptions.map((option) => (
              <option key={option} value={option}>{option.toLowerCase()}</option>
            ))}
          </select>{" "}
          today. I want to focus on{" "}
          <select
            value={primaryFocus}
            onChange={(e) => setPrimaryFocus(e.target.value)}
            required
            className="underline bg-white border-b border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="" disabled>primary area</option>
            {focusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>{" "}
          with a pinch of{" "}
          <select
            value={secondaryFocus}
            onChange={(e) => setSecondaryFocus(e.target.value)}
            className="underline bg-white border-b border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="">none</option>
            {focusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select
          >, and I have{" "}
          <select
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="underline bg-white border-b border-gray-300 focus:outline-none focus:border-black"
          >
            <option value="" disabled>select time</option>
            {timeOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>{" "}
          to train.
        </p>

        <div className="text-black">
          <label className="block mb-2 text-lg font-medium">Anything else you'd like to share?</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. I've been sitting all day, want to loosen up the hips"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
            rows={4}
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors"
          >
            {loading ? "Generating..." : "Generate Routine →"}
          </button>
        </div>
      </form>
    </main>
  )
}



