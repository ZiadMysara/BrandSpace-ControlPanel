"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Building2,
  Calendar,
  CreditCard,
  Home,
  MessageSquare,
  Settings,
  ShoppingBag,
  Users,
  Bell,
  Globe,
  Sun,
  Moon,
  Search,
  Zap,
  TrendingUp,
  FileText,
  Shield,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import Link from "next/link"

const navigationGroups = [
  {
    title: "MAIN",
    items: [
      { name: "Dashboard", href: "/admin", icon: Home },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "MANAGEMENT",
    items: [
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Malls", href: "/admin/malls", icon: Building2 },
      { name: "Shops", href: "/admin/shops", icon: ShoppingBag },
      { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      { name: "Bookings", href: "/admin/bookings", icon: Calendar },
      { name: "Payments", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "REPORTS",
    items: [
      { name: "Reports", href: "/admin/reports", icon: FileText },
      { name: "Performance", href: "/admin/performance", icon: TrendingUp },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
      { name: "Security", href: "/admin/security", icon: Shield },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
]

const navigationGroupsAr = [
  {
    title: "الرئيسية",
    items: [
      { name: "لوحة التحكم", href: "/admin", icon: Home },
      { name: "التحليلات", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    title: "الإدارة",
    items: [
      { name: "المستخدمين", href: "/admin/users", icon: Users },
      { name: "المولات", href: "/admin/malls", icon: Building2 },
      { name: "المحلات", href: "/admin/shops", icon: ShoppingBag },
      { name: "الاستفسارات", href: "/admin/inquiries", icon: MessageSquare },
      { name: "الحجوزات", href: "/admin/bookings", icon: Calendar },
      { name: "المدفوعات", href: "/admin/payments", icon: CreditCard },
    ],
  },
  {
    title: "التقارير",
    items: [
      { name: "التقارير", href: "/admin/reports", icon: FileText },
      { name: "الأداء", href: "/admin/performance", icon: TrendingUp },
    ],
  },
  {
    title: "النظام",
    items: [
      { name: "الإشعارات", href: "/admin/notifications", icon: Bell },
      { name: "الأمان", href: "/admin/security", icon: Shield },
      { name: "الإعدادات", href: "/admin/settings", icon: Settings },
    ],
  },
]

interface FalconSidebarProps {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
}

export function FalconSidebar({ locale, onLocaleChange }: FalconSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar Toggle Area - Invisible clickable area on the edge */}
      <div
        className={cn(
          "fixed top-0 bottom-0 z-40 w-4 cursor-pointer",
          "hover:bg-blue-500/10 transition-colors duration-200",
          locale === "ar" ? "right-0" : "left-0"
        )}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label={locale === "ar" ? "فتح/إغلاق القائمة" : "Toggle sidebar"}
      />

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 z-50 w-80 transform transition-all duration-300 ease-out",
          "shadow-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          locale === "ar" && "right-0 left-auto",
          locale === "ar" && (sidebarOpen ? "translate-x-0" : "translate-x-full"),
        )}
      >
        <SidebarContent
          locale={locale}
          onLocaleChange={onLocaleChange}
          pathname={pathname}
          onClose={() => setSidebarOpen(false)}
          isOpen={sidebarOpen}
        />
      </div>

      {/* Content Overlay when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-all duration-300 ease-out" 
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  )
}

interface SidebarContentProps {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
  pathname: string
  onClose: () => void
  isOpen: boolean
}

function SidebarContent({
  locale,
  onLocaleChange,
  pathname,
  onClose,
  isOpen,
}: SidebarContentProps) {
  const { theme, setTheme } = useTheme()
  const navGroups = locale === "ar" ? navigationGroupsAr : navigationGroups

  return (
    <div className="flex flex-col h-full bg-white/98 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between p-6 border-b border-slate-100/80 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">BrandSpace</h1>
            <p className="text-sm text-slate-500 font-medium">Admin Panel</p>
          </div>
        </div>
        
        {/* Close indicator */}
        <div className="flex items-center space-x-2">
          <div className="text-xs text-slate-400 font-medium">
            {locale === "ar" ? "اضغط للإغلاق" : "Click to close"}
          </div>
          <div className="w-2 h-2 bg-slate-300 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Enhanced Search */}
      <div className="p-4 border-b border-slate-100/80">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-blue-500 transition-colors" />
          <Input
            placeholder={locale === "ar" ? "البحث..." : "Search..."}
            className="pl-10 bg-slate-50/80 border-slate-200/60 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 rounded-lg"
          />
        </div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-3">
            <h3 className="px-3 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
              {group.title}
              <div className="flex-1 h-px bg-gradient-to-r from-slate-200 to-transparent ml-3"></div>
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                      "hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                      locale === "ar" && "flex-row-reverse",
                      isActive
                        ? "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100/50"
                        : "text-slate-600 hover:border-slate-200/50"
                    )}
                  >
                    <div className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200",
                      locale === "ar" ? "ml-3" : "mr-3",
                      isActive 
                        ? "bg-blue-100 text-blue-600" 
                        : "text-slate-500 group-hover:bg-slate-100 group-hover:text-slate-700"
                    )}>
                      <item.icon className="h-4 w-4" strokeWidth={2} />
                    </div>
                    <span className="flex-1">{item.name}</span>
                    {isActive && (
                      <ChevronRight className={cn(
                        "h-4 w-4 text-blue-500",
                        locale === "ar" && "rotate-180"
                      )} />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Enhanced Footer Controls */}
      <div className="p-4 border-t border-slate-100/80 bg-slate-50/30 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLocaleChange(locale === "en" ? "ar" : "en")}
          className={cn(
            "w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-lg transition-all duration-200",
            "focus:ring-2 focus:ring-blue-500/20",
            locale === "ar" && "flex-row-reverse"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600",
            locale === "ar" ? "ml-2" : "mr-2"
          )}>
            <Globe className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="font-medium">{locale === "en" ? "العربية" : "English"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn(
            "w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-white/60 rounded-lg transition-all duration-200",
            "focus:ring-2 focus:ring-blue-500/20",
            locale === "ar" && "flex-row-reverse"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-600",
            locale === "ar" ? "ml-2" : "mr-2"
          )}>
            {theme === "light" ? (
              <Moon className="h-4 w-4" strokeWidth={2} />
            ) : (
              <Sun className="h-4 w-4" strokeWidth={2} />
            )}
          </div>
          <span className="font-medium">
            {theme === "light"
              ? locale === "ar"
                ? "الوضع المظلم"
                : "Dark Mode"
              : locale === "ar"
                ? "الوضع المضيء"
                : "Light Mode"}
          </span>
        </Button>
      </div>
    </div>
  )
}