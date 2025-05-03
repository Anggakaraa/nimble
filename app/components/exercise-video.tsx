"use client"

import { useState, useEffect } from "react"
import { Loader2, Youtube, AlertCircle } from "lucide-react"

interface ExerciseVideoProps {
  exerciseName: string
  focus?: string
  section?: string
  debug?: boolean
}

// Comprehensive mapping of common mobility exercises to specific YouTube video IDs
const VIDEO_MAPPING: Record<string, string[]> = {
  // Hip mobility
  hip: ["xOeV_3wvyxE", "iMACiL194Bg", "FAu6b-KjK_Q"],
  "hip cars": ["xOeV_3wvyxE", "iMACiL194Bg", "FAu6b-KjK_Q"],
  "hip controlled articular rotations": ["xOeV_3wvyxE", "iMACiL194Bg"],
  "90/90": ["9bnR9L9-qY0", "Nw3LBtVQjYc"],
  frog: ["kXHdR4sPUt4", "iKFoJMdLhEo"],
  "frog stretch": ["kXHdR4sPUt4", "iKFoJMdLhEo"],
  butterfly: ["RgXQ7Cqmulg", "iJaGde_mJZE"],
  cossack: ["cqW8gUfXTT4", "iMACiL194Bg"],
  "cossack squat": ["cqW8gUfXTT4", "iMACiL194Bg"],
  squat: ["cqW8gUfXTT4", "iMACiL194Bg"],

  // Shoulder mobility
  shoulder: ["5oLDdlb4vBM", "d_L-LQ6YvW4", "QKuU2OqZ-WM"],
  "shoulder cars": ["5oLDdlb4vBM", "d_L-LQ6YvW4", "QKuU2OqZ-WM"],
  "shoulder controlled articular rotations": ["5oLDdlb4vBM", "d_L-LQ6YvW4"],
  thoracic: ["RmGxwCmYl4Q", "X5JEPVUo3QU"],
  "thoracic bridge": ["RmGxwCmYl4Q", "X5JEPVUo3QU"],
  "thoracic mobility": ["RmGxwCmYl4Q", "X5JEPVUo3QU"],
  scapula: ["5oLDdlb4vBM", "d_L-LQ6YvW4"],
  wrist: ["c-yKfWAXMQY", "mSZiLJLUibc"],

  // Ankle mobility
  ankle: ["V057N-Vj0NY", "IikP_teeLkI", "XISJxsccN58"],
  "ankle cars": ["V057N-Vj0NY", "IikP_teeLkI", "XISJxsccN58"],
  "ankle controlled articular rotations": ["V057N-Vj0NY", "IikP_teeLkI"],
  foot: ["V057N-Vj0NY", "IikP_teeLkI"],
  knee: ["faUvT7zfsyk", "WGur7KIu9QY"],

  // Spine mobility
  spine: ["JU-1iQlLUzA", "KJBXKekEUL8", "ydWLLSZ1yfk"],
  neck: ["JU-1iQlLUzA", "K4dmZ5_n6E8"],
  "neck cars": ["JU-1iQlLUzA", "K4dmZ5_n6E8"],
  "neck controlled articular rotations": ["JU-1iQlLUzA", "K4dmZ5_n6E8"],
  "jefferson curl": ["KrNzLZNKw6k", "ZFisyXF2Akg"],
  "cat cow": ["kqnua4rHVVA", "Y_HhgFLWMK0"],
  "bird dog": ["wLOfy8WMNkk", "z59gRvMX4PU"],
  "dead bug": ["g_tea8ZNk5A", "JqTIlCiRzLM"],

  // Mobility techniques
  pails: ["ZFisyXF2Akg", "iMACiL194Bg"],
  rails: ["ZFisyXF2Akg", "iMACiL194Bg"],
  "pails rails": ["ZFisyXF2Akg", "iMACiL194Bg"],
  "pail rail": ["ZFisyXF2Akg", "iMACiL194Bg"],
  frc: ["ZFisyXF2Akg", "iMACiL194Bg"],
  cars: ["xOeV_3wvyxE", "5oLDdlb4vBM", "V057N-Vj0NY", "JU-1iQlLUzA"],
  "controlled articular rotations": ["xOeV_3wvyxE", "5oLDdlb4vBM"],

  // General mobility
  "world's greatest stretch": ["sDmMTzDBO0A", "qEHivKGYYFE"],
  "downward dog": ["YXYtAL0h_j0", "EC7RGJ975iM"],
  mobility: ["KrNzLZNKw6k", "ZFisyXF2Akg"],
  "warm up": ["sDmMTzDBO0A", "qEHivKGYYFE"],
  "cool down": ["sDmMTzDBO0A", "qEHivKGYYFE"],

  // Fallback videos for general sections
  "warm-up": ["sDmMTzDBO0A", "qEHivKGYYFE"],
  main: ["KrNzLZNKw6k", "ZFisyXF2Akg"],
  cooldown: ["sDmMTzDBO0A", "qEHivKGYYFE"],
}

export function ExerciseVideo({ exerciseName, focus, section, debug = false }: ExerciseVideoProps) {
  const [videoId, setVideoId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [searchTerms, setSearchTerms] = useState<string[]>([])

  useEffect(() => {
    // Reset state when exercise changes
    setVideoId(null)
    setLoading(true)
    setError(null)
    setExpanded(false)

    const findBestVideoMatch = () => {
      // Generate search terms from most specific to least specific
      const terms: string[] = []

      // 1. Full exercise name (most specific)
      terms.push(exerciseName.toLowerCase())

      // 2. Exercise name + focus
      if (focus) {
        terms.push(`${exerciseName.toLowerCase()} ${focus.toLowerCase()}`)
      }

      // 3. Key parts of the exercise name
      const nameParts = exerciseName.toLowerCase().split(" ")
      if (nameParts.length > 1) {
        // Add combinations of words
        for (let i = 0; i < nameParts.length; i++) {
          terms.push(nameParts[i])
          for (let j = i + 1; j < nameParts.length; j++) {
            terms.push(`${nameParts[i]} ${nameParts[j]}`)
          }
        }
      }

      // 4. Focus area
      if (focus) {
        terms.push(focus.toLowerCase())
      }

      // 5. Section as fallback
      if (section) {
        terms.push(section.toLowerCase())
      }

      // Remove duplicates
      const uniqueTerms = [...new Set(terms)]
      setSearchTerms(uniqueTerms)

      // Try to find a match for each term
      for (const term of uniqueTerms) {
        // Check for exact matches first
        for (const [key, videos] of Object.entries(VIDEO_MAPPING)) {
          if (term === key.toLowerCase()) {
            setVideoId(videos[0]) // Use the first video in the array
            setLoading(false)
            return true
          }
        }

        // Then check for partial matches
        for (const [key, videos] of Object.entries(VIDEO_MAPPING)) {
          if (term.includes(key.toLowerCase()) || key.toLowerCase().includes(term)) {
            setVideoId(videos[0]) // Use the first video in the array
            setLoading(false)
            return true
          }
        }
      }

      // If no match found, try to match based on section
      if (section) {
        const sectionLower = section.toLowerCase()
        if (sectionLower.includes("warm")) {
          setVideoId(VIDEO_MAPPING["warm-up"][0])
          setLoading(false)
          return true
        } else if (sectionLower.includes("cool")) {
          setVideoId(VIDEO_MAPPING["cooldown"][0])
          setLoading(false)
          return true
        } else if (sectionLower.includes("main")) {
          setVideoId(VIDEO_MAPPING["main"][0])
          setLoading(false)
          return true
        }
      }

      // Last resort - use a general mobility video
      setVideoId(VIDEO_MAPPING["mobility"][0])
      setLoading(false)
      return false
    }

    // Simulate a short delay to prevent UI flashing
    setTimeout(() => {
      const foundExactMatch = findBestVideoMatch()
      if (!foundExactMatch) {
        setError("No exact match found, showing a similar exercise")
      }
    }, 500)
  }, [exerciseName, focus, section])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-20 bg-gray-50 rounded-lg mb-6">
        <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
      </div>
    )
  }

  if (!videoId) {
    return null
  }

  return (
    <div className="mb-6">
      <div className={`relative overflow-hidden rounded-lg ${expanded ? "aspect-video" : "aspect-video max-h-48"}`}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?rel=0`}
          title={`${exerciseName} video demonstration`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button onClick={() => setExpanded(!expanded)} className="text-sm text-gray-500 flex items-center">
          <Youtube className="w-4 h-4 mr-1" />
          {expanded ? "Collapse video" : "Expand video"}
        </button>

        {error && (
          <div className="text-xs text-amber-600 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {error}
          </div>
        )}
      </div>

      {debug && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-500">
          <p>Search terms: {searchTerms.join(", ")}</p>
          <p>Video ID: {videoId}</p>
        </div>
      )}
    </div>
  )
}
