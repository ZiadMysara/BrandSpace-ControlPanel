"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface RecentActivityItemProps {
  user: string
  action: string
  target: string
  time: string
  avatar: string
  type: string
}

export function RecentActivityItem({ user, action, target, time, avatar, type }: RecentActivityItemProps) {
  return (
    <div className="flex items-start space-x-3">
      <Avatar className="h-8 w-8 falcon-avatar">
        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{avatar}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900">
          <span className="font-medium">{user}</span> <span className="text-slate-600">{action}</span>
        </p>
        <p className="text-sm text-slate-600">{target}</p>
        <p className="text-xs text-slate-500 mt-1">{time}</p>
      </div>
      <div
        className={cn(
          "w-2 h-2 rounded-full mt-2",
          type === "inquiry" && "bg-blue-500",
          type === "booking" && "bg-green-500"
        )}
      />
    </div>
  )
}
