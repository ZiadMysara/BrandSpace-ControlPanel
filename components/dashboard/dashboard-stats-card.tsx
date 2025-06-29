"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { DivideIcon as LucideIcon } from "lucide-react"

interface DashboardStatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  progress?: number
  progressLabel?: string
}

export function DashboardStatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  progress,
  progressLabel,
}: DashboardStatsCardProps) {
  return (
    <Card className="falcon-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
          </div>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        {progress !== undefined && (
          <div className="mt-4">
            <Progress value={progress} className="falcon-progress h-2" />
            {progressLabel && <p className="text-xs text-slate-500 mt-2">{progressLabel}</p>}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
