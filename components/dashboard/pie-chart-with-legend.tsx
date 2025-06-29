"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"

interface PieChartData {
  name: string
  value: number
  color: string
}

interface PieChartWithLegendProps {
  data: PieChartData[]
  height?: number
  innerRadius?: number
  outerRadius?: number
}

export function PieChartWithLegend({
  data,
  height = 264,
  innerRadius = 60,
  outerRadius = 100,
}: PieChartWithLegendProps) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No data available
      </div>
    )
  }

  return (
    <>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-slate-900">{item.value}%</span>
          </div>
        ))}
      </div>
    </>
  )
}