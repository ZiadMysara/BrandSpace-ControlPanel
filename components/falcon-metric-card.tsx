"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FalconMetricCardProps {
  title: string
  value: string | number
  change?: {
    value: string
    type: "positive" | "negative" | "neutral"
  }
  icon?: LucideIcon
  iconColor?: string
  className?: string
}

export function FalconMetricCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor = "text-blue-600",
  className,
}: FalconMetricCardProps) {
  return (
    <div className={cn("falcon-metric-card", className)}>
      <div className="falcon-metric-header">
        <div className="falcon-metric-label">{title}</div>
        {Icon && (
          <div className={cn("falcon-metric-icon bg-slate-50", iconColor)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="falcon-metric-value">{value}</div>

      {change && (
        <div className={cn("falcon-metric-change", change.type)}>
          <span className="mr-1">{change.type === "positive" ? "↗" : change.type === "negative" ? "↘" : "→"}</span>
          {change.value}
        </div>
      )}
    </div>
  )
}
