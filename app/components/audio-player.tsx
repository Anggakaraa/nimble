"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipForward, Volume2, VolumeX } from "lucide-react"

interface AudioPlayerProps {
  exercises: any[]
}

export function AudioPlayer({ exercises }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      speechRef.current = new SpeechSynthesisUtterance()

      // Set voice (optional)
      const voices = window.speechSynthesis.getVoices()
      const preferredVoice = voices.find((voice) => voice.lang === "en-US" && !voice.localService)
      if (preferredVoice) {
        speechRef.current.voice = preferredVoice
      }

      speechRef.current.rate = 0.9 // Slightly slower
      speechRef.current.pitch = 1

      // Handle speech end
      speechRef.current.onend = () => {
        if (currentExercise < exercises.length - 1) {
          // Wait 2 seconds before next exercise
          setTimeout(() => {
            setCurrentExercise((prev) => prev + 1)
          }, 2000)
        } else {
          setIsPlaying(false)
        }
      }
    }

    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel()
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  // Handle exercise change
  useEffect(() => {
    if (isPlaying && speechRef.current && exercises[currentExercise]) {
      const exercise = exercises[currentExercise]

      // Create the speech text
      const speechText = `
        ${exercise.section}: ${exercise.title}. 
        ${exercise.duration}.
        ${exercise.instructions.map((instr: string, i: number) => `Step ${i + 1}: ${instr}`).join(". ")}
        ${exercise.tools && exercise.tools[0] !== "None" ? `Tools needed: ${exercise.tools.join(", ")}` : ""}
      `

      speechRef.current.text = speechText
      window.speechSynthesis.speak(speechRef.current)

      // Set a timer based on the exercise duration
      let seconds = 60 // Default 1 minute
      const durationText = exercise.duration.toLowerCase()

      if (durationText.includes("sec")) {
        const match = durationText.match(/(\d+)\s*sec/)
        if (match) seconds = Number.parseInt(match[1])
      } else if (durationText.includes("min")) {
        const match = durationText.match(/(\d+)\s*min/)
        if (match) seconds = Number.parseInt(match[1]) * 60
      }

      setRemainingTime(seconds)

      if (timerRef.current) {
        clearInterval(timerRef.current)
      }

      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [currentExercise, isPlaying, exercises])

  const togglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel()
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
    }
  }

  const skipForward = () => {
    window.speechSynthesis.cancel()
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    if (currentExercise < exercises.length - 1) {
      setCurrentExercise((prev) => prev + 1)
    } else {
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (speechRef.current) {
      speechRef.current.volume = isMuted ? 1 : 0
      setIsMuted(!isMuted)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!exercises || exercises.length === 0) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-10 px-4">
      <div className="max-w-3xl mx-auto bg-black text-white rounded-lg p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1 mr-4">
            <p className="font-medium truncate">{exercises[currentExercise]?.title || "No exercise"}</p>
            <p className="text-xs text-gray-400 truncate">
              {exercises[currentExercise]?.section || ""} •{" "}
              {remainingTime > 0 ? formatTime(remainingTime) : "Listening"}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMute}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>

            <button
              onClick={skipForward}
              className="text-gray-300 hover:text-white transition-colors"
              aria-label="Skip to next exercise"
              disabled={currentExercise >= exercises.length - 1}
            >
              <SkipForward className={`w-5 h-5 ${currentExercise >= exercises.length - 1 ? "opacity-50" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
