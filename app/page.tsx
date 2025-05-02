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

  return (
    <div className="min-h-screen bg-white text-black px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Let’s get 1% more nimble everyday!</h1>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <label>
          I'm feeling like:{" "}
          <select required value={effort} onChange={(e) => setEffort(e.target.value)} className="border p-1 ml-2">
            <option value="">Select effort</option>
            <option value="Restore">Restore</option>
            <option value="Build">Build</option>
            <option value="Push">Push</option>
          </select>
        </label>

        <br />

        <label>
          I want to focus on:{" "}
          <select required value={primaryFocus} onChange={(e) => setPrimaryFocus(e.target.value)} className="border p-1 ml-2">
            <option value="">Select area</option>
            {focusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          Add secondary focus (optional):{" "}
          <select value={secondaryFocus} onChange={(e) => setSecondaryFocus(e.target.value)} className="border p-1 ml-2">
            <option value="">None</option>
            {focusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <br />

        <label>
          I have:{" "}
          <select required value={time} onChange={(e) => setTime(e.target.value)} className="border p-1 ml-2">
            <option value="">Select time</option>
            <option value="<30 minutes">&lt;30 minutes</option>
            <option value="30-45 minutes">30–45 minutes</option>
            <option value=">45 minutes">&gt;45 minutes</option>
          </select>
        </label>

        <br />

        <label className="block">
          Anything else to share?
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Been sitting all day..."
            className="border mt-1 p-2 w-full"
            rows={4}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Generating..." : "Generate Routine"}
        </button>
      </form>
    </div>
  )
}



