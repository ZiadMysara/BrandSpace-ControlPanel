"use client"
import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { FalconMetricCard } from "@/components/falcon-metric-card"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Building2,
  Store,
  Users,
  CreditCard,
  TrendingUp,
  Activity,
  DollarSign,
  ShoppingBag,
  MessageSquare,
  ArrowUpRight,
  Eye,
  Plus,
} from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Sample data
const revenueData = [
  { month: "Jan", revenue: 45000, bookings: 12 },
  { month: "Feb", revenue: 52000, bookings: 15 },
  { month: "Mar", revenue: 48000, bookings: 13 },
  { month: "Apr", revenue: 61000, bookings: 18 },
  { month: "May", revenue: 55000, bookings: 16 },
  { month: "Jun", revenue: 67000, bookings: 20 },
]

const categoryData = [
  { name: "Fashion", value: 35, color: "#1a365d" },
  { name: "Electronics", value: 25, color: "#2c5282" },
  { name: "Food & Beverage", value: 20, color: "#e53e3e" },
  { name: "Sports", value: 12, color: "#38a169" },
  { name: "Beauty", value: 8, color: "#d69e2e" },
]

const recentActivities = [
  {
    id: 1,
    type: "booking",
    title: "New booking confirmed",
    description: "Nike Store - Riyadh Grand Mall",
    time: "2 minutes ago",
    icon: ShoppingBag,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "inquiry",
    title: "New inquiry received",
    description: "Restaurant space in Jeddah Mall",
    time: "15 minutes ago",
    icon: MessageSquare,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "payment",
    title: "Payment received",
    description: "Monthly rent - Zara Boutique",
    time: "1 hour ago",
    icon: CreditCard,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "user",
    title: "New user registered",
    description: "Developer account created",
    time: "3 hours ago",
    icon: Users,
    color: "text-orange-600",
  },
]

export default function AdminDashboard() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1a365d] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen bg-slate-50", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "لوحة التحكم" : "Dashboard"}
          subtitle={locale === "ar" ? "نظرة عامة على أداء النظام" : "Overview of system performance"}
          locale={locale}
        />

        {/* Main content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#1a365d] to-[#2c5282] rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">
                    {locale === "ar" ? "مرحباً بك في BrandSpace" : "Welcome to BrandSpace"}
                  </h2>
                  <p className="text-blue-100 mb-4">
                    {locale === "ar"
                      ? "إدارة شاملة لمساحات التجارة والاستثمار العقاري"
                      : "Comprehensive management for commercial spaces and real estate investment"}
                  </p>
                  <div className="flex items-center space-x-4">
                    <Button variant="secondary" size="sm" className="bg-white text-[#1a365d] hover:bg-slate-100">
                      <Plus className="h-4 w-4 mr-2" />
                      {locale === "ar" ? "إضافة مول جديد" : "Add New Mall"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white text-white hover:bg-white hover:text-[#1a365d] bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {locale === "ar" ? "عرض التقارير" : "View Reports"}
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center">
                    <Building2 className="h-16 w-16 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المولات" : "Total Malls"}
              value="12"
              change="+2"
              changeType="increase"
              icon={Building2}
              color="blue"
              locale={locale}
            />
            <FalconMetricCard
              title={locale === "ar" ? "المتاجر النشطة" : "Active Shops"}
              value="248"
              change="+15"
              changeType="increase"
              icon={Store}
              color="green"
              locale={locale}
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المستخدمين" : "Total Users"}
              value="1,429"
              change="+89"
              changeType="increase"
              icon={Users}
              color="purple"
              locale={locale}
            />
            <FalconMetricCard
              title={locale === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}
              value="SAR 67,000"
              change="+12%"
              changeType="increase"
              icon={DollarSign}
              color="orange"
              locale={locale}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-[#1a365d] flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      {locale === "ar" ? "الإيرادات والحجوزات" : "Revenue & Bookings"}
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      {locale === "ar" ? "آخر 6 أشهر" : "Last 6 months"}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    +12%
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Revenue",
                      color: "#1a365d",
                    },
                    bookings: {
                      label: "Bookings",
                      color: "#e53e3e",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1a365d"
                        strokeWidth={3}
                        dot={{ fill: "#1a365d", strokeWidth: 2, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#e53e3e"
                        strokeWidth={3}
                        dot={{ fill: "#e53e3e", strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1a365d] flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {locale === "ar" ? "توزيع الفئات" : "Category Distribution"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {locale === "ar" ? "حسب نوع المتجر" : "By shop type"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Percentage",
                      color: "#1a365d",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activities */}
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1a365d] flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  {locale === "ar" ? "النشاطات الأخيرة" : "Recent Activities"}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {locale === "ar" ? "آخر التحديثات في النظام" : "Latest system updates"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-4 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className={cn(
                            "p-2 rounded-lg",
                            activity.color === "text-green-600" && "bg-green-100",
                            activity.color === "text-blue-600" && "bg-blue-100",
                            activity.color === "text-purple-600" && "bg-purple-100",
                            activity.color === "text-orange-600" && "bg-orange-100",
                          )}
                        >
                          <Icon className={cn("h-4 w-4", activity.color)} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                          <p className="text-sm text-slate-600">{activity.description}</p>
                          <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#1a365d]">{locale === "ar" ? "إحصائيات سريعة" : "Quick Stats"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">
                      {locale === "ar" ? "معدل الإشغال" : "Occupancy Rate"}
                    </span>
                    <span className="text-sm font-medium text-slate-900">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">
                      {locale === "ar" ? "رضا العملاء" : "Customer Satisfaction"}
                    </span>
                    <span className="text-sm font-medium text-slate-900">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">
                      {locale === "ar" ? "معدل التحصيل" : "Collection Rate"}
                    </span>
                    <span className="text-sm font-medium text-slate-900">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-700">
                      {locale === "ar" ? "هذا الشهر" : "This Month"}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        {locale === "ar" ? "استفسارات جديدة" : "New Inquiries"}
                      </span>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        24
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        {locale === "ar" ? "حجوزات مؤكدة" : "Confirmed Bookings"}
                      </span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        18
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600">
                        {locale === "ar" ? "مدفوعات معلقة" : "Pending Payments"}
                      </span>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                        3
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
