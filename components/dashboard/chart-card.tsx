"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReactNode } from "react"

interface ChartCardProps {
  title: string
  description?: string
  children: ReactNode
  action?: ReactNode
}

export function ChartCard({ title, description, children, action }: ChartCardProps) {
  return (
    <Card className="falcon-card">
      <CardHeader className="falcon-card-header">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="falcon-card-title">{title}</CardTitle>
            {description && <CardDescription className="falcon-card-description">{description}</CardDescription>}
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="falcon-card-content">{children}</CardContent>
    </Card>
  )
}
