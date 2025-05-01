"use client"
import { cn } from "@/lib/utils"

interface ToolSelectorProps {
  value: string[]
  onValueChange: (value: string[]) => void
}

export function ToolSelector({ value, onValueChange }: ToolSelectorProps) {
  const tools = [
    { id: "resistance-band", name: "Resistance Band" },
    { id: "foam-roller", name: "Foam Roller" },
    { id: "mini-band", name: "Mini Band" },
    { id: "dumbbell", name: "Dumbbell" },
  ]

  const toggleTool = (toolId: string) => {
    if (value.includes(toolId)) {
      onValueChange(value.filter((id) => id !== toolId))
    } else {
      onValueChange([...value, toolId])
    }
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {tools.map((tool) => (
        <button
          key={tool.id}
          type="button"
          onClick={() => toggleTool(tool.id)}
          className={cn(
            "flex items-center justify-center p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors",
            value.includes(tool.id) && "bg-[#5c6ac4] text-white hover:bg-[#4c5aa4] border-[#5c6ac4]",
          )}
        >
          {tool.name}
        </button>
      ))}
    </div>
  )
}
