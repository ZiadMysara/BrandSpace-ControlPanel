"use client"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { FalconMetricCard } from "@/components/falcon-metric-card"
import { cn } from "@/lib/utils"
import {
  Building2,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  Eye,
  Clock,
  ArrowUpRight,
  MoreHorizontal,
} from "lucide-react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

// Sample data for charts - Falcon colors
const monthlyData = [
  { month: "Jan", inquiries: 45, bookings: 12, revenue: 125000, visitors: 2400 },
  { month: "Feb", inquiries: 52, bookings: 18, revenue: 180000, visitors: 2800 },
  { month: "Mar", inquiries: 48, bookings: 15, revenue: 165000, visitors: 2600 },
  { month: "Apr", inquiries: 61, bookings: 22, revenue: 220000, visitors: 3200 },
  { month: "May", inquiries: 55, bookings: 19, revenue: 195000, visitors: 2900 },
  { month: "Jun", inquiries: 67, bookings: 25, revenue: 275000, visitors: 3400 },
]

const pieData = [
  { name: "Available", value: 45, color: "#3b82f6" },
  { name: "Rented", value: 30, color: "#10b981" },
  { name: "Reserved", value: 15, color: "#f97316" }, // Orange instead of yellow
  { name: "Maintenance", value: 10, color: "#ef4444" },
]

const recentActivities = [
  {
    id: 1,
    user: "Ahmed Al-Rashid",
    action: "Created new inquiry",
    target: "Mall Plaza Shop #205",
    time: "2 minutes ago",
    avatar: "AR",
    type: "inquiry",
  },
  {
    id: 2,
    user: "Sarah Johnson",
    action: "Completed payment",
    target: "$25,000 monthly rent",
    time: "15 minutes ago",
    avatar: "SJ",
    type: "payment",
  },
  {
    id: 3,
    user: "Mohammed Al-Fahad",
    action: "Updated shop status",
    target: "Shop #101 to Available",
    time: "1 hour ago",
    avatar: "MF",
    type: "update",
  },
  {
    id: 4,
    user: "Fatima Al-Zahra",
    action: "Scheduled viewing",
    target: "Riyadh Grand Mall",
    time: "2 hours ago",
    avatar: "FZ",
    type: "booking",
  },
]

const topShops = [
  { name: "Nike Sports Store", mall: "Riyadh Grand Mall", revenue: "$45,000", growth: "+12%", status: "rented" },
  { name: "Apple Store", mall: "Jeddah Commercial Center", revenue: "$38,500", growth: "+8%", status: "rented" },
  { name: "Zara Fashion", mall: "Dammam New Mall", revenue: "$32,000", growth: "+15%", status: "rented" },
  { name: "Starbucks Cafe", mall: "Riyadh Grand Mall", revenue: "$28,000", growth: "+5%", status: "rented" },
]

interface DashboardStats {
  totalMalls: number
  totalShops: number
  totalBookings: number
  totalRevenue: number
  recentInquiries: number
  activeUsers: number
  occupancyRate: number
  monthlyGrowth: number
}

export default function FalconDashboard() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [stats, setStats] = useState<DashboardStats>({
    totalMalls: 0,
    totalShops: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentInquiries: 0,
    activeUsers: 0,
    occupancyRate: 0,
    monthlyGrowth: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)

      // Fetch stats from Supabase
      const [mallsResult, shopsResult, bookingsResult, inquiriesResult, usersResult] = await Promise.all([
        supabase.from("malls").select("id", { count: "exact" }),
        supabase.from("shops").select("id, status", { count: "exact" }),
        supabase.from("bookings").select("id, total_amount", { count: "exact" }),
        supabase
          .from("inquiries")
          .select("id")
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase.from("users").select("id").eq("is_active", true),
      ])

      const totalRevenue = bookingsResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0
      const rentedShops = shopsResult.data?.filter((shop) => shop.status === "rented").length || 0
      const occupancyRate = shopsResult.count ? Math.round((rentedShops / shopsResult.count) * 100) : 0

      setStats({
        totalMalls: mallsResult.count || 0,
        totalShops: shopsResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalRevenue,
        recentInquiries: inquiriesResult.data?.length || 0,
        activeUsers: usersResult.data?.length || 0,
        occupancyRate,
        monthlyGrowth: 12.5, // This would be calculated based on historical data
      })
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "مرحباً، أهلاً بك!" : "Good Afternoon, Admin!"}
          subtitle={
            locale === "ar" ? "إليك ما يحدث في BrandSpace اليوم" : "Here's what's happening with BrandSpace today"
          }
          locale={locale}
        />

        {/* Main content */}
        <main className="falcon-main p-6">
          {/* Top Metrics - Exact Falcon style */}
          <div className="falcon-grid falcon-grid-4 mb-8">
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المولات" : "Total Malls"}
              value={loading ? "..." : stats.totalMalls}
              change={{ value: "+2.5%", type: "positive" }}
              icon={Building2}
              iconColor="text-blue-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المحلات" : "Total Shops"}
              value={loading ? "..." : stats.totalShops}
              change={{ value: "+8.2%", type: "positive" }}
              icon={ShoppingBag}
              iconColor="text-emerald-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "معدل الإشغال" : "Occupancy Rate"}
              value={loading ? "..." : `${stats.occupancyRate}%`}
              change={{ value: "+5.1%", type: "positive" }}
              icon={TrendingUp}
              iconColor="text-purple-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "الإيرادات الشهرية" : "Monthly Revenue"}
              value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
              change={{ value: `+${stats.monthlyGrowth}%`, type: "positive" }}
              icon={DollarSign}
              iconColor="text-orange-600"
            />
          </div>

          {/* Charts Row - Falcon style */}
          <div className="falcon-grid falcon-grid-3 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2">
              <Card className="falcon-card h-full">
                <CardHeader className="falcon-card-header">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="falcon-card-title">
                        {locale === "ar" ? "الإيرادات والحجوزات" : "Revenue & Bookings"}
                      </CardTitle>
                      <CardDescription className="falcon-card-description">
                        {locale === "ar" ? "الأداء خلال الأشهر الستة الماضية" : "Performance over the last 6 months"}
                      </CardDescription>
                    </div>
                    <Button variant="ghost" size="sm" className="hover:bg-slate-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="falcon-card-content p-0">
                  <div className="h-80 w-full p-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          }}
                          formatter={(value, name) => [
                            name === "revenue" ? `$${Number(value).toLocaleString()}` : value,
                            name === "revenue"
                              ? locale === "ar"
                                ? "الإيرادات"
                                : "Revenue"
                              : locale === "ar"
                                ? "الحجوزات"
                                : "Bookings",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorRevenue)"
                          name="revenue"
                        />
                        <Area
                          type="monotone"
                          dataKey="bookings"
                          stroke="#10b981"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorBookings)"
                          name="bookings"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Shop Status Distribution */}
            <Card className="falcon-card">
              <CardHeader className="falcon-card-header">
                <CardTitle className="falcon-card-title">{locale === "ar" ? "حالة المحلات" : "Shop Status"}</CardTitle>
                <CardDescription className="falcon-card-description">
                  {locale === "ar" ? "توزيع المحلات حسب الحالة" : "Distribution by status"}
                </CardDescription>
              </CardHeader>
              <CardContent className="falcon-card-content">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {pieData.map((item, index) => (
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

          {/* Bottom Row - Falcon style */}
          <div className="falcon-grid falcon-grid-2 mb-8">
            {/* Recent Activity */}
            <Card className="falcon-card">
              <CardHeader className="falcon-card-header">
                <div className="flex items-center justify-between">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "النشاط الأخير" : "Recent Activity"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    {locale === "ar" ? "عرض الكل" : "View All"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="falcon-card-content">
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8 falcon-avatar">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">{activity.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-900">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-slate-600">{activity.action}</span>
                        </p>
                        <p className="text-sm text-slate-600">{activity.target}</p>
                        <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                      </div>
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full mt-2",
                          activity.type === "inquiry" && "bg-blue-500",
                          activity.type === "payment" && "bg-green-500",
                          activity.type === "update" && "bg-orange-500",
                          activity.type === "booking" && "bg-purple-500",
                        )}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Shops */}
            <Card className="falcon-card">
              <CardHeader className="falcon-card-header">
                <div className="flex items-center justify-between">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "أفضل المحلات أداءً" : "Top Performing Shops"}
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                    {locale === "ar" ? "عرض التفاصيل" : "View Details"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="falcon-card-content">
                <div className="space-y-4">
                  {topShops.map((shop, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{shop.name}</p>
                        <p className="text-xs text-slate-500">{shop.mall}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900">{shop.revenue}</p>
                        <div className="flex items-center">
                          <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs text-green-600">{shop.growth}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Row - Falcon style */}
          <div className="falcon-grid falcon-grid-4">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "الاستفسارات الجديدة" : "New Inquiries"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{stats.recentInquiries}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                </div>
                <div className="mt-4">
                  <Progress value={75} className="falcon-progress h-2" />
                  <p className="text-xs text-slate-500 mt-2">75% of monthly target</p>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "المستخدمين النشطين" : "Active Users"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{stats.activeUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <div className="mt-4">
                  <Progress value={85} className="falcon-progress h-2" />
                  <p className="text-xs text-slate-500 mt-2">85% engagement rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "المعاينات المجدولة" : "Scheduled Viewings"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">24</p>
                  </div>
                  <Eye className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-4">
                  <Progress value={60} className="falcon-progress h-2" />
                  <p className="text-xs text-slate-500 mt-2">60% conversion rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "متوسط وقت الاستجابة" : "Avg Response Time"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">2.4h</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-600" />
                </div>
                <div className="mt-4">
                  <Progress value={90} className="falcon-progress h-2" />
                  <p className="text-xs text-slate-500 mt-2">90% within SLA</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
