"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  change: string
  changeType: "increase" | "decrease"
  icon: LucideIcon
  color: "blue" | "green" | "purple" | "orange" | "red"
  locale: "en" | "ar"
}

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    icon: "text-blue-600",
    badge: "bg-blue-100 text-blue-800",
  },
  green: {
    bg: "bg-green-50",
    icon: "text-green-600",
    badge: "bg-green-100 text-green-800",
  },
  purple: {
    bg: "bg-purple-50",
    icon: "text-purple-600",
    badge: "bg-purple-100 text-purple-800",
  },
  orange: {
    bg: "bg-orange-50",
    icon: "text-orange-600",
    badge: "bg-orange-100 text-orange-800",
  },
  red: {
    bg: "bg-red-50",
    icon: "text-red-600",
    badge: "bg-red-100 text-red-800",
  },
}

export function FalconMetricCard({ title, value, change, changeType, icon: Icon, color, locale }: MetricCardProps) {
  const colors = colorClasses[color]

  return (
    <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-[#1a365d] mb-2">{value}</p>
            <div className="flex items-center">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-medium",
                  changeType === "increase" ? colors.badge : "bg-red-100 text-red-800",
                )}
              >
                {changeType === "increase" ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {change}
              </Badge>
              <span className="text-xs text-slate-500 ml-2">
                {locale === "ar" ? "من الشهر الماضي" : "from last month"}
              </span>
            </div>
          </div>
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
