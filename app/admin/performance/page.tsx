"use client"

import { useState } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Clock, Target, Zap } from "lucide-react"

export default function PerformancePage() {
  const [locale, setLocale] = useState<"en" | "ar">("en")

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "تقارير الأداء" : "Performance Reports"}
          subtitle={locale === "ar" ? "مراقبة أداء النظام والتطبيق" : "Monitor system and application performance"}
          locale={locale} 
        />

        {/* Main content */}
        <main className="falcon-main p-6">
          {/* Performance Metrics */}
          <div className="falcon-grid falcon-grid-4 mb-6">
            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "وقت الاستجابة" : "Response Time"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">245ms</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "معدل النجاح" : "Success Rate"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">99.8%</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">{locale === "ar" ? "الإنتاجية" : "Throughput"}</p>
                    <p className="text-3xl font-bold text-slate-900">1.2K/s</p>
                  </div>
                  <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="falcon-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      {locale === "ar" ? "استخدام الخادم" : "Server Load"}
                    </p>
                    <p className="text-3xl font-bold text-slate-900">68%</p>
                  </div>
                  <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                    <Zap className="h-5 w-5 text-orange-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="falcon-card">
            <CardHeader className="falcon-card-header">
              <CardTitle className="falcon-card-title">
                {locale === "ar" ? "تقارير الأداء" : "Performance Reports"}
              </CardTitle>
              <CardDescription className="falcon-card-description">
                {locale === "ar" ? "مراقبة شاملة لأداء النظام" : "Comprehensive system performance monitoring"}
              </CardDescription>
            </CardHeader>
            <CardContent className="falcon-card-content">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {locale === "ar" ? "تقارير الأداء" : "Performance Analytics"}
                </h3>
                <p className="text-slate-600 mb-6">
                  {locale === "ar"
                    ? "عرض مفصل لمقاييس الأداء وإحصائيات النظام"
                    : "Detailed performance metrics and system analytics"}
                </p>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
