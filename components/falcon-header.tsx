"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Bell, Search, Settings, User, LogOut, Menu, Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface HeaderProps {
  title: string
  subtitle?: string
  locale: "en" | "ar"
  onMenuClick?: () => void
}

export function FalconHeader({ title, subtitle, locale, onMenuClick }: HeaderProps) {
  return (
    <header className={cn("sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm", locale === "ar" && "rtl")}>
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left side - Mobile menu + Title */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>

          {/* Logo for mobile */}
          <div className="flex items-center space-x-3 lg:hidden">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-slate-100 p-1">
              <Image
                src="/brandspace-logo.jpeg"
                alt="BrandSpace"
                width={32}
                height={32}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-[#1a365d]">BrandSpace</span>
          </div>

          <div className="hidden lg:block">
            <h1 className="text-2xl font-bold text-[#1a365d] mb-1">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
        </div>

        {/* Center - Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder={locale === "ar" ? "البحث..." : "Search..."}
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-[#1a365d] transition-colors"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Language Toggle */}
          <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 hover:text-[#1a365d]">
            <Globe className="h-4 w-4 mr-2" />
            {locale === "en" ? "العربية" : "English"}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative text-slate-600 hover:text-[#1a365d]">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-[#e53e3e] hover:bg-[#e53e3e]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="text-[#1a365d]">
                {locale === "ar" ? "الإشعارات" : "Notifications"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <p className="text-sm font-medium text-[#1a365d]">New inquiry received</p>
                  <p className="text-xs text-slate-600">2 minutes ago</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 border border-green-100">
                  <p className="text-sm font-medium text-[#1a365d]">Payment completed</p>
                  <p className="text-xs text-slate-600">1 hour ago</p>
                </div>
                <div className="p-3 rounded-lg bg-orange-50 border border-orange-100">
                  <p className="text-sm font-medium text-[#1a365d]">New user registered</p>
                  <p className="text-xs text-slate-600">3 hours ago</p>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-[#1a365d]">
                  <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                  <AvatarFallback className="bg-[#1a365d] text-white">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-[#1a365d]">Admin User</p>
                  <p className="text-xs leading-none text-slate-600">admin@brandspace.com</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-slate-700 hover:text-[#1a365d]">
                <User className="mr-2 h-4 w-4" />
                <span>{locale === "ar" ? "الملف الشخصي" : "Profile"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-slate-700 hover:text-[#1a365d]">
                <Settings className="mr-2 h-4 w-4" />
                <span>{locale === "ar" ? "الإعدادات" : "Settings"}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-[#e53e3e] hover:text-[#e53e3e] hover:bg-red-50">
                <LogOut className="mr-2 h-4 w-4" />
                <span>{locale === "ar" ? "تسجيل الخروج" : "Log out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile title */}
      <div className="lg:hidden px-6 pb-4">
        <h1 className="text-xl font-bold text-[#1a365d] mb-1">{title}</h1>
        {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
      </div>
    </header>
  )
}
