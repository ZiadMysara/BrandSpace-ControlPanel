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
  Menu,
  X,
  Globe,
  Sun,
  Moon,
  Search,
  Zap,
  TrendingUp,
  FileText,
  Shield,
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
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          locale === "ar" && "right-0 left-auto",
          locale === "ar" && (sidebarOpen ? "-translate-x-0" : "translate-x-full"),
        )}
      >
        <SidebarContent
          locale={locale}
          onLocaleChange={onLocaleChange}
          pathname={pathname}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col",
          locale === "ar" && "lg:right-0 lg:left-auto",
        )}
      >
        <SidebarContent locale={locale} onLocaleChange={onLocaleChange} pathname={pathname} />
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className={cn("fixed top-4 z-40 bg-white shadow-md", locale === "ar" ? "right-4" : "left-4")}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </>
  )
}

function SidebarContent({
  locale,
  onLocaleChange,
  pathname,
  onClose,
}: {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
  pathname: string
  onClose?: () => void
}) {
  const { theme, setTheme } = useTheme()
  const navGroups = locale === "ar" ? navigationGroupsAr : navigationGroups

  return (
    <div className="falcon-sidebar flex flex-col flex-grow h-full">
      {/* Logo section - Exact Falcon style */}
      <div className="falcon-sidebar-header">
        <div className="falcon-sidebar-brand">
          <div className="falcon-sidebar-logo">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="falcon-sidebar-title">BrandSpace</div>
            <div className="falcon-sidebar-subtitle">Admin Panel</div>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Search - Falcon style */}
      <div className="falcon-nav-section">
        <div className="falcon-search">
          <Search className="falcon-search-icon" />
          <Input
            placeholder={locale === "ar" ? "البحث..." : "Search..."}
            className="falcon-search-input text-slate-900 placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Navigation - Exact Falcon structure */}
      <nav className="flex-1 px-4 pb-6 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            <div className="falcon-nav-title">{group.title}</div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn("falcon-nav-item", isActive && "active", locale === "ar" && "flex-row-reverse")}
                  >
                    <item.icon className="falcon-nav-icon" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer controls - Clean Falcon style */}
      <div className="p-4 border-t border-slate-100 space-y-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLocaleChange(locale === "en" ? "ar" : "en")}
          className={cn(
            "w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50",
            locale === "ar" && "flex-row-reverse",
          )}
        >
          <Globe className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
          {locale === "en" ? "العربية" : "English"}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn(
            "w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50",
            locale === "ar" && "flex-row-reverse",
          )}
        >
          {theme === "light" ? (
            <Moon className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
          ) : (
            <Sun className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
          )}
          {theme === "light"
            ? locale === "ar"
              ? "الوضع المظلم"
              : "Dark Mode"
            : locale === "ar"
              ? "الوضع المضيء"
              : "Light Mode"}
        </Button>
      </div>
    </div>
  )
}
