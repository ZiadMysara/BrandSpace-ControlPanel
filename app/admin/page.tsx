"use client"

import { useState } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { FalconMetricCard } from "@/components/falcon-metric-card"
import { DashboardStatsCard } from "@/components/dashboard/dashboard-stats-card"
import { RecentActivityItem } from "@/components/dashboard/recent-activity-item"
import { ChartCard } from "@/components/dashboard/chart-card"
import { PieChartWithLegend } from "@/components/dashboard/pie-chart-with-legend"
import { useDashboardData } from "@/hooks/use-dashboard-data"
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
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function FalconDashboard() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const { stats, recentActivities, loading, connectionError } = useDashboardData()

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

  // Show connection error if exists
  if (connectionError) {
    return (
      <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
        <FalconSidebar locale={locale} onLocaleChange={setLocale} />

        <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
          <FalconHeader
            title={locale === "ar" ? "خطأ في الاتصال" : "Connection Error"}
            subtitle={locale === "ar" ? "فشل في الاتصال بقاعدة البيانات" : "Failed to connect to database"}
            locale={locale}
          />

          <main className="falcon-main p-6">
            <Card className="falcon-card max-w-2xl mx-auto">
              <CardHeader className="falcon-card-header">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                  <div>
                    <CardTitle className="falcon-card-title text-red-900">
                      {locale === "ar" ? "خطأ في قاعدة البيانات" : "Database Connection Error"}
                    </CardTitle>
                    <CardDescription className="falcon-card-description">
                      {locale === "ar" ? "تعذر الاتصال بقاعدة البيانات" : "Unable to connect to the database"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="falcon-card-content">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-red-800 font-mono">{connectionError}</p>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <p><strong>Possible solutions:</strong></p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Check if Supabase environment variables are correctly set</li>
                    <li>Verify database tables exist and are accessible</li>
                    <li>Ensure Supabase project is active and not paused</li>
                    <li>Check network connectivity</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    )
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

        <main className="falcon-main p-6">
          {/* Top Metrics - Using FalconMetricCard component */}
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

          {/* Charts Row - Using reusable components */}
          <div className="falcon-grid falcon-grid-2 mb-8">
            <ChartCard
              title={locale === "ar" ? "حالة المحلات" : "Shop Status"}
              description={locale === "ar" ? "توزيع المحلات حسب الحالة" : "Distribution by status"}
            >
              <PieChartWithLegend data={getShopStatusData()} />
            </ChartCard>

            <ChartCard
              title={locale === "ar" ? "النشاط الأخير" : "Recent Activity"}
              action={
                <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                  {locale === "ar" ? "عرض الكل" : "View All"}
                </Button>
              }
            >
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <RecentActivityItem
                      key={`${activity.type}-${activity.id}`}
                      user={activity.user}
                      action={activity.action}
                      target={activity.target}
                      time={activity.time}
                      avatar={activity.avatar}
                      type={activity.type}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    {locale === "ar" ? "لا توجد أنشطة حديثة" : "No recent activities"}
                  </div>
                )}
              </div>
            </ChartCard>
          </div>

          {/* Quick Stats Row - Using DashboardStatsCard component */}
          <div className="falcon-grid falcon-grid-4">
            <DashboardStatsCard
              title={locale === "ar" ? "الاستفسارات الجديدة" : "New Inquiries"}
              value={stats.recentInquiries}
              icon={MessageSquare}
              iconColor="text-blue-600"
              progress={75}
              progressLabel="75% of monthly target"
            />
            <DashboardStatsCard
              title={locale === "ar" ? "المستخدمين النشطين" : "Active Users"}
              value={stats.activeUsers}
              icon={Users}
              iconColor="text-green-600"
              progress={85}
              progressLabel="85% engagement rate"
            />
            <DashboardStatsCard
              title={locale === "ar" ? "إجمالي الحجوزات" : "Total Bookings"}
              value={stats.totalBookings}
              icon={Eye}
              iconColor="text-purple-600"
              progress={60}
              progressLabel="60% conversion rate"
            />
            <DashboardStatsCard
              title={locale === "ar" ? "متوسط وقت الاستجابة" : "Avg Response Time"}
              value="2.4h"
              icon={Clock}
              iconColor="text-orange-600"
              progress={90}
              progressLabel="90% within SLA"
            />
          </div>
        </main>
      </div>
    </div>
  )
}