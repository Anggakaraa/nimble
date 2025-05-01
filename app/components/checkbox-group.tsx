"\"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface CheckboxGroupProps {
  value: string[]
  onValueChange: (value: string[]) => void
  children: React.ReactNode
  className?: string
}

export function CheckboxGroup({ value, onValueChange, children, className }: CheckboxGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<CheckboxItemProps>, {
            checked: value.includes((child.props as CheckboxItemProps).value),
            onCheckedChange: (checked: boolean) => {
              if (checked) {
                onValueChange([...value, (child.props as CheckboxItemProps).value])
              } else {
                onValueChange(value.filter((v) => v !== (child.props as CheckboxItemProps).value))
              }
            },
          })
        }
        return child
      })}
    </div>
  )
}

interface CheckboxItemProps {
  value: string
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  children: React.ReactNode
  className?: string
}

export function CheckboxItem({ value, checked, onCheckedChange, children, className }: CheckboxItemProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={`checkbox-${value}`}
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="bg-zinc-800 border-zinc-700 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
      />
      <Label htmlFor={`checkbox-${value}`} className="text-sm font-medium leading-none text-zinc-300 cursor-pointer">
        {children}
      </Label>
    </div>
  )
}
