"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SwipeIndicatorProps {
  direction: "left" | "right"
}

export function SwipeIndicator({ direction }: SwipeIndicatorProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    // Hide after 5 seconds
    const timer = setTimeout(() => {
      setVisible(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!visible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed ${
          direction === "left" ? "left-4" : "right-4"
        } top-1/2 transform -translate-y-1/2 bg-black bg-opacity-70 text-white rounded-full p-3 z-20`}
      >
        {direction === "left" ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
      </motion.div>
    </AnimatePresence>
  )
}
