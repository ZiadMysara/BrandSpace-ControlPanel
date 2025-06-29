"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  MessageSquare,
  CreditCard,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Bell,
  TrendingUp,
  Globe,
  Languages,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Image from "next/image"

interface SidebarProps {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
}

const menuItems = [
  {
    title: { en: "Dashboard", ar: "لوحة التحكم" },
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-blue-600",
  },
  {
    title: { en: "Analytics", ar: "التحليلات" },
    icon: BarChart3,
    href: "/admin/analytics",
    color: "text-green-600",
  },
  {
    title: { en: "Malls", ar: "المولات" },
    icon: Building2,
    href: "/admin/malls",
    color: "text-purple-600",
  },
  {
    title: { en: "Shops", ar: "المتاجر" },
    icon: Store,
    href: "/admin/shops",
    color: "text-orange-600",
  },
  {
    title: { en: "Users", ar: "المستخدمين" },
    icon: Users,
    href: "/admin/users",
    color: "text-blue-600",
  },
  {
    title: { en: "Inquiries", ar: "الاستفسارات" },
    icon: MessageSquare,
    href: "/admin/inquiries",
    color: "text-yellow-600",
  },
  {
    title: { en: "Bookings", ar: "الحجوزات" },
    icon: FileText,
    href: "/admin/bookings",
    color: "text-indigo-600",
  },
  {
    title: { en: "Payments", ar: "المدفوعات" },
    icon: CreditCard,
    href: "/admin/payments",
    color: "text-green-600",
  },
  {
    title: { en: "Reports", ar: "التقارير" },
    icon: TrendingUp,
    href: "/admin/reports",
    color: "text-red-600",
  },
  {
    title: { en: "Performance", ar: "الأداء" },
    icon: BarChart3,
    href: "/admin/performance",
    color: "text-pink-600",
  },
  {
    title: { en: "Notifications", ar: "الإشعارات" },
    icon: Bell,
    href: "/admin/notifications",
    color: "text-blue-600",
  },
  {
    title: { en: "Security", ar: "الأمان" },
    icon: Shield,
    href: "/admin/security",
    color: "text-red-600",
  },
  {
    title: { en: "Settings", ar: "الإعدادات" },
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-600",
  },
]

export function FalconSidebar({ locale, onLocaleChange }: SidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        "fixed inset-y-0 z-50 flex flex-col bg-white border-r border-slate-200 transition-all duration-300",
        isCollapsed ? "w-16" : "w-72",
        locale === "ar" && "right-0 border-l border-r-0",
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 bg-gradient-to-r from-[#1a365d] to-[#2c5282]">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-white p-1">
              <Image
                src="/brandspace-logo.jpeg"
                alt="BrandSpace"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-white">
              <h1 className="text-lg font-bold">BrandSpace</h1>
              <p className="text-xs text-blue-100">Admin Panel</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-white hover:bg-white/10"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-11 transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-[#1a365d] to-[#2c5282] text-white shadow-md"
                      : "text-slate-700 hover:bg-slate-100 hover:text-[#1a365d]",
                    isCollapsed && "justify-center px-2",
                  )}
                >
                  <Icon className={cn("h-5 w-5", !isCollapsed && "mr-3", isActive ? "text-white" : item.color)} />
                  {!isCollapsed && <span className="font-medium">{item.title[locale]}</span>}
                </Button>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        {!isCollapsed && (
          <>
            <Separator className="mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Language</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onLocaleChange(locale === "en" ? "ar" : "en")}
                className="h-8 px-3 text-xs border-slate-200 hover:bg-slate-50"
              >
                <Languages className="h-3 w-3 mr-1" />
                {locale === "en" ? "العربية" : "English"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
