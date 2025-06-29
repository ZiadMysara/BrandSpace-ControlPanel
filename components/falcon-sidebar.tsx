"use client"

import { useState, useEffect } from "react"
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
  ChevronDown,
  Menu,
  X,
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
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()

  // Handle mounting to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Update CSS custom property for sidebar state
  useEffect(() => {
    if (isMounted) {
      document.documentElement.style.setProperty(
        '--sidebar-width',
        isCollapsed ? '64px' : '288px'
      )
    }
  }, [isCollapsed, isMounted])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen)
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Mobile Menu Button - Fixed position */}
      <Button
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        size="icon"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-lg",
          // Desktop behavior
          "lg:translate-x-0",
          isCollapsed ? "lg:w-16" : "lg:w-72",
          // Mobile behavior
          isMobileOpen ? "translate-x-0 w-72" : "-translate-x-full w-72 lg:translate-x-0",
          locale === "ar" && "right-0 left-auto"
        )}
      >
        <SidebarContent
          locale={locale}
          onLocaleChange={onLocaleChange}
          pathname={pathname}
          isCollapsed={isCollapsed}
          onToggle={toggleSidebar}
          onMobileClose={() => setIsMobileOpen(false)}
        />
      </div>
    </>
  )
}

interface SidebarContentProps {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
  pathname: string
  isCollapsed: boolean
  onToggle: () => void
  onMobileClose: () => void
}

function SidebarContent({
  locale,
  onLocaleChange,
  pathname,
  isCollapsed,
  onToggle,
  onMobileClose,
}: SidebarContentProps) {
  const { theme, setTheme } = useTheme()
  const navGroups = locale === "ar" ? navigationGroupsAr : navigationGroups

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900">BrandSpace</h1>
              <p className="text-xs text-slate-500">Control Panel</p>
            </div>
          </div>
        )}
        
        {/* Toggle Button - Hidden on mobile */}
        <Button
          onClick={onToggle}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 hidden lg:flex"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Close Button */}
        <Button
          onClick={onMobileClose}
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 lg:hidden"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Search - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={locale === "ar" ? "البحث..." : "Search..."}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-blue-500 text-slate-900"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {navGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="space-y-2">
            {!isCollapsed && (
              <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {group.title}
              </h3>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onMobileClose}
                    className={cn(
                      "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                      "hover:bg-slate-50 hover:text-slate-900",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/20",
                      isActive
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : "text-slate-600",
                      isCollapsed && "justify-center px-2",
                      locale === "ar" && "flex-row-reverse"
                    )}
                    title={isCollapsed ? item.name : undefined}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0",
                      !isCollapsed && (locale === "ar" ? "ml-3" : "mr-3"),
                      isActive ? "text-blue-600" : "text-slate-500"
                    )} />
                    {!isCollapsed && (
                      <span className="flex-1">{item.name}</span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Controls */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-100 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLocaleChange(locale === "en" ? "ar" : "en")}
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            <Globe className="h-4 w-4 mr-2" />
            <span>{locale === "en" ? "العربية" : "English"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="w-full justify-start text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4 mr-2" />
            ) : (
              <Sun className="h-4 w-4 mr-2" />
            )}
            <span>
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
      )}
    </div>
  )
}