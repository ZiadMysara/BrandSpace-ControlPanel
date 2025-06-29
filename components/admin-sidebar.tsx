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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Malls", href: "/admin/malls", icon: Building2 },
  { name: "Shops", href: "/admin/shops", icon: ShoppingBag },
  { name: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Reports", href: "/admin/reports", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

const navigationAr = [
  { name: "لوحة التحكم", href: "/admin", icon: Home },
  { name: "المستخدمين", href: "/admin/users", icon: Users },
  { name: "المولات", href: "/admin/malls", icon: Building2 },
  { name: "المحلات", href: "/admin/shops", icon: ShoppingBag },
  { name: "الاستفسارات", href: "/admin/inquiries", icon: MessageSquare },
  { name: "الحجوزات", href: "/admin/bookings", icon: Calendar },
  { name: "المدفوعات", href: "/admin/payments", icon: CreditCard },
  { name: "التقارير", href: "/admin/reports", icon: BarChart3 },
  { name: "الإشعارات", href: "/admin/notifications", icon: Bell },
  { name: "الإعدادات", href: "/admin/settings", icon: Settings },
]

interface AdminSidebarProps {
  locale: "en" | "ar"
  onLocaleChange: (locale: "en" | "ar") => void
}

export function AdminSidebar({ locale, onLocaleChange }: AdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card transform transition-transform duration-300 ease-in-out lg:hidden",
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
          "hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col",
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
          className={cn("fixed top-4 z-40", locale === "ar" ? "right-4" : "left-4")}
        >
          <Menu className="h-6 w-6" />
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
  const navItems = locale === "ar" ? navigationAr : navigation

  return (
    <div className="flex flex-col flex-grow bg-card border-r border-border">
      {/* Logo section with Brand Space styling */}
      <div className="flex items-center justify-between p-6 brandspace-gradient">
        <div className="flex items-center justify-center w-full">
          <div className="backdrop-blur-sm bg-white/10 rounded-lg border border-white/20 shadow-lg p-3">
            <Image
              src="/brandspace-logo.jpeg"
              alt="Brand Space Logo"
              width={120}
              height={40}
              className="object-contain"
            />
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden text-white hover:bg-white/20 absolute right-4"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200",
                isActive
                  ? "bg-[#1a365d] text-white shadow-md"
                  : "text-muted-foreground hover:bg-accent/10 hover:text-[#1a365d]",
                locale === "ar" && "flex-row-reverse",
              )}
            >
              <item.icon className={cn("h-5 w-5", locale === "ar" ? "ml-3" : "mr-3")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* Footer controls */}
      <div className="p-4 border-t space-y-2">
        {/* Language toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLocaleChange(locale === "en" ? "ar" : "en")}
          className={cn("w-full justify-start hover:bg-accent/10", locale === "ar" && "flex-row-reverse")}
        >
          <Globe className={cn("h-4 w-4", locale === "ar" ? "ml-2" : "mr-2")} />
          {locale === "en" ? "العربية" : "English"}
        </Button>

        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className={cn("w-full justify-start hover:bg-accent/10", locale === "ar" && "flex-row-reverse")}
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
