"use client"

import { useState, useEffect } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  BarChart3,
  Users,
  Building2,
  ShoppingBag,
  DollarSign,
  CalendarIcon,
  Download,
  FileText,
  Activity,
} from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"
import { FalconMetricCard } from "@/components/falcon-metric-card"

interface ReportData {
  totalUsers: number
  totalMalls: number
  totalShops: number
  totalRevenue: number
  monthlyGrowth: number
  userGrowth: number
  mallGrowth: number
  shopGrowth: number
}

export default function ReportsPage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)

      // Fetch users count
      const { count: usersCount } = await supabase.from("users").select("*", { count: "exact", head: true })

      // Fetch malls count
      const { count: mallsCount } = await supabase.from("malls").select("*", { count: "exact", head: true })

      // Fetch shops count
      const { count: shopsCount } = await supabase.from("shops").select("*", { count: "exact", head: true })

      // Fetch payments for revenue calculation
      const { data: payments } = await supabase.from("payments").select("amount").eq("payment_status", "completed")

      const totalRevenue = payments?.reduce((sum, payment) => sum + payment.amount, 0) || 0

      setReportData({
        totalUsers: usersCount || 0,
        totalMalls: mallsCount || 0,
        totalShops: shopsCount || 0,
        totalRevenue,
        monthlyGrowth: 12.5,
        userGrowth: 8.2,
        mallGrowth: 15.3,
        shopGrowth: 22.1,
      })
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = (format: "pdf" | "excel") => {
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "التقارير" : "Reports"}
          subtitle={
            locale === "ar"
              ? "تحليل شامل لأداء النظام والإحصائيات"
              : "Comprehensive analytics and system performance insights"
          }
          locale={locale}
        />

        <main className="falcon-main p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="falcon-btn-outline">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="falcon-btn-outline">
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, to: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => exportReport("pdf")} variant="outline" className="falcon-btn-outline">
                <FileText className="w-4 h-4 mr-2" />
                {locale === "ar" ? "تصدير PDF" : "Export PDF"}
              </Button>
              <Button onClick={() => exportReport("excel")} className="falcon-btn-primary">
                <Download className="w-4 h-4 mr-2" />
                {locale === "ar" ? "تصدير Excel" : "Export Excel"}
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="falcon-grid falcon-grid-4 mb-8">
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المستخدمين" : "Total Users"}
              value={loading ? "..." : reportData?.totalUsers.toLocaleString() || "0"}
              change={{ value: `+${reportData?.userGrowth || 0}%`, type: "positive" }}
              icon={Users}
              iconColor="text-blue-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المولات" : "Total Malls"}
              value={loading ? "..." : reportData?.totalMalls.toLocaleString() || "0"}
              change={{ value: `+${reportData?.mallGrowth || 0}%`, type: "positive" }}
              icon={Building2}
              iconColor="text-emerald-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي المحلات" : "Total Shops"}
              value={loading ? "..." : reportData?.totalShops.toLocaleString() || "0"}
              change={{ value: `+${reportData?.shopGrowth || 0}%`, type: "positive" }}
              icon={ShoppingBag}
              iconColor="text-purple-600"
            />
            <FalconMetricCard
              title={locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
              value={loading ? "..." : `$${reportData?.totalRevenue.toLocaleString() || "0"}`}
              change={{ value: `+${reportData?.monthlyGrowth || 0}%`, type: "positive" }}
              icon={DollarSign}
              iconColor="text-orange-600"
            />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="falcon-tabs-list">
              <TabsTrigger value="overview">{locale === "ar" ? "نظرة عامة" : "Overview"}</TabsTrigger>
              <TabsTrigger value="users">{locale === "ar" ? "المستخدمين" : "Users"}</TabsTrigger>
              <TabsTrigger value="revenue">{locale === "ar" ? "الإيرادات" : "Revenue"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    {locale === "ar" ? "ملخص البيانات" : "Data Summary"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {locale === "ar" ? "المستخدمين النشطين" : "Active Users"}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {reportData?.totalUsers || 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {locale === "ar" ? "المولات المتاحة" : "Available Malls"}
                      </span>
                      <span className="font-semibold text-slate-900">{reportData?.totalMalls || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {locale === "ar" ? "المحلات المتاحة" : "Available Shops"}
                      </span>
                      <span className="font-semibold text-slate-900">{reportData?.totalShops || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">
                        {locale === "ar" ? "إجمالي الإيرادات" : "Total Revenue"}
                      </span>
                      <span className="font-semibold text-green-600">${reportData?.totalRevenue.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="falcon-card">
                <CardHeader className="falcon-card-header">
                  <CardTitle className="falcon-card-title">
                    {locale === "ar" ? "تحليل المستخدمين" : "User Analytics"}
                  </CardTitle>
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "إحصائيات مفصلة حول نشاط المستخدمين" : "Detailed statistics about user activity"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      {locale === "ar"
                        ? `إجمالي المستخدمين المسجلين: ${reportData?.totalUsers || 0}`
                        : `Total Registered Users: ${reportData?.totalUsers || 0}`}
                    </p>
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
                  <CardDescription className="falcon-card-description">
                    {locale === "ar" ? "تتبع الإيرادات والمدفوعات" : "Track revenue and payment trends"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="falcon-card-content">
                  <div className="text-center py-12">
                    <p className="text-slate-600">
                      {locale === "ar"
                        ? `إجمالي الإيرادات: $${reportData?.totalRevenue.toLocaleString() || 0}`
                        : `Total Revenue: $${reportData?.totalRevenue.toLocaleString() || 0}`}
                    </p>
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
