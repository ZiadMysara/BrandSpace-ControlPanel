"use client"

import type React from "react"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Calendar, Download, TrendingUp, Users, Building2, DollarSign } from "lucide-react"
import {
  LineChart,
  Line,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
} from "recharts"

// Sample analytics data
const userGrowthData = [
  { month: "Jan", users: 1200, newUsers: 150, activeUsers: 980 },
  { month: "Feb", users: 1350, newUsers: 180, activeUsers: 1100 },
  { month: "Mar", users: 1280, newUsers: 120, activeUsers: 1050 },
  { month: "Apr", users: 1420, newUsers: 200, activeUsers: 1200 },
  { month: "May", users: 1380, newUsers: 160, activeUsers: 1150 },
  { month: "Jun", users: 1520, newUsers: 220, activeUsers: 1300 },
  { month: "Jul", users: 1680, newUsers: 240, activeUsers: 1420 },
  { month: "Aug", users: 1750, newUsers: 190, activeUsers: 1480 },
]

const revenueAnalytics = [
  { month: "Jan", revenue: 45000, profit: 12000, expenses: 33000 },
  { month: "Feb", revenue: 52000, profit: 15000, expenses: 37000 },
  { month: "Mar", revenue: 48000, profit: 13000, expenses: 35000 },
  { month: "Apr", revenue: 61000, profit: 18000, expenses: 43000 },
  { month: "May", revenue: 55000, profit: 16000, expenses: 39000 },
  { month: "Jun", revenue: 67000, profit: 21000, expenses: 46000 },
  { month: "Jul", revenue: 72000, profit: 24000, expenses: 48000 },
  { month: "Aug", revenue: 68000, profit: 22000, expenses: 46000 },
]

const mallPerformance = [
  { name: "Riyadh Mall", occupancy: 95, revenue: 25000, shops: 120 },
  { name: "Jeddah Center", occupancy: 88, revenue: 22000, shops: 98 },
  { name: "Dammam Plaza", occupancy: 92, revenue: 18000, shops: 85 },
  { name: "Mecca Square", occupancy: 85, revenue: 15000, shops: 75 },
  { name: "Medina Hub", occupancy: 90, revenue: 12000, shops: 60 },
]

const categoryBreakdown = [
  { name: "Retail", value: 35, revenue: 24500, color: "#1a365d" },
  { name: "Food & Beverage", value: 25, revenue: 17500, color: "#2c5282" },
  { name: "Entertainment", value: 20, revenue: 14000, color: "#e53e3e" },
  { name: "Services", value: 15, revenue: 10500, color: "#718096" },
  { name: "Others", value: 5, revenue: 3500, color: "#a0aec0" },
]

interface Metric {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ComponentType<any>
  color: string
  bgColor: string
}

interface Activity {
  id: number
  type: string
  message: string
  time: string
  status: "success" | "pending" | "info"
}

export default function AnalyticsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [timeRange, setTimeRange] = useState("6months")

  const keyMetrics: Metric[] = [
    {
      title: locale === "ar" ? "إجمالي المستخدمين" : "Total Users",
      value: "1,750",
      change: "+12.5%",
      icon: Users,
      color: "text-[#1a365d]",
      bgColor: "bg-[#1a365d]/10",
    },
    {
      title: locale === "ar" ? "معدل الإشغال" : "Occupancy Rate",
      value: "90%",
      change: "+3.2%",
      icon: Building2,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: locale === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue",
      value: "$68,000",
      change: "+15.3%",
      icon: DollarSign,
      color: "text-[#e53e3e]",
      bgColor: "bg-[#e53e3e]/10",
    },
    {
      title: locale === "ar" ? "معدل النمو" : "Growth Rate",
      value: "18.2%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={`${locale === "ar" ? "lg:mr-64" : "lg:ml-64"} transition-all duration-300`}>
        <FalconHeader
          title={locale === "ar" ? "التحليلات" : "Analytics"}
          subtitle={locale === "ar" ? "تحليل مفصل لأداء النظام" : "Detailed system performance analysis"}
          locale={locale}
        />

        <main className="p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">{locale === "ar" ? "شهر واحد" : "1 Month"}</SelectItem>
                  <SelectItem value="3months">{locale === "ar" ? "3 أشهر" : "3 Months"}</SelectItem>
                  <SelectItem value="6months">{locale === "ar" ? "6 أشهر" : "6 Months"}</SelectItem>
                  <SelectItem value="1year">{locale === "ar" ? "سنة واحدة" : "1 Year"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                {locale === "ar" ? "تخصيص التاريخ" : "Custom Date"}
              </Button>
              <Button size="sm" className="brandspace-button-primary">
                <Download className="h-4 w-4 mr-2" />
                {locale === "ar" ? "تصدير" : "Export"}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {keyMetrics.map((metric, index) => (
              <Card key={index} className="brandspace-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold brandspace-text-primary mt-2">{metric.value}</p>
                      <p className="text-sm text-green-600 mt-1">{metric.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Analytics Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">{locale === "ar" ? "نظرة عامة" : "Overview"}</TabsTrigger>
              <TabsTrigger value="users">{locale === "ar" ? "المستخدمين" : "Users"}</TabsTrigger>
              <TabsTrigger value="revenue">{locale === "ar" ? "الإيرادات" : "Revenue"}</TabsTrigger>
              <TabsTrigger value="performance">{locale === "ar" ? "الأداء" : "Performance"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Growth Chart */}
                <Card className="brandspace-card">
                  <CardHeader>
                    <CardTitle className="brandspace-text-primary">
                      {locale === "ar" ? "نمو المستخدمين" : "User Growth"}
                    </CardTitle>
                    <CardDescription>
                      {locale === "ar" ? "نمو قاعدة المستخدمين مع الوقت" : "User base growth over time"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={userGrowthData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis dataKey="month" stroke="#64748b" />
                          <YAxis stroke="#64748b" />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "white",
                              border: "1px solid #e2e8f0",
                              borderRadius: "8px",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="users"
                            fill="#1a365d"
                            fillOpacity={0.1}
                            stroke="#1a365d"
                            strokeWidth={2}
                          />
                          <Bar dataKey="newUsers" fill="#e53e3e" radius={[2, 2, 0, 0]} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card className="brandspace-card">
                  <CardHeader>
                    <CardTitle className="brandspace-text-primary">
                      {locale === "ar" ? "توزيع الفئات" : "Category Breakdown"}
                    </CardTitle>
                    <CardDescription>
                      {locale === "ar" ? "توزيع الإيرادات حسب الفئة" : "Revenue distribution by category"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryBreakdown}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {categoryBreakdown.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {categoryBreakdown.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-600">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium">{item.value}%</span>
                            <p className="text-xs text-slate-500">${item.revenue.toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card className="brandspace-card">
                <CardHeader>
                  <CardTitle className="brandspace-text-primary">
                    {locale === "ar" ? "تحليل المستخدمين" : "User Analytics"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar" ? "تفاصيل نشاط المستخدمين" : "Detailed user activity insights"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={userGrowthData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="users"
                          stroke="#1a365d"
                          strokeWidth={3}
                          dot={{ fill: "#1a365d", strokeWidth: 2, r: 4 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          stroke="#e53e3e"
                          strokeWidth={2}
                          dot={{ fill: "#e53e3e", strokeWidth: 2, r: 3 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue" className="space-y-6">
              <Card className="brandspace-card">
                <CardHeader>
                  <CardTitle className="brandspace-text-primary">
                    {locale === "ar" ? "تحليل الإيرادات" : "Revenue Analytics"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar" ? "تفصيل الإيرادات والأرباح" : "Revenue and profit breakdown"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={revenueAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="month" stroke="#64748b" />
                        <YAxis stroke="#64748b" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="revenue" fill="#1a365d" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="expenses" fill="#718096" radius={[4, 4, 0, 0]} />
                        <Line
                          type="monotone"
                          dataKey="profit"
                          stroke="#e53e3e"
                          strokeWidth={3}
                          dot={{ fill: "#e53e3e", strokeWidth: 2, r: 4 }}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <Card className="brandspace-card">
                <CardHeader>
                  <CardTitle className="brandspace-text-primary">
                    {locale === "ar" ? "أداء المولات" : "Mall Performance"}
                  </CardTitle>
                  <CardDescription>
                    {locale === "ar" ? "مقارنة أداء المولات المختلفة" : "Performance comparison across different malls"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mallPerformance} layout="horizontal">
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis type="number" stroke="#64748b" />
                        <YAxis dataKey="name" type="category" stroke="#64748b" width={100} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="occupancy" fill="#1a365d" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
