"use client"

import { motion } from "framer-motion"

interface ProgressBarProps {
  progress: number // 0 to 100
  isIndeterminate?: boolean
}

export function ProgressBar({ progress, isIndeterminate = false }: ProgressBarProps) {
  return (
    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
      {isIndeterminate ? (
        <motion.div
          className="h-full bg-black"
          initial={{ width: "0%" }}
          animate={{
            width: ["0%", "100%", "0%"],
            x: ["0%", "0%", "100%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
      ) : (
        <motion.div
          className="h-full bg-black"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      )}
    </div>
  )
}
