"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Building2, ShoppingBag, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data for charts
const revenueData = [
  { month: "Jan", revenue: 45000, users: 1200 },
  { month: "Feb", revenue: 52000, users: 1350 },
  { month: "Mar", revenue: 48000, users: 1280 },
  { month: "Apr", revenue: 61000, users: 1420 },
  { month: "May", revenue: 55000, users: 1380 },
  { month: "Jun", revenue: 67000, users: 1520 },
]

const bookingsData = [
  { day: "Mon", bookings: 45 },
  { day: "Tue", bookings: 52 },
  { day: "Wed", bookings: 38 },
  { day: "Thu", bookings: 61 },
  { day: "Fri", bookings: 55 },
  { day: "Sat", bookings: 67 },
  { day: "Sun", bookings: 43 },
]

const categoryData = [
  { name: "Retail", value: 35, color: "#1a365d" },
  { name: "Food & Beverage", value: 25, color: "#2c5282" },
  { name: "Entertainment", value: 20, color: "#e53e3e" },
  { name: "Services", value: 20, color: "#718096" },
]

export default function AdminDashboard() {
  const [locale, setLocale] = useState<"en" | "ar">("en")

  const metrics = [
    {
      title: locale === "ar" ? "إجمالي المستخدمين" : "Total Users",
      value: "12,543",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-[#1a365d]",
      bgColor: "bg-[#1a365d]/10",
    },
    {
      title: locale === "ar" ? "المولات النشطة" : "Active Malls",
      value: "89",
      change: "+3.2%",
      trend: "up",
      icon: Building2,
      color: "text-[#2c5282]",
      bgColor: "bg-[#2c5282]/10",
    },
    {
      title: locale === "ar" ? "المحلات المؤجرة" : "Rented Shops",
      value: "1,247",
      change: "+8.1%",
      trend: "up",
      icon: ShoppingBag,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: locale === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue",
      value: "$67,000",
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "text-[#e53e3e]",
      bgColor: "bg-[#e53e3e]/10",
    },
  ]

  const recentActivities = [
    {
      id: 1,
      type: "booking",
      message: locale === "ar" ? "حجز جديد في مول الرياض" : "New booking at Riyadh Mall",
      time: "2 minutes ago",
      status: "success",
    },
    {
      id: 2,
      type: "payment",
      message: locale === "ar" ? "دفعة مستلمة من محل الأزياء" : "Payment received from Fashion Store",
      time: "15 minutes ago",
      status: "success",
    },
    {
      id: 3,
      type: "inquiry",
      message: locale === "ar" ? "استفسار جديد عن مساحة تجارية" : "New inquiry about retail space",
      time: "1 hour ago",
      status: "pending",
    },
    {
      id: 4,
      type: "user",
      message: locale === "ar" ? "مستخدم جديد مسجل" : "New user registered",
      time: "2 hours ago",
      status: "info",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={`${locale === "ar" ? "lg:mr-64" : "lg:ml-64"} transition-all duration-300`}>
        <FalconHeader
          title={locale === "ar" ? "لوحة التحكم" : "Dashboard"}
          subtitle={locale === "ar" ? "نظرة عامة على أداء النظام" : "Overview of system performance"}
          locale={locale}
        />

        <main className="p-6">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="brandspace-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">{metric.title}</p>
                      <p className="text-2xl font-bold brandspace-text-primary mt-2">{metric.value}</p>
                      <div className="flex items-center mt-2">
                        {metric.trend === "up" ? (
                          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span
                          className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}
                        >
                          {metric.change}
                        </span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                      <metric.icon className={`h-6 w-6 ${metric.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Revenue Chart */}
            <Card className="brandspace-card">
              <CardHeader>
                <CardTitle className="brandspace-text-primary">
                  {locale === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}
                </CardTitle>
                <CardDescription>
                  {locale === "ar"
                    ? "نمو الإيرادات خلال الأشهر الستة الماضية"
                    : "Revenue growth over the last 6 months"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
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
                        dataKey="revenue"
                        stroke="#1a365d"
                        fill="#1a365d"
                        fillOpacity={0.1}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bookings Chart */}
            <Card className="brandspace-card">
              <CardHeader>
                <CardTitle className="brandspace-text-primary">
                  {locale === "ar" ? "الحجوزات الأسبوعية" : "Weekly Bookings"}
                </CardTitle>
                <CardDescription>
                  {locale === "ar" ? "عدد الحجوزات خلال الأسبوع الحالي" : "Number of bookings this week"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookingsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="day" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e2e8f0",
                          borderRadius: "8px",
                        }}
                      />
                      <Bar dataKey="bookings" fill="#1a365d" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Distribution */}
            <Card className="brandspace-card">
              <CardHeader>
                <CardTitle className="brandspace-text-primary">
                  {locale === "ar" ? "توزيع الفئات" : "Category Distribution"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {categoryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
                        <span className="text-sm text-slate-600">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activities */}
            <Card className="brandspace-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="brandspace-text-primary">
                  {locale === "ar" ? "الأنشطة الحديثة" : "Recent Activities"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center">
                        <div
                          className={`w-2 h-2 rounded-full mr-3 ${
                            activity.status === "success"
                              ? "bg-green-500"
                              : activity.status === "pending"
                                ? "bg-yellow-500"
                                : "bg-[#1a365d]"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900">{activity.message}</p>
                          <p className="text-xs text-slate-500">{activity.time}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          activity.status === "success"
                            ? "default"
                            : activity.status === "pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
