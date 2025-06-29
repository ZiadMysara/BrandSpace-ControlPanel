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

interface RecentActivity {
  id: number
  user: string
  action: string
  target: string
  time: string
  avatar: string
  type: string
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
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
    fetchRecentActivities()
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

  const fetchRecentActivities = async () => {
    try {
      // Fetch recent inquiries and bookings for activity feed
      const [inquiriesResult, bookingsResult] = await Promise.all([
        supabase
          .from("inquiries")
          .select(`
            id,
            inquiry_type,
            created_at,
            users (user_name),
            shops (title)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("bookings")
          .select(`
            id,
            booking_type,
            created_at,
            users (user_name),
            shops (title)
          `)
          .order("created_at", { ascending: false })
          .limit(5),
      ])

      const activities: RecentActivity[] = []

      // Add inquiries to activities
      inquiriesResult.data?.forEach((inquiry) => {
        activities.push({
          id: inquiry.id,
          user: inquiry.users?.user_name || "Unknown User",
          action: "Created new inquiry",
          target: inquiry.shops?.title || "Unknown Shop",
          time: new Date(inquiry.created_at).toLocaleString(),
          avatar: inquiry.users?.user_name?.substring(0, 2).toUpperCase() || "UN",
          type: "inquiry",
        })
      })

      // Add bookings to activities
      bookingsResult.data?.forEach((booking) => {
        activities.push({
          id: booking.id,
          user: booking.users?.user_name || "Unknown User",
          action: "Created new booking",
          target: booking.shops?.title || "Unknown Shop",
          time: new Date(booking.created_at).toLocaleString(),
          avatar: booking.users?.user_name?.substring(0, 2).toUpperCase() || "UN",
          type: "booking",
        })
      })

      // Sort by most recent and take top 10
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      setRecentActivities(activities.slice(0, 10))
    } catch (error) {
      console.error("Error fetching recent activities:", error)
    }
  }

  // Shop status distribution data from database
  const getShopStatusData = () => {
    if (!stats.totalShops) return []
    
    const rentedShops = Math.round((stats.occupancyRate / 100) * stats.totalShops)
    const availableShops = stats.totalShops - rentedShops
    
    return [
      { name: "Available", value: Math.round((availableShops / stats.totalShops) * 100), color: "#3b82f6" },
      { name: "Rented", value: stats.occupancyRate, color: "#10b981" },
    ]
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
              title={locale === "ar" ? "الإيرادات الإجمالية" : "Total Revenue"}
              value={loading ? "..." : `$${stats.totalRevenue.toLocaleString()}`}
              change={{ value: `+${stats.monthlyGrowth}%`, type: "positive" }}
              icon={DollarSign}
              iconColor="text-orange-600"
            />
          </div>

          {/* Charts Row - Falcon style */}
          <div className="falcon-grid falcon-grid-2 mb-8">
            {/* Shop Status Distribution */}
            <Card className="falcon-card">
              <CardHeader className="falcon-card-header">
                <CardTitle className="falcon-card-title">{locale === "ar" ? "حالة المحلات" : "Shop Status"}</CardTitle>
                <CardDescription className="falcon-card-description">
                  {locale === "ar" ? "توزيع المحلات حسب الحالة" : "Distribution by status"}
                </CardDescription>
              </CardHeader>
              <CardContent className="falcon-card-content">
                {stats.totalShops > 0 ? (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={getShopStatusData()}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {getShopStatusData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-64 flex items-center justify-center text-slate-500">
                    {locale === "ar" ? "لا توجد بيانات متاحة" : "No data available"}
                  </div>
                )}
                <div className="mt-4 space-y-2">
                  {getShopStatusData().map((item, index) => (
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
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={`${activity.type}-${activity.id}`} className="flex items-start space-x-3">
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
                            activity.type === "booking" && "bg-green-500",
                          )}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-500">
                      {locale === "ar" ? "لا توجد أنشطة حديثة" : "No recent activities"}
                    </div>
                  )}
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
                      {locale === "ar" ? "إجمالي الحجوزات" : "Total Bookings"}
                    </p>
                    <p className="text-2xl font-bold text-slate-900">{stats.totalBookings}</p>
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