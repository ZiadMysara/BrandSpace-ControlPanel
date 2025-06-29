"use client"

import { useState } from "react"
import { FalconSidebar } from "@/components/falcon-sidebar"
import { FalconHeader } from "@/components/falcon-header"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Home, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  const [locale, setLocale] = useState<"en" | "ar">("en")

  return (
    <div className={cn("falcon-dashboard", locale === "ar" && "rtl")}>
      <FalconSidebar locale={locale} onLocaleChange={setLocale} />

      <div className={cn("lg:pl-72 flex flex-col flex-1", locale === "ar" && "lg:pl-0 lg:pr-72")}>
        <FalconHeader
          title={locale === "ar" ? "الصفحة غير موجودة" : "Page Not Found"}
          subtitle={locale === "ar" ? "الصفحة المطلوبة غير متوفرة" : "The requested page could not be found"}
          locale={locale}
        />

        {/* Main content */}
        <main className="falcon-main p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="falcon-card max-w-md w-full text-center">
            <CardHeader className="falcon-card-header">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <CardTitle className="falcon-card-title text-2xl">
                {locale === "ar" ? "404 - الصفحة غير موجودة" : "404 - Page Not Found"}
              </CardTitle>
              <CardDescription className="falcon-card-description">
                {locale === "ar"
                  ? "عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر."
                  : "Sorry, the page you are looking for doesn't exist or has been moved to another location."}
              </CardDescription>
            </CardHeader>
            <CardContent className="falcon-card-content">
              <div className="space-y-4">
                <Link href="/admin">
                  <Button className="falcon-btn-primary w-full">
                    <Home className="h-4 w-4 mr-2" />
                    {locale === "ar" ? "العودة إلى لوحة التحكم" : "Back to Dashboard"}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => window.history.back()} className="falcon-btn-outline w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {locale === "ar" ? "العودة للصفحة السابقة" : "Go Back"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
