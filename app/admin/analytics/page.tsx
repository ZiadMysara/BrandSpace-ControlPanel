"use client"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { FalconMetricCard } from "@/components/falcon-metric-card"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, Users, DollarSign, Activity, Download } from "lucide-react"
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample analytics data
const performanceData = [
  { month: "Jan", users: 1200, sessions: 3400, pageViews: 8900, bounceRate: 32 },
  { month: "Feb", users: 1400, sessions: 3800, pageViews: 9500, bounceRate: 28 },
  { month: "Mar", users: 1100, sessions: 3200, pageViews: 8200, bounceRate: 35 },
  { month: "Apr", users: 1600, sessions: 4200, pageViews: 11000, bounceRate: 25 },
  { month: "May", users: 1800, sessions: 4800, pageViews: 12500, bounceRate: 22 },
  { month: "Jun", users: 2000, sessions: 5200, pageViews: 13800, bounceRate: 20 },
]

const revenueData = [
  { month: "Jan", revenue: 125000, profit: 45000, expenses: 80000 },
  { month: "Feb", revenue: 180000, profit: 72000, expenses: 108000 },
  { month: "Mar", revenue: 165000, profit: 58000, expenses: 107000 },
  { month: "Apr", revenue: 220000, profit: 95000, expenses: 125000 },
  { month: "May", revenue: 195000, profit: 78000, expenses: 117000 },
  { month: "Jun", revenue: 275000, profit: 125000, expenses: 150000 },
]

const trafficSources = [
  { name: "Direct", value: 35, color: "#3b82f6" },
  { name: "Search", value: 28, color: "#10b981" },
  { name: "Social", value: 20, color: "#f97316" },
  { name: "Referral", value: 12, color: "#8b5cf6" },
  { name: "Email", value: 5, color: "#ef4444" },
]

export default function AnalyticsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState("30d")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSessions: 0,
    avgSessionDuration: "0m",
    bounceRate: 0,
    conversionRate: 0,
    revenue: 0,
  })

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalUsers: 12500,
        totalSessions: 28400,
        avgSessionDuration: "4m 32s",
        bounceRate: 24.5,
        conversionRate: 3.2,
        revenue: 1160000,
      })
    } catch (error) {
      console.error("Error fetching analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "التحليلات" : "Analytics"}
          subtitle={
            locale === "ar"
              ? "تحليل شامل لأداء المنصة والمستخدمين"
              : "Comprehensive platform and user performance insights"
          }
          locale={locale}
        />

        <main className="falcon-main p-6">
          {/* Controls */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-48 falcon-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">{locale === "ar" ? "آخر 7 أيام" : "Last 7 days"}</SelectItem>
                  <SelectItem value="30d">{locale === "ar" ? "آخر 30 يوم" : "Last 30 days"}</SelectItem>
                  <SelectItem value="90d">{locale === "ar" ? "آخر 90 يوم" : "Last 90 days"}</SelectItem>
                  <SelectItem value="1y">{locale === "ar" ? "آخر سنة" : "Last year"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="falcon-btn-primary">
              <Download className="h-4 w-4 mr-2" />
              {locale === "ar" ? "تصدير التقرير" : "Export Report"}
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="falcon-grid falcon-grid-4 mb-8">
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المستخدمين" : "Total Users"}
              value={loading ? "..." : stats.totalUsers.toLocaleString()}
              change={{ value: "+12.5%", type: "positive" }}
              icon={Users}
              iconColor="text-blue-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي الجلسات" : "Total Sessions"}
              value={loading ? "..." : stats.totalSessions.toLocaleString()}
              change={{ value: "+8.2%", type: "positive" }}
              icon={Activity}
              iconColor="text-emerald-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "معدل الارتداد" : "Bounce Rate"}
              value={loading ? "..." : `${stats.bounceRate}%`}
              change={{ value: "-2.1%", type: "positive" }}
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "معدل التحويل" : "Conversion Rate"}
              value={loading ? "..." : `${stats.conversionRate}%`}
              change={{ value: "+0.8%", type: "positive" }}
              icon={DollarSign}
              iconColor="text-orange-600"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="falcon-tabs-list">
              <TabsTrigger value="overview">{locale === "ar" ? "نظرة عامة" : "Overview"}</TabsTrigger>
              <TabsTrigger value="users">{locale === "ar" ? "المستخدمين" : "Users"}</TabsTrigger>
              <TabsTrigger value="revenue">{locale === "ar" ? "الإيرادات" : "Revenue"}</TabsTrigger>
              <TabsTrigger value="traffic">{locale === "ar" ? "الزيارات" : "Traffic"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="falcon-grid falcon-grid-3 mb-6">
                <div className="lg:col-span-2">
                  <Card className="falcon-card h-full">
                    <CardHeader className="falcon-card-header">
                      <CardTitle className="falcon-card-title">
                        {locale === "ar" ? "أداء المستخدمين" : "User Performance"}
                      </CardTitle>
                      <CardDescription className="falcon-card-description">
                        {locale === "ar" ? "المستخدمين والجلسات خلال الأشهر الماضية" : "Users and sessions over time"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="falcon-card-content">
                      <div className="h-80 w-full min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs>
                              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                              <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "white",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                            <Area
                              type="monotone"
                              dataKey="users"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorUsers)"
                              name={locale === "ar" ? "المستخدمين" : "Users"}
                            />
                            <Area
                              type="monotone"
                              dataKey="sessions"
                              stroke="#10b981"
                              strokeWidth={2}
                              fillOpacity={1}
                              fill="url(#colorSessions)"
                              name={locale === "ar" ? "الجلسات" : "Sessions"}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="falcon-card">
                  <CardHeader className="falcon-card-header">
                    <CardTitle className="falcon-card-title">
                      {locale === "ar" ? "مصادر الزيارات" : "Traffic Sources"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="falcon-card-content">
                    <div className="h-64 w-full min-h-[256px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={trafficSources}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {trafficSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-2">
                      {trafficSources.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-slate-600">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "تحليل المستخدمين" : "User Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="falcon-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "تحليل الإيرادات" : "Revenue Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="falcon-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="profit"
                          stackId="2"
                          stroke="#10b981"
                          fill="#10b981"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="traffic">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "تحليل الزيارات" : "Traffic Analytics"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="falcon-chart-container">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                        <YAxis stroke="#64748b" fontSize={12} />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="pageViews"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={{ fill: "#3b82f6" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="bounceRate"
                          stroke="#ef4444"
                          strokeWidth={2}
                          dot={{ fill: "#ef4444" }}
                        />
                      </LineChart>
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
